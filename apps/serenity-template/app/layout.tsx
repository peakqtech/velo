// Root layout — required by Next.js App Router.
// Locale-specific html lang attribute is set in app/[locale]/layout.tsx.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
