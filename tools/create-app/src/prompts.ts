import Enquirer from "enquirer";
import type { TemplateManifest } from "./discover";

const enquirer = new Enquirer();

export async function promptAppName(defaultName?: string): Promise<string> {
  const { name } = await enquirer.prompt<{ name: string }>({
    type: "input",
    name: "name",
    message: "App name (kebab-case):",
    initial: defaultName,
    validate: (v: string) =>
      /^[a-z][a-z0-9-]*$/.test(v) || "Must be kebab-case (e.g., acme-corp)",
  });
  return name;
}

export async function promptSourceApp(
  apps: string[],
  templates?: Array<{ name: string; manifest: TemplateManifest }>
): Promise<string> {
  const choices = apps.map((app) => {
    const tmpl = templates?.find((t) => t.name === app);
    const hint = tmpl ? ` — ${tmpl.manifest.description}` : "";
    return { name: app, message: `${app}${hint}`, value: app };
  });

  const { source } = await enquirer.prompt<{ source: string }>({
    type: "select",
    name: "source",
    message: "Source app (template):",
    choices,
  });
  return source;
}

export async function promptSections(
  sections: Array<{ name: string; packageName: string }>
): Promise<string[]> {
  const { selected } = await enquirer.prompt<{ selected: string[] }>({
    type: "multiselect",
    name: "selected",
    message: "Select sections to include:",
    choices: sections.map((s) => ({ name: s.packageName, value: s.packageName })),
    initial: sections.map((_, i) => i),
  });
  return selected;
}

export async function promptLocales(): Promise<string[]> {
  const { locales } = await enquirer.prompt<{ locales: string[] }>({
    type: "multiselect",
    name: "locales",
    message: "Select locales:",
    choices: [
      { name: "en", value: "en" },
      { name: "id", value: "id" },
      { name: "ja", value: "ja" },
      { name: "zh", value: "zh" },
    ],
    initial: [0],
  });
  return locales;
}
