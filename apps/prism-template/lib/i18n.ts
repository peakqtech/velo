import { createContentLoader } from "@velocity/i18n";
import type { PrismContent } from "@velocity/types";

export const defaultLocale = "en";
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export const getContent = createContentLoader<PrismContent>(
  { defaultLocale, locales },
  (locale) =>
    import(`../content/${locale}/prism`).then((m) => m.default)
);
