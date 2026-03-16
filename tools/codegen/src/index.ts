import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { generateAllContentTypes } from "./generate-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

const outputDir = join(ROOT, "packages/infra/types/src/generated");
mkdirSync(outputDir, { recursive: true });

const results = generateAllContentTypes(ROOT);

for (const [name, source] of Object.entries(results)) {
  const outPath = join(outputDir, `${name}-content.generated.ts`);
  writeFileSync(outPath, source);
  console.log(`✓ Generated ${outPath}`);
}

console.log(`\n✓ Generated content types for ${Object.keys(results).length} templates.`);
