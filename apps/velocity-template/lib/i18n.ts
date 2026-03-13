import { createContentLoader } from "@velocity/i18n";
import type { VelocityContent } from "@velocity/types";

export const defaultLocale = "en";
export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export const getContent = createContentLoader<VelocityContent>(
  { defaultLocale, locales },
  (locale) =>
    import(`../content/${locale}/velocity`).then((m) => m.default)
);
