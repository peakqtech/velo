import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { getMonorepoRoot, discoverInfraPackages, loadTemplateManifest } from "./discover";
import type { TemplateManifest } from "./template-schema";

type SectionMeta = TemplateManifest["sections"][string];

interface GenerateOptions {
  appName: string;
  sourceApp: string;
  sections: string[];
  locales: string[];
}

const VALID_APP_NAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

export function generate(opts: GenerateOptions): void {
  if (!opts.appName || !VALID_APP_NAME.test(opts.appName)) {
    throw new Error(`Invalid app name: "${opts.appName}". Use only letters, numbers, hyphens, dots, and underscores.`);
  }
  if (opts.sections.length === 0) {
    throw new Error("At least one section is required");
  }
  if (opts.locales.length === 0) {
    throw new Error("At least one locale is required");
  }

  const root = getMonorepoRoot();
  const sourceDir = join(root, "apps", opts.sourceApp);
  const targetDir = join(root, "apps", opts.appName);

  if (existsSync(targetDir)) {
    throw new Error(`App directory already exists: ${targetDir}`);
  }

  // Load section metadata from template.json (fall back to section packages)
  const manifest = loadTemplateManifest(opts.sourceApp);
  const SECTION_META: Record<string, SectionMeta> = manifest?.sections ?? {};

  // 1. Copy source app
  cpSync(sourceDir, targetDir, { recursive: true });

  // 2. Remove build artifacts if copied
  const dirsToClean = [".next", "node_modules"];
  for (const dir of dirsToClean) {
    const p = join(targetDir, dir);
    if (existsSync(p)) {
      rmSync(p, { recursive: true });
    }
  }

  // 3. Generate package.json
  const infraPkgs = discoverInfraPackages();
  const sectionDeps: Record<string, string> = {};
  for (const pkg of opts.sections) {
    sectionDeps[pkg] = "workspace:*";
  }
  const infraDeps: Record<string, string> = {};
  for (const pkg of infraPkgs) {
    infraDeps[pkg.packageName] = "workspace:*";
  }

  const sourcePkg = JSON.parse(
    readFileSync(join(sourceDir, "package.json"), "utf-8")
  );

  const appPkg = {
    name: opts.appName,
    version: "0.0.0",
    private: true,
    scripts: sourcePkg.scripts,
    dependencies: {
      ...Object.fromEntries(
        Object.entries(sourcePkg.dependencies as Record<string, string>).filter(
          ([k]) => !k.startsWith("@velo/")
        )
      ),
      ...infraDeps,
      ...sectionDeps,
    },
    devDependencies: sourcePkg.devDependencies,
  };
  writeFileSync(
    join(targetDir, "package.json"),
    JSON.stringify(appPkg, null, 2) + "\n"
  );

  // 4. Generate next.config.ts with transpilePackages
  const allVelocityPkgs = [
    ...infraPkgs.map((p) => p.packageName),
    ...opts.sections,
  ];
  const nextConfigContent = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ${JSON.stringify(allVelocityPkgs, null, 4)},
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https:",
            "frame-ancestors 'none'",
          ].join("; "),
        },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
`;
  writeFileSync(join(targetDir, "next.config.ts"), nextConfigContent);

  // 5. Generate .gitignore
  const gitignoreContent = `node_modules/
.next/
out/
build/
.DS_Store
*.pem
.env*
.vercel
*.tsbuildinfo
next-env.d.ts
`;
  writeFileSync(join(targetDir, ".gitignore"), gitignoreContent);

  // 6. Generate page-client.tsx with selected sections
  generatePageClient(targetDir, opts.sections, SECTION_META, manifest?.contentType ?? "VelocityContent");

  // 6. Generate content stubs for selected locales
  for (const locale of opts.locales) {
    generateContentStub(targetDir, opts.appName, locale, opts.sections, SECTION_META, manifest?.contentType ?? "VelocityContent");
  }

  // 7. Generate lib/i18n.ts
  generateI18n(targetDir, opts.appName, opts.locales, manifest?.contentType ?? "VelocityContent");

  console.log(`\n✓ Created apps/${opts.appName} with ${opts.sections.length} sections`);
  console.log(`✓ Locales: ${opts.locales.join(", ")}`);
  console.log(`\nNext steps:`);
  console.log(`  pnpm install (from monorepo root)`);
  console.log(`  cd apps/${opts.appName} && pnpm dev`);
}

function generatePageClient(
  targetDir: string,
  sections: string[],
  SECTION_META: Record<string, SectionMeta>,
  contentType: string
): void {
  const imports: string[] = [];
  const configs: string[] = [];
  const components: string[] = [];
  let needsLocaleSwitcher = false;

  for (const pkg of sections) {
    const meta = SECTION_META[pkg];
    if (!meta) continue;
    imports.push(
      `import { ${meta.component}, ${meta.configExport} } from "${pkg}";`
    );
    configs.push(meta.configExport);

    // Build extra props from template.json extraProps field
    const extraPropParts: string[] = [];
    if (meta.extraProps) {
      for (const [key, value] of Object.entries(meta.extraProps)) {
        if (typeof value === "string" && value.startsWith("<") && value.endsWith("/>")) {
          // JSX expression — render as JSX (unwrapped)
          extraPropParts.push(`${key}={${value}}`);
          if (value.includes("LocaleSwitcher")) {
            needsLocaleSwitcher = true;
          }
        } else {
          // Literal value
          extraPropParts.push(`${key}={${JSON.stringify(value)}}`);
        }
      }
    }

    const extraPropsStr = extraPropParts.length > 0 ? " " + extraPropParts.join(" ") : "";
    components.push(
      `      <${meta.component} content={content.${meta.contentKey}}${extraPropsStr} />`
    );
  }

  const content = `"use client";

${imports.join("\n")}
import { useScrollEngine } from "@velo/scroll-engine";
import type { ${contentType} } from "@velo/types";
${needsLocaleSwitcher ? 'import { LocaleSwitcher } from "@/components/locale-switcher";' : ""}

const scrollConfigs = [
  ${configs.join(",\n  ")},
];

interface PageClientProps {
  content: ${contentType};
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);

  return (
    <main>
${components.join("\n")}
    </main>
  );
}
`;
  mkdirSync(join(targetDir, "app/[locale]"), { recursive: true });
  writeFileSync(join(targetDir, "app/[locale]/page-client.tsx"), content);
}

function generateContentStub(
  targetDir: string,
  appName: string,
  locale: string,
  sections: string[],
  SECTION_META: Record<string, SectionMeta>,
  contentType: string
): void {
  const stubs: string[] = [];

  for (const pkg of sections) {
    const meta = SECTION_META[pkg];
    if (!meta) continue;
    stubs.push(`  ${meta.contentKey}: {} as any, // TODO: fill in ${meta.component} content`);
  }

  const content = `import type { ${contentType} } from "@velo/types";

const content: ${contentType} = {
${stubs.join("\n")}
  metadata: {
    title: "${appName}",
    description: "TODO: add description",
    ogImage: "/images/og-image.jpg",
  },
};

export default content;
`;
  const dir = join(targetDir, "content", locale);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${appName}.ts`), content);
}

function generateI18n(targetDir: string, appName: string, locales: string[], contentType: string): void {
  const content = `import { createContentLoader } from "@velo/i18n";
import type { ${contentType} } from "@velo/types";

export const defaultLocale = "${locales[0]}";
export const locales = ${JSON.stringify(locales)} as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export const getContent = createContentLoader<${contentType}>(
  { defaultLocale, locales },
  (locale) =>
    import(\`../content/\${locale}/${appName}\`).then((m) => m.default)
);
`;
  mkdirSync(join(targetDir, "lib"), { recursive: true });
  writeFileSync(join(targetDir, "lib/i18n.ts"), content);
}
