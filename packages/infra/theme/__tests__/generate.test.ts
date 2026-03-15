import { describe, it, expect } from "vitest";
import { generateThemeCSS } from "../src/generate";
import type { ThemeConfig } from "../src/schema";

const velocityTheme: ThemeConfig = {
  name: "velocity",
  displayName: "Velocity",
  colors: {
    primary: "#ff3c00",
    "primary-light": "#ff6b3d",
    secondary: "#0a0a0a",
    accent: "#f5f5f5",
    background: "#000000",
    foreground: "#ffffff",
    muted: "#888888",
  },
  fonts: {
    display: "Inter",
    body: "Inter",
  },
  layout: {
    maxWidth: "1440px",
    sectionPadding: "clamp(4rem, 10vw, 8rem)",
  },
};

describe("generateThemeCSS", () => {
  it("generates CSS custom properties in :root", () => {
    const css = generateThemeCSS(velocityTheme);
    expect(css).toContain(":root");
    expect(css).toContain("--color-primary: #ff3c00");
    expect(css).toContain("--color-primary-light: #ff6b3d");
    expect(css).toContain("--color-secondary: #0a0a0a");
    expect(css).toContain("--color-accent: #f5f5f5");
    expect(css).toContain("--color-background: #000000");
    expect(css).toContain("--color-foreground: #ffffff");
    expect(css).toContain("--color-muted: #888888");
  });

  it("generates font CSS variables", () => {
    const css = generateThemeCSS(velocityTheme);
    expect(css).toContain('--font-display: "Inter"');
    expect(css).toContain('--font-body: "Inter"');
  });

  it("generates layout CSS variables", () => {
    const css = generateThemeCSS(velocityTheme);
    expect(css).toContain("--max-w-content: 1440px");
    expect(css).toContain("--padding-section: clamp(4rem, 10vw, 8rem)");
  });

  it("generates Tailwind v4 @theme inline block", () => {
    const css = generateThemeCSS(velocityTheme);
    expect(css).toContain("@theme inline");
    // Tailwind theme should map CSS vars to Tailwind tokens
    expect(css).toContain("--color-primary: var(--color-primary)");
    expect(css).toContain("--color-foreground: var(--color-foreground)");
    expect(css).toContain("--font-display: var(--font-display)");
    expect(css).toContain("--font-body: var(--font-body)");
    expect(css).toContain("--max-width-content: var(--max-w-content)");
  });

  it("generates @source directives when sections provided", () => {
    const css = generateThemeCSS(velocityTheme, {
      sections: ["@velo/hero", "@velo/footer"],
    });
    expect(css).toContain('@source "../../sections/hero/src"');
    expect(css).toContain('@source "../../sections/footer/src"');
  });

  it("generates custom utility classes when specified", () => {
    const theme: ThemeConfig = {
      ...velocityTheme,
      utilities: {
        "glow-primary": {
          "box-shadow": "0 0 20px var(--color-primary)",
        },
      },
    };
    const css = generateThemeCSS(theme);
    expect(css).toContain(".glow-primary");
    expect(css).toContain("box-shadow: 0 0 20px var(--color-primary)");
  });

  it("produces valid CSS structure (imports, root, theme, utilities)", () => {
    const css = generateThemeCSS(velocityTheme);
    const lines = css.split("\n");
    // @import should come first
    const importIdx = lines.findIndex((l) => l.includes('@import "tailwindcss"'));
    const rootIdx = lines.findIndex((l) => l.includes(":root"));
    const themeIdx = lines.findIndex((l) => l.includes("@theme inline"));
    expect(importIdx).toBeLessThan(rootIdx);
    expect(rootIdx).toBeLessThan(themeIdx);
  });

  it("handles extra colors beyond the required set", () => {
    const theme: ThemeConfig = {
      ...velocityTheme,
      colors: { ...velocityTheme.colors, "primary-dark": "#cc3000" },
    };
    const css = generateThemeCSS(theme);
    expect(css).toContain("--color-primary-dark: #cc3000");
  });
});
