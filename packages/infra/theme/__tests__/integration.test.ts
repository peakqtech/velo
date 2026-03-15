import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { themeSchema } from "../src/schema";
import { generateThemeCSS } from "../src/generate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../../..");

const TEMPLATES = [
  "velocity-template",
  "ember-template",
  "haven-template",
  "nexus-template",
  "prism-template",
  "serenity-template",
];

describe("theme.json integration", () => {
  for (const template of TEMPLATES) {
    describe(template, () => {
      const themePath = join(ROOT, "apps", template, "theme.json");

      it("has a valid theme.json", () => {
        expect(existsSync(themePath)).toBe(true);
        const raw = JSON.parse(readFileSync(themePath, "utf-8"));
        const result = themeSchema.safeParse(raw);
        expect(result.success, `${template}/theme.json validation failed: ${JSON.stringify(result.success ? {} : result.error.issues)}`).toBe(true);
      });

      it("generates CSS with all required color vars", () => {
        const raw = JSON.parse(readFileSync(themePath, "utf-8"));
        const theme = themeSchema.parse(raw);
        const css = generateThemeCSS(theme);

        // All 7 standard colors should be present
        expect(css).toContain("--color-primary:");
        expect(css).toContain("--color-primary-light:");
        expect(css).toContain("--color-secondary:");
        expect(css).toContain("--color-accent:");
        expect(css).toContain("--color-background:");
        expect(css).toContain("--color-foreground:");
        expect(css).toContain("--color-muted:");
      });

      it("generates CSS that matches original globals.css color values", () => {
        const raw = JSON.parse(readFileSync(themePath, "utf-8"));
        const theme = themeSchema.parse(raw);
        const css = generateThemeCSS(theme);

        // Read original globals.css and check that color values match
        const globalsPath = join(ROOT, "apps", template, "app/globals.css");
        const globals = readFileSync(globalsPath, "utf-8");

        // Extract --color-primary value from globals.css
        const primaryMatch = globals.match(/--color-primary:\s*([^;]+);/);
        if (primaryMatch) {
          const originalValue = primaryMatch[1].trim();
          expect(css).toContain(`--color-primary: ${originalValue}`);
        }
      });

      it("generates valid Tailwind @theme inline block", () => {
        const raw = JSON.parse(readFileSync(themePath, "utf-8"));
        const theme = themeSchema.parse(raw);
        const css = generateThemeCSS(theme);

        expect(css).toContain("@theme inline");
        expect(css).toContain("--font-display: var(--font-display)");
        expect(css).toContain("--font-body: var(--font-body)");
      });
    });
  }
});
