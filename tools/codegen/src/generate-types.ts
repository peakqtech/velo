import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

interface SectionEntry {
  component: string;
  contentKey: string;
  configExport?: string;
  extraProps?: Record<string, unknown>;
}

interface ManifestInput {
  name: string;
  contentType: string;
  sections: Record<string, SectionEntry>;
}

/** Consolidated sections that use base types instead of component-derived types */
const CONSOLIDATED_TYPE_MAP: Record<string, string> = {
  Footer: "BaseFooterContent",
  Testimonials: "BaseTestimonialContent",
};

function deriveContentTypeName(component: string): string {
  // Check if this is a consolidated component with a base type
  if (CONSOLIDATED_TYPE_MAP[component]) {
    return CONSOLIDATED_TYPE_MAP[component];
  }
  return `${component}Content`;
}

/**
 * Generate a composite content type interface from a template manifest.
 */
export function generateContentType(manifest: ManifestInput): string {
  const lines: string[] = [];

  lines.push("// Auto-generated from template.json — DO NOT EDIT manually.");
  lines.push(`// Run \`pnpm codegen\` to regenerate.`);
  lines.push("");

  // Collect all content type names
  const typeImports = new Set<string>();
  const fields: Array<{ key: string; type: string }> = [];

  for (const section of Object.values(manifest.sections)) {
    const typeName = deriveContentTypeName(section.component);
    typeImports.add(typeName);
    fields.push({ key: section.contentKey, type: typeName });
  }

  typeImports.add("BaseMetadata");

  // Generate import (from relative path within types package)
  // These types are defined in the same package, so we use local imports
  const baseTypes = ["BaseMetadata", "BaseFooterContent", "BaseTestimonialContent"];
  const baseImports = [...typeImports].filter((t) => baseTypes.includes(t));
  const sectionImports = [...typeImports].filter((t) => !baseTypes.includes(t));

  if (baseImports.length > 0) {
    lines.push(`import type { ${baseImports.sort().join(", ")} } from "../base";`);
  }

  // Section types come from their respective content files
  // For the velocity template, they're in content.ts
  // For other templates, they're in {name}-content.ts
  if (sectionImports.length > 0) {
    // Determine which file to import from based on template name
    if (manifest.name === "velocity") {
      lines.push(`import type { ${sectionImports.sort().join(", ")} } from "../content";`);
    } else {
      lines.push(`import type { ${sectionImports.sort().join(", ")} } from "../${manifest.name}-content";`);
    }
  }

  lines.push("");

  // Generate interface
  lines.push(`export interface ${manifest.contentType} {`);
  for (const field of fields) {
    lines.push(`  ${field.key}: ${field.type};`);
  }
  lines.push("  metadata: BaseMetadata;");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate content types for all templates in apps/ directory.
 * Returns a map of template name → generated TypeScript source.
 */
export function generateAllContentTypes(root: string): Record<string, string> {
  const appsDir = join(root, "apps");
  const results: Record<string, string> = {};

  for (const dir of readdirSync(appsDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;

    const manifestPath = join(appsDir, dir.name, "template.json");
    if (!existsSync(manifestPath)) continue;

    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    if (!manifest.contentType || !manifest.sections) continue;

    results[manifest.name] = generateContentType(manifest);
  }

  return results;
}
