import { z } from "zod";

const cssColor = z.string().refine(
  (v) => /^(#[0-9a-fA-F]{3,8}|rgb|hsl|oklch|color\()/.test(v),
  { message: "Must be a valid CSS color value (hex, rgb, hsl, oklch)" }
);

const requiredColors = z.object({
  primary: cssColor,
  "primary-light": cssColor,
  secondary: cssColor,
  accent: cssColor,
  background: cssColor,
  foreground: cssColor,
  muted: cssColor,
});

const colorsSchema = requiredColors.catchall(cssColor);

const fontsSchema = z.object({
  display: z.string(),
  body: z.string(),
});

const layoutSchema = z.object({
  maxWidth: z.string(),
  sectionPadding: z.string(),
});

const utilitiesSchema = z.record(
  z.string(),
  z.record(z.string(), z.string())
).optional();

export const themeSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  colors: colorsSchema,
  fonts: fontsSchema,
  layout: layoutSchema,
  utilities: utilitiesSchema,
});

export type ThemeConfig = z.infer<typeof themeSchema>;
