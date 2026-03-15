import { createContentLoader } from "@velocity/i18n";
import type { HavenContent } from "@velocity/types";

export const defaultLocale = "en";
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export const getContent = createContentLoader<HavenContent>(
  { defaultLocale, locales },
  (locale) => import(`../content/${locale}/haven`).then((m) => m.default)
);
