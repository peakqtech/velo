import type { Metadata } from "next";
import { Figtree, Noto_Sans } from "next/font/google";
import { locales, getContent } from "@/lib/i18n";
import "../globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-serenity-display",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-serenity-body",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getContent(locale);
  const { metadata } = content;
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: [metadata.ogImage],
      locale,
      type: "website",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      className={`${figtree.variable} ${notoSans.variable}`}
    >
      <body><script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration=\x27manual\x27;window.scrollTo(0,0);" }} />{children}</body>
    </html>
  );
}
