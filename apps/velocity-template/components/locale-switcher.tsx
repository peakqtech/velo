"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/content/content.config";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  id: "ID",
};

export function LocaleSwitcher() {
  const pathname = usePathname();

  // Extract current locale from path
  const currentLocale = locales.find((l) =>
    pathname.startsWith(`/${l}`)
  ) ?? "en";

  // Build path for other locale
  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  return (
    <div className="flex gap-1" role="navigation" aria-label="Language switcher">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocale(locale)}
          aria-current={locale === currentLocale ? "page" : undefined}
          className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
            locale === currentLocale
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  );
}
