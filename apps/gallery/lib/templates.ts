import { readdirSync, readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const APPS_DIR = resolve(process.cwd(), "..");

export interface TemplateInfo {
  dirName: string;
  name: string;
  displayName: string;
  description: string;
  businessType: string;
  style: string;
  contentType: string;
  sectionCount: number;
  sections: string[];
  colors?: Record<string, string>;
  fonts?: { display: string; body: string };
}

export function loadTemplates(): TemplateInfo[] {
  const dirs = readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== "gallery" && d.name.endsWith("-template"));

  return dirs.map(dir => {
    const templatePath = join(APPS_DIR, dir.name, "template.json");
    const themePath = join(APPS_DIR, dir.name, "theme.json");

    if (!existsSync(templatePath)) return null;

    const template = JSON.parse(readFileSync(templatePath, "utf-8"));
    const theme = existsSync(themePath) ? JSON.parse(readFileSync(themePath, "utf-8")) : null;

    return {
      dirName: dir.name,
      name: template.name,
      displayName: template.displayName,
      description: template.description,
      businessType: template.businessType,
      style: template.style,
      contentType: template.contentType,
      sectionCount: Object.keys(template.sections).length,
      sections: Object.values(template.sections).map((s: any) => s.component),
      colors: theme?.colors,
      fonts: theme?.fonts,
    };
  }).filter(Boolean) as TemplateInfo[];
}
