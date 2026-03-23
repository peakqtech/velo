"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ isHomepage = false }: { isHomepage?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHomepage) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomepage]);

  const solid = !isHomepage || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-[var(--color-sand)]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          href="/"
          className={`font-[var(--font-heading)] text-2xl md:text-3xl italic font-semibold tracking-wide transition-colors duration-300 ${
            solid ? "text-[var(--color-primary)]" : "text-white"
          }`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tropica
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Properties", href: "/properties" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-[var(--color-gold)] ${
                solid ? "text-[var(--color-text)]" : "text-white/90"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/properties"
            className="ml-2 px-6 py-2.5 rounded-[var(--radius)] text-sm font-medium tracking-wider uppercase transition-all duration-300 gold-gradient text-white hover:shadow-lg hover:shadow-[var(--color-gold)]/20"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors ${
            solid ? "text-[var(--color-text)]" : "text-white"
          }`}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            } ${solid ? "bg-[var(--color-text)]" : "bg-white"}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            } ${solid ? "bg-[var(--color-text)]" : "bg-white"}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            } ${solid ? "bg-[var(--color-text)]" : "bg-white"}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-sand)]/98 backdrop-blur-lg border-t border-[var(--color-sand-light)] px-6 py-6 space-y-4">
          {[
            { label: "Properties", href: "/properties" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-[var(--color-text)] text-base font-medium tracking-wider uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/properties"
            onClick={() => setMobileOpen(false)}
            className="block text-center px-6 py-3 rounded-[var(--radius)] gold-gradient text-white font-medium tracking-wider uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
