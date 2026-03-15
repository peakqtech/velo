import { parseArgs } from "node:util";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { discoverApps, discoverSections, discoverTemplates, getMonorepoRoot } from "./discover";
import { promptAppName, promptSourceApp, promptSections, promptLocales } from "./prompts";
import { generate } from "./generate";

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      from: { type: "string" },
      preview: { type: "boolean", default: false },
    },
  });

  const apps = discoverApps();
  if (apps.length === 0) {
    console.error("No apps found in apps/ directory.");
    process.exit(1);
  }

  const sections = discoverSections();
  if (sections.length === 0) {
    console.error("No section packages found in packages/sections/.");
    process.exit(1);
  }

  const templates = discoverTemplates();

  const appName = positionals[0] || (await promptAppName());
  const sourceApp = values.from || (await promptSourceApp(apps, templates));

  if (!apps.includes(sourceApp)) {
    console.error(`Source app "${sourceApp}" not found. Available: ${apps.join(", ")}`);
    process.exit(1);
  }

  const selectedSections = await promptSections(sections);
  const selectedLocales = await promptLocales();

  generate({
    appName,
    sourceApp,
    sections: selectedSections,
    locales: selectedLocales,
  });

  if (values.preview) {
    const root = getMonorepoRoot();
    const appDir = join(root, "apps", appName);
    console.log(`\n🚀 Launching preview...`);
    console.log(`   Running pnpm install && pnpm dev in apps/${appName}\n`);

    const child = spawn("pnpm", ["dev"], {
      cwd: appDir,
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (err) => {
      console.error(`Preview failed: ${err.message}`);
    });

    // Keep process alive while dev server runs
    process.on("SIGINT", () => {
      child.kill("SIGINT");
      process.exit(0);
    });

    await new Promise(() => {}); // Block until killed
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
