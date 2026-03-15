import type { Metadata } from "next";
import { Playfair_Display_SC, Karla } from "next/font/google";
import { locales, getContent } from "@/lib/i18n";
import "../globals.css";

const playfair = Playfair_Display_SC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-ember-display", display: "swap" });
const karla = Karla({ subsets: ["latin"], variable: "--font-ember-body", display: "swap" });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const content = await getContent(locale);
  const { metadata } = content;
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: { title: metadata.title, description: metadata.description, images: [metadata.ogImage], locale, type: "website" },
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <html lang={locale} className={`${playfair.variable} ${karla.variable}`}>
      <body><script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration=\x27manual\x27;window.scrollTo(0,0);" }} />{children}</body>
    </html>
  );
}
