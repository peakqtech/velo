import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

// Resolve the apps directory relative to the dashboard app
const APPS_DIR = resolve(process.cwd(), "..");

interface TemplateInfo {
  name: string;
  displayName: string;
  description: string;
  businessType: string;
  style: string;
  sectionCount: number;
}

function loadTemplates(): TemplateInfo[] {
  try {
    const dirs = readdirSync(APPS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.endsWith("-template"));

    return dirs
      .map((dir) => {
        const templatePath = join(APPS_DIR, dir.name, "template.json");
        if (!existsSync(templatePath)) return null;

        const template = JSON.parse(readFileSync(templatePath, "utf-8"));
        return {
          name: template.name,
          displayName: template.displayName,
          description: template.description,
          businessType: template.businessType,
          style: template.style,
          sectionCount: Object.keys(template.sections || {}).length,
        };
      })
      .filter(Boolean) as TemplateInfo[];
  } catch {
    return [];
  }
}

function loadDefaultContent(templateName: string): Record<string, unknown> | null {
  try {
    // Find the template directory
    const dirs = readdirSync(APPS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.endsWith("-template"));

    for (const dir of dirs) {
      const templatePath = join(APPS_DIR, dir.name, "template.json");
      if (!existsSync(templatePath)) continue;

      const template = JSON.parse(readFileSync(templatePath, "utf-8"));
      if (template.name !== templateName) continue;

      // Find the content file
      const contentDir = join(APPS_DIR, dir.name, "content", "en");
      if (!existsSync(contentDir)) return {};

      const contentFiles = readdirSync(contentDir).filter((f) => f.endsWith(".ts"));
      if (contentFiles.length === 0) return {};

      // Read the TS content file and extract the object literal
      // For simplicity, we read the raw file and parse the exported object
      const contentPath = join(contentDir, contentFiles[0]);
      const raw = readFileSync(contentPath, "utf-8");

      // Extract the content object between the first { and the matching }
      // This is a simplified parser — works for our generated content files
      const match = raw.match(/const content[^=]*=\s*(\{[\s\S]*\})\s*(?:as\s|;)/);
      if (!match) return {};

      // Use Function constructor to evaluate the object literal (safe since it's our own file)
      try {
        const fn = new Function(`return ${match[1]}`);
        return fn();
      } catch {
        return {};
      }
    }
    return null;
  } catch {
    return null;
  }
}

// GET /api/templates — list available templates
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const withContent = searchParams.get("withContent");

  const templates = loadTemplates();

  if (withContent) {
    const content = loadDefaultContent(withContent);
    return NextResponse.json({ templates, defaultContent: content });
  }

  return NextResponse.json({ templates });
}
