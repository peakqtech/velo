import { describe, it, expect } from "vitest";
import { themeSchema } from "../src/schema";

describe("themeSchema", () => {
  const validTheme = {
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

  it("accepts a valid theme config", () => {
    const result = themeSchema.safeParse(validTheme);
    expect(result.success).toBe(true);
  });

  it("accepts theme with optional custom utilities", () => {
    const theme = {
      ...validTheme,
      utilities: {
        "glow-primary": {
          "box-shadow": "0 0 20px var(--color-primary)",
        },
        "text-gradient-primary": {
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
      },
    };
    const result = themeSchema.safeParse(theme);
    expect(result.success).toBe(true);
  });

  it("rejects missing colors", () => {
    const { colors, ...noColors } = validTheme;
    const result = themeSchema.safeParse(noColors);
    expect(result.success).toBe(false);
  });

  it("rejects missing required color (primary)", () => {
    const result = themeSchema.safeParse({
      ...validTheme,
      colors: { ...validTheme.colors, primary: undefined },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fonts", () => {
    const { fonts, ...noFonts } = validTheme;
    const result = themeSchema.safeParse(noFonts);
    expect(result.success).toBe(false);
  });

  it("rejects missing layout", () => {
    const { layout, ...noLayout } = validTheme;
    const result = themeSchema.safeParse(noLayout);
    expect(result.success).toBe(false);
  });

  it("rejects invalid hex color", () => {
    const result = themeSchema.safeParse({
      ...validTheme,
      colors: { ...validTheme.colors, primary: "not-a-color" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts 3-digit hex colors", () => {
    const result = themeSchema.safeParse({
      ...validTheme,
      colors: { ...validTheme.colors, primary: "#f00" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts rgb/hsl color values", () => {
    const result = themeSchema.safeParse({
      ...validTheme,
      colors: { ...validTheme.colors, primary: "rgb(255, 60, 0)" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts extra colors beyond required set", () => {
    const result = themeSchema.safeParse({
      ...validTheme,
      colors: { ...validTheme.colors, "primary-dark": "#cc3000" },
    });
    expect(result.success).toBe(true);
  });

  it("provides clear error messages", () => {
    const result = themeSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});
