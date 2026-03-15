import type { ThemeConfig } from "./schema";

/** Standard Tailwind utilities that are NOT theme-derived */
const BUILTIN_COLORS = new Set([
  "white", "black", "transparent", "current", "inherit",
  // Common Tailwind gray palette names
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green",
  "emerald", "teal", "cyan", "sky", "blue", "indigo",
  "violet", "purple", "fuchsia", "pink", "rose",
]);

function isBuiltinColor(name: string): boolean {
  // Check exact match or palette with shade (e.g., gray-200)
  if (BUILTIN_COLORS.has(name)) return true;
  const base = name.split("-")[0];
  return BUILTIN_COLORS.has(base);
}

interface ValidationResult {
  valid: boolean;
  missing: string[];
}

/**
 * Validate that all theme color/font references in section source code
 * are provided by the theme config.
 *
 * Scans for Tailwind utility patterns like bg-{color}, text-{color}, border-{color},
 * and font-{font} in section source strings.
 */
export function validateThemeCompleteness(
  theme: ThemeConfig,
  sectionSources: string[]
): ValidationResult {
  const themeColors = new Set(Object.keys(theme.colors));
  const themeFonts = new Set(Object.keys(theme.fonts));

  const missing: string[] = [];
  const checked = new Set<string>();

  const combined = sectionSources.join("\n");

  // Match color utility patterns: bg-{name}, text-{name}, border-{name},
  // ring-{name}, outline-{name}, divide-{name}, from-{name}, to-{name}, via-{name}
  // With optional state prefixes (hover:, focus:, etc.) and opacity modifiers (/10)
  const colorPattern = /(?:(?:hover|focus|active|group-hover|dark|sm|md|lg|xl|2xl):)*(?:bg|text|border|ring|outline|divide|from|to|via)-([a-zA-Z][\w-]*?)(?:\/\d+)?(?=[\s"'`;\)])/g;

  let match;
  while ((match = colorPattern.exec(combined)) !== null) {
    const colorName = match[1];
    if (checked.has(colorName)) continue;
    checked.add(colorName);

    // Skip built-in Tailwind colors
    if (isBuiltinColor(colorName)) continue;

    // Check if the color is in the theme
    if (!themeColors.has(colorName)) {
      missing.push(colorName);
    }
  }

  // Match font utility patterns: font-{name}
  const fontPattern = /(?:(?:hover|focus|active):)*font-(display|body|[\w-]+?)(?=[\s"'`;\)])/g;
  while ((match = fontPattern.exec(combined)) !== null) {
    const fontName = match[1];
    if (checked.has(`font:${fontName}`)) continue;
    checked.add(`font:${fontName}`);

    // Skip built-in font utilities (normal, bold, thin, etc.)
    if (["normal", "bold", "semibold", "medium", "light", "thin", "extrabold", "black", "extralight", "sans", "serif", "mono"].includes(fontName)) continue;

    if (!themeFonts.has(fontName)) {
      missing.push(`font:${fontName}`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
