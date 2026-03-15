"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = { en: "EN" };

export function LocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = locales.find((l) => pathname.startsWith(`/${l}`)) ?? "en";
  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };
  return (
    <div className="flex gap-1" role="navigation" aria-label="Language switcher">
      {locales.map((locale) => (
        <Link key={locale} href={switchLocale(locale)} aria-current={locale === currentLocale ? "page" : undefined}
          className={`px-2 py-1 text-xs font-bold transition-colors ${locale === currentLocale ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}>
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  );
}
