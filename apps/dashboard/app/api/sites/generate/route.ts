import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { cpSync, readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, resolve } from "path";

const APPS_DIR = resolve(process.cwd(), "..");

/**
 * POST /api/sites/generate
 *
 * Generates a new app directory from a template, creates a DB record,
 * and wires selected features. This is the backend for the site creation wizard.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, template, clientId, domain, description, features } = await req.json();

  if (!name || !template) {
    return NextResponse.json({ error: "Name and template are required" }, { status: 400 });
  }

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const appDirName = slug;
  const appDir = join(APPS_DIR, appDirName);

  // Check if app directory already exists
  if (existsSync(appDir)) {
    return NextResponse.json(
      { error: `Directory apps/${appDirName} already exists` },
      { status: 409 }
    );
  }

  // Find the source template directory
  const sourceDir = findTemplateDir(template);
  if (!sourceDir) {
    return NextResponse.json(
      { error: `Template "${template}" not found` },
      { status: 404 }
    );
  }

  try {
    // 1. Copy template directory to new app
    cpSync(sourceDir, appDir, {
      recursive: true,
      filter: (src) => {
        // Skip node_modules, .next, .env files
        const rel = src.replace(sourceDir, "");
        if (rel.includes("node_modules")) return false;
        if (rel.includes(".next")) return false;
        if (rel.includes(".env.local")) return false;
        return true;
      },
    });

    // 2. Update package.json with client's name and unique port
    const pkgPath = join(appDir, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      pkg.name = appDirName;

      // Assign unique dev port (find next available from 3020+)
      const nextPort = findNextAvailablePort();
      const devScript = pkg.scripts?.dev ?? "next dev";
      pkg.scripts = {
        ...pkg.scripts,
        dev: devScript.replace(/--port \d+/, `--port ${nextPort}`).replace(/next dev$/, `next dev --port ${nextPort}`),
      };

      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    }

    // 3. Create .env.local with VELO_SITE_ID (will be set after DB record)
    // We'll update this after creating the DB record

    // 4. Read default content from the template
    let defaultContent = {};
    try {
      const contentDir = join(sourceDir, "content", "en");
      if (existsSync(contentDir)) {
        const contentFiles = readdirSync(contentDir).filter((f) => f.endsWith(".ts"));
        if (contentFiles.length > 0) {
          const raw = readFileSync(join(contentDir, contentFiles[0]), "utf-8");
          const match = raw.match(/const content[^=]*=\s*(\{[\s\S]*\})\s*(?:as\s|;)/);
          if (match) {
            try {
              const fn = new Function(`return ${match[1]}`);
              defaultContent = fn();
            } catch { /* use empty */ }
          }
        }
      }
    } catch { /* use empty content */ }

    // 5. Create DB record
    const site = await prisma.site.create({
      data: {
        name,
        slug,
        template,
        domain: domain || undefined,
        clientId: clientId || undefined,
        ownerId: session.user.id,
        content: defaultContent,
        deployStatus: "PENDING",
      },
    });

    // 6. Write .env.local with site ID and DB connection
    const envContent = [
      `VELO_SITE_ID="${site.id}"`,
      `DATABASE_URL="${process.env.DATABASE_URL ?? ""}"`,
      `DIRECT_URL="${process.env.DIRECT_URL ?? ""}"`,
    ].join("\n") + "\n";
    writeFileSync(join(appDir, ".env.local"), envContent);

    // 7. Store selected features in the site record
    if (features && Array.isArray(features)) {
      for (const feature of features) {
        await prisma.siteIntegration.create({
          data: {
            siteId: site.id,
            integration: feature,
            enabled: true,
            config: {},
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        name: site.name,
        slug: site.slug,
        appDir: `apps/${appDirName}`,
        template,
      },
      message: `Site generated at apps/${appDirName}. Run \`pnpm install\` then \`pnpm --filter ${appDirName} dev\` to start.`,
    }, { status: 201 });

  } catch (error) {
    // Cleanup on failure
    try {
      const { rmSync } = require("fs");
      rmSync(appDir, { recursive: true, force: true });
    } catch { /* ignore cleanup error */ }

    console.error("Site generation error:", error);
    return NextResponse.json(
      { error: `Failed to generate site: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}

function findTemplateDir(templateName: string): string | null {
  // Check for exact match first (e.g., "tropica" → "tropica-template")
  const exactMatch = join(APPS_DIR, `${templateName}-template`);
  if (existsSync(join(exactMatch, "package.json"))) return exactMatch;

  // Search all app directories for matching template.json
  const dirs = readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.endsWith("-template"));

  for (const dir of dirs) {
    const templateJsonPath = join(APPS_DIR, dir.name, "template.json");
    if (existsSync(templateJsonPath)) {
      const tpl = JSON.parse(readFileSync(templateJsonPath, "utf-8"));
      if (tpl.name === templateName) return join(APPS_DIR, dir.name);
    }
  }

  return null;
}

function findNextAvailablePort(): number {
  // Scan existing package.json files for dev ports
  const usedPorts = new Set<number>();
  const dirs = readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const dir of dirs) {
    const pkgPath = join(APPS_DIR, dir.name, "package.json");
    if (!existsSync(pkgPath)) continue;
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const devScript = pkg.scripts?.dev ?? "";
      const portMatch = devScript.match(/--port\s+(\d+)/);
      if (portMatch) usedPorts.add(parseInt(portMatch[1]));
    } catch { /* skip */ }
  }

  // Start from 3020 for generated sites
  let port = 3020;
  while (usedPorts.has(port)) port++;
  return port;
}
