"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/attorneys", label: "Attorneys" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomepage && !scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: isTransparent ? "transparent" : "#1E293B",
        borderBottom: isTransparent ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span
              className="text-2xl font-bold tracking-wider"
              style={{ fontFamily: "var(--font-heading)", color: "#B8860B" }}
            >
              LEXIS
            </span>
            <div className="hidden sm:block w-px h-6" style={{ backgroundColor: "rgba(184,134,11,0.3)" }} />
            <span className="hidden sm:block text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
              Attorneys at Law
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  color: pathname === link.href ? "#B8860B" : "rgba(255,255,255,0.7)",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.02em",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
              style={{
                color: "#B8860B",
                border: "1px solid #B8860B",
                borderRadius: "4px",
              }}
            >
              Free Consultation
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(255,255,255,0.8)">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden py-4 space-y-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#1E293B" }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium py-1"
                style={{ color: pathname === link.href ? "#B8860B" : "rgba(255,255,255,0.7)" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block text-center text-sm font-medium py-2.5 mt-2"
              style={{ color: "#B8860B", border: "1px solid #B8860B", borderRadius: "4px" }}
              onClick={() => setMobileOpen(false)}
            >
              Free Consultation
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
