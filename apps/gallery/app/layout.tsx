import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Velo Template Gallery",
  description: "Browse available templates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
