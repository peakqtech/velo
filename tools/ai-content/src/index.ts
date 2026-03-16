import { parseArgs } from "node:util";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContentPrompt, parseContentResponse, generateContentFile, type SectionInfo } from "./content-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    app: { type: "string", short: "a" },
    business: { type: "string", short: "b" },
    locale: { type: "string", short: "l", default: "en" },
    "dry-run": { type: "boolean", default: false },
  },
});

const appName = positionals[0] || values.app;
if (!appName) {
  console.error("Usage: pnpm ai-content <app-name> --business <name> [--locale en]");
  console.error("\nGenerates AI-powered content for an existing app based on its template.json.");
  process.exit(1);
}

async function main() {
  const appDir = join(ROOT, "apps", appName!);
  const templatePath = join(appDir, "template.json");

  if (!existsSync(templatePath)) {
    console.error(`No template.json found at ${templatePath}`);
    process.exit(1);
  }

  const template = JSON.parse(readFileSync(templatePath, "utf-8"));
  const businessName = values.business || appName;
  const locale = values.locale || "en";

  // Map sections to content info
  const CONSOLIDATED_TYPES: Record<string, string> = {
    Footer: "BaseFooterContent",
    Testimonials: "BaseTestimonialContent",
  };

  const sections: SectionInfo[] = Object.values(template.sections).map((s: any) => ({
    contentKey: s.contentKey,
    component: s.component,
    contentType: CONSOLIDATED_TYPES[s.component] || `${s.component}Content`,
  }));

  const prompt = buildContentPrompt({
    templateName: template.name,
    businessType: template.businessType,
    businessName,
    locale,
    sections,
    contentTypeName: template.contentType,
  });

  if (values["dry-run"]) {
    console.log("=== DRY RUN — Prompt that would be sent to AI ===\n");
    console.log(prompt);
    console.log("\n=== End prompt ===");
    return;
  }

  // Check for ANTHROPIC_API_KEY
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY environment variable is required.");
    console.error("Set it with: export ANTHROPIC_API_KEY=sk-...");
    console.error("\nUse --dry-run to preview the prompt without calling the API.");
    process.exit(1);
  }

  console.log(`\n🤖 Generating content for "${businessName}" (${template.businessType})...`);
  console.log(`   Template: ${template.displayName}`);
  console.log(`   Locale: ${locale}`);
  console.log(`   Sections: ${sections.map((s) => s.contentKey).join(", ")}\n`);

  // Call Claude API
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`API error: ${response.status} ${err}`);
    process.exit(1);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    console.error("No text in API response");
    process.exit(1);
  }

  const content = parseContentResponse(text);
  const file = generateContentFile(content, template.contentType, appName!);

  const outDir = join(appDir, "content", locale);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${appName}.ts`);
  writeFileSync(outPath, file);

  console.log(`✓ Generated content: ${outPath}`);
  console.log(`  ${sections.length} sections filled with AI-generated copy.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
