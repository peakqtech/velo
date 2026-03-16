import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tropica — Luxury Villas in Bali",
  description:
    "Discover handpicked luxury villas in Bali's most exclusive locations. Private pools, ocean views, and 24/7 concierge service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
