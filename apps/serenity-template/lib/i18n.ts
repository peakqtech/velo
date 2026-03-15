import { createContentLoader } from "@velo/i18n";
import type { SerenityContent } from "@velo/types";

export const defaultLocale = "en";
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export const getContent = createContentLoader<SerenityContent>(
  { defaultLocale, locales },
  (locale) =>
    import(`../content/${locale}/serenity`).then((m) => m.default)
);
