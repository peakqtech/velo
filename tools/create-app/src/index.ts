import { parseArgs } from "node:util";
import { discoverApps, discoverSections, discoverTemplates } from "./discover";
import { promptAppName, promptSourceApp, promptSections, promptLocales } from "./prompts";
import { generate } from "./generate";

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      from: { type: "string" },
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
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
