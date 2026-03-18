import type { Metadata } from "next";
import { Inter, Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PeakQ — AI-Powered Business Operating System",
  description:
    "We don't just build websites. We build revenue machines. AI-powered platform purpose-built for your industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${bebasNeue.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[#020a1a] text-white antialiased">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
