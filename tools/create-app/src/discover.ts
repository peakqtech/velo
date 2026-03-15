import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

export function getMonorepoRoot(): string {
  return ROOT;
}

export interface TemplateManifest {
  name: string;
  displayName: string;
  description: string;
  businessType: string;
  style: string;
  contentType: string;
  sections: Record<string, { component: string; configExport: string; contentKey: string }>;
}

export function discoverApps(): string[] {
  const appsDir = join(ROOT, "apps");
  if (!existsSync(appsDir)) return [];
  return readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function loadTemplateManifest(appName: string): TemplateManifest | null {
  const manifestPath = join(ROOT, "apps", appName, "template.json");
  if (!existsSync(manifestPath)) return null;
  return JSON.parse(readFileSync(manifestPath, "utf-8"));
}

export function discoverTemplates(): Array<{ name: string; manifest: TemplateManifest }> {
  const apps = discoverApps();
  const templates: Array<{ name: string; manifest: TemplateManifest }> = [];
  for (const app of apps) {
    const manifest = loadTemplateManifest(app);
    if (manifest) {
      templates.push({ name: app, manifest });
    }
  }
  return templates;
}

export function discoverSections(): Array<{ name: string; packageName: string }> {
  const sectionsDir = join(ROOT, "packages/sections");
  if (!existsSync(sectionsDir)) return [];
  return readdirSync(sectionsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pkgPath = join(sectionsDir, d.name, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      return { name: d.name, packageName: pkg.name };
    });
}

export function discoverInfraPackages(): Array<{ name: string; packageName: string }> {
  const infraDir = join(ROOT, "packages/infra");
  if (!existsSync(infraDir)) return [];
  return readdirSync(infraDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pkgPath = join(infraDir, d.name, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      return { name: d.name, packageName: pkg.name };
    });
}
