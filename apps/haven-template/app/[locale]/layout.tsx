import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";
import { locales, getContent } from "@/lib/i18n";
import "../globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-haven-display",
  display: "swap",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-haven-body",
  display: "swap",
});

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
    <html lang={locale} className={`${cinzel.variable} ${josefinSans.variable}`}>
      <body><script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration=\x27manual\x27;window.scrollTo(0,0);" }} />{children}</body>
    </html>
  );
}
