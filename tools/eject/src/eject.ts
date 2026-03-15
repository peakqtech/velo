import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { rewriteImports } from "./resolve-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

const VALID_APP_NAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

export function eject(appName: string): void {
  if (!appName || !VALID_APP_NAME.test(appName)) {
    throw new Error(`Invalid app name: "${appName}". Use only letters, numbers, hyphens, dots, and underscores.`);
  }

  const appDir = join(ROOT, "apps", appName);
  const outputDir = join(ROOT, "ejected", appName);

  if (!existsSync(appDir)) {
    throw new Error(`App not found: apps/${appName}`);
  }

  if (existsSync(outputDir)) {
    throw new Error(
      `Output directory already exists: ejected/${appName}. Remove it first or use --force.`
    );
  }

  console.log(`Ejecting ${appName}...`);

  // 1. Copy app (excluding sensitive and build files)
  ejectCopy(appDir, outputDir);

  // 2. Copy @velocity/* package sources into local directories
  copyPackageSource("@velocity/types", "packages/infra/types/src", outputDir, "lib/types");
  copyPackageSource("@velocity/scroll-engine", "packages/infra/scroll-engine/src", outputDir, "lib/scroll-engine");
  copyPackageSource("@velocity/animations", "packages/infra/animations/src", outputDir, "lib/animations");
  copyPackageSource("@velocity/motion-components", "packages/infra/motion-components/src", outputDir, "components/motion");
  copyPackageSource("@velocity/i18n", "packages/infra/i18n/src", outputDir, "lib/i18n-utils");
  copyPackageSource("@velocity/ui", "packages/infra/ui/src", outputDir, "components/ui");

  // Copy section packages used by this app
  const appPkg = JSON.parse(readFileSync(join(appDir, "package.json"), "utf-8"));
  const sectionPkgs = Object.keys(appPkg.dependencies || {}).filter(
    (k) => k.startsWith("@velocity/") && !k.match(/types|scroll-engine|animations|motion-components|i18n|ui/)
  );

  for (const pkg of sectionPkgs) {
    const dirName = pkg.replace("@velocity/", "");
    copyPackageSource(pkg, `packages/sections/${dirName}/src`, outputDir, `sections/${dirName}`);
  }

  // 3. Rewrite all @velocity/* imports to relative paths
  rewriteImports(outputDir, outputDir);

  // 4. Generate standalone package.json
  generateStandalonePackageJson(appDir, outputDir, appName);

  // 5. Generate standalone next.config.ts (no transpilePackages)
  const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`;
  writeFileSync(join(outputDir, "next.config.ts"), nextConfig);

  // 6. Generate standalone tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: { "@/*": ["./*"] },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  };
  writeFileSync(
    join(outputDir, "tsconfig.json"),
    JSON.stringify(tsconfig, null, 2) + "\n"
  );

  // 7. Initialize git repo
  execSync("git init", { cwd: outputDir, stdio: "pipe" });
  execSync("git add -A", { cwd: outputDir, stdio: "pipe" });
  execSync('git commit -m "Initial commit (ejected from velocity-monorepo)"', {
    cwd: outputDir,
    stdio: "pipe",
  });

  // 8. Verify the ejected app works
  console.log("\nVerifying ejected app...");
  try {
    execSync("pnpm install", { cwd: outputDir, stdio: "inherit" });
    execSync("pnpm build", { cwd: outputDir, stdio: "inherit" });
    console.log(`\n✓ Ejected and verified: ejected/${appName}/`);
  } catch {
    console.error(`\n⚠ Ejected to ejected/${appName}/ but build verification failed.`);
    console.error("Check the ejected app for import or dependency issues.");
  }
}

/** Excluded file/directory patterns during eject copy */
const EJECT_EXCLUDE = [".env", ".next", "node_modules"];

function shouldExclude(name: string): boolean {
  return EJECT_EXCLUDE.some((pattern) => name === pattern || name.startsWith(pattern + "."));
}

/**
 * Copy app directory to output, excluding sensitive and build files.
 * Exported for testing.
 */
export function ejectCopy(srcDir: string, outputDir: string): void {
  mkdirSync(outputDir, { recursive: true });
  cpSync(srcDir, outputDir, {
    recursive: true,
    filter: (src) => !shouldExclude(basename(src)),
  });
}

function copyPackageSource(
  _pkgName: string,
  srcRelPath: string,
  outputDir: string,
  targetRelPath: string
): void {
  const srcDir = join(ROOT, srcRelPath);
  const targetDir = join(outputDir, targetRelPath);

  if (!existsSync(srcDir)) return;

  mkdirSync(targetDir, { recursive: true });
  cpSync(srcDir, targetDir, { recursive: true });
}

function generateStandalonePackageJson(
  appDir: string,
  outputDir: string,
  appName: string
): void {
  const appPkg = JSON.parse(readFileSync(join(appDir, "package.json"), "utf-8"));

  const runtimeDeps: Record<string, string> = {};

  // App's own non-velocity deps
  for (const [k, v] of Object.entries(appPkg.dependencies as Record<string, string>)) {
    if (!k.startsWith("@velocity/")) {
      runtimeDeps[k] = v;
    }
  }

  // Collect peer deps from ALL consumed @velocity/* packages
  const velocityDeps = Object.keys(appPkg.dependencies || {}).filter(
    (k) => k.startsWith("@velocity/")
  );
  for (const dep of velocityDeps) {
    const dirName = dep.replace("@velocity/", "");
    const candidates = [
      join(ROOT, "packages/sections", dirName, "package.json"),
      join(ROOT, "packages/infra", dirName, "package.json"),
    ];
    for (const pkgPath of candidates) {
      if (!existsSync(pkgPath)) continue;
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      for (const [k, v] of Object.entries((pkg.peerDependencies || {}) as Record<string, string>)) {
        if (!runtimeDeps[k]) runtimeDeps[k] = v;
      }
      break;
    }
  }

  const standalone = {
    name: appName,
    version: "0.0.0",
    private: true,
    scripts: appPkg.scripts,
    dependencies: runtimeDeps,
    devDependencies: appPkg.devDependencies,
  };

  writeFileSync(
    join(outputDir, "package.json"),
    JSON.stringify(standalone, null, 2) + "\n"
  );
}
