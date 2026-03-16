import { describe, it, expect } from "vitest";
import { validateThemeCompleteness } from "../src/validate";
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

describe("validateThemeCompleteness", () => {
  it("passes when all required vars are provided", () => {
    // Simulate section source files using standard Tailwind utilities
    const sectionSources = [
      'className="bg-primary text-foreground"',
      'className="text-muted bg-background"',
    ];

    const result = validateThemeCompleteness(velocityTheme, sectionSources);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("reports missing color when section uses undefined theme color", () => {
    const theme: ThemeConfig = {
      ...velocityTheme,
      colors: {
        primary: "#ff3c00",
        "primary-light": "#ff6b3d",
        secondary: "#0a0a0a",
        accent: "#f5f5f5",
        background: "#000000",
        foreground: "#ffffff",
        muted: "#888888",
      },
    };

    // Section uses "danger" color which isn't in the theme
    const sectionSources = [
      'className="bg-danger text-foreground"',
    ];

    const result = validateThemeCompleteness(theme, sectionSources);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("danger");
  });

  it("handles opacity modifiers (text-primary/10)", () => {
    const sectionSources = [
      'className="text-primary/10 bg-foreground/5"',
    ];

    const result = validateThemeCompleteness(velocityTheme, sectionSources);
    expect(result.valid).toBe(true);
  });

  it("handles hover/focus state variants", () => {
    const sectionSources = [
      'className="hover:bg-primary-light focus:border-accent"',
    ];

    const result = validateThemeCompleteness(velocityTheme, sectionSources);
    expect(result.valid).toBe(true);
  });

  it("ignores non-theme Tailwind utilities", () => {
    // These are built-in Tailwind utilities, not theme colors
    const sectionSources = [
      'className="bg-white text-black border-gray-200 p-4 flex"',
    ];

    const result = validateThemeCompleteness(velocityTheme, sectionSources);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("validates font usage", () => {
    const sectionSources = [
      'className="font-display font-body"',
    ];

    const result = validateThemeCompleteness(velocityTheme, sectionSources);
    expect(result.valid).toBe(true);
  });

  it("returns empty missing when no theme utilities used", () => {
    const sectionSources = [
      'className="flex items-center p-4 rounded-lg"',
    ];

    const result = validateThemeCompleteness(velocityTheme, sectionSources);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });
});
