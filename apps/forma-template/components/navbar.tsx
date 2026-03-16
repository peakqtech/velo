"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderBottom: "1px solid #E5E5E5",
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <nav className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 h-16">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <span
              className="text-xl tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
            >
              FORMA
            </span>
          </Link>

          {/* Desktop nav — ultra minimal */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/projects"
              className="text-sm font-medium transition-opacity hover:opacity-50"
              style={{ color: pathname.startsWith("/projects") ? "#111111" : "#888888" }}
            >
              Projects
            </Link>
            <Link
              href="/studio"
              className="text-sm font-medium transition-opacity hover:opacity-50"
              style={{ color: pathname === "/studio" ? "#111111" : "#888888" }}
            >
              Studio
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#111111">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5M3.75 15h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-6 space-y-4" style={{ borderTop: "1px solid #E5E5E5" }}>
            <Link
              href="/projects"
              className="block text-sm font-medium"
              style={{ color: "#111111" }}
              onClick={() => setMobileOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/studio"
              className="block text-sm font-medium"
              style={{ color: "#111111" }}
              onClick={() => setMobileOpen(false)}
            >
              Studio
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
