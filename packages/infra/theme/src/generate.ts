import type { ThemeConfig } from "./schema";

interface GenerateOptions {
  /** Section package names to generate @source directives for */
  sections?: string[];
}

export function generateThemeCSS(theme: ThemeConfig, options?: GenerateOptions): string {
  const parts: string[] = [];

  // 1. Tailwind import
  parts.push('@import "tailwindcss";');
  parts.push("");

  // 2. @source directives for sections
  if (options?.sections?.length) {
    for (const section of options.sections) {
      const dirName = section.replace("@velo/", "");
      parts.push(`@source "../../sections/${dirName}/src";`);
    }
    parts.push("");
  }

  // 3. CSS custom properties in :root
  parts.push(":root {");

  // Colors
  for (const [key, value] of Object.entries(theme.colors)) {
    parts.push(`  --color-${key}: ${value};`);
  }

  // Fonts
  parts.push(`  --font-display: "${theme.fonts.display}";`);
  parts.push(`  --font-body: "${theme.fonts.body}";`);

  // Layout
  parts.push(`  --max-w-content: ${theme.layout.maxWidth};`);
  parts.push(`  --padding-section: ${theme.layout.sectionPadding};`);

  parts.push("}");
  parts.push("");

  // 4. Tailwind v4 @theme inline mappings
  parts.push("@theme inline {");

  for (const key of Object.keys(theme.colors)) {
    parts.push(`  --color-${key}: var(--color-${key});`);
  }
  parts.push("  --font-display: var(--font-display);");
  parts.push("  --font-body: var(--font-body);");
  parts.push("  --max-width-content: var(--max-w-content);");

  parts.push("}");

  // 5. Custom utility classes
  if (theme.utilities) {
    parts.push("");
    for (const [className, properties] of Object.entries(theme.utilities)) {
      parts.push(`.${className} {`);
      for (const [prop, value] of Object.entries(properties)) {
        parts.push(`  ${prop}: ${value};`);
      }
      parts.push("}");
    }
  }

  parts.push("");
  return parts.join("\n");
}
