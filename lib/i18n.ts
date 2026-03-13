import { type Locale, defaultLocale, isValidLocale } from "@/content/content.config";
import type { VelocityContent } from "@/lib/types";

export async function getContent(locale: string): Promise<VelocityContent> {
  const validLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;

  try {
    const content = await import(`@/content/${validLocale}/velocity`);
    return content.default as VelocityContent;
  } catch {
    const content = await import(`@/content/${defaultLocale}/velocity`);
    return content.default as VelocityContent;
  }
}

export { defaultLocale, locales, isValidLocale };
export type { Locale };
