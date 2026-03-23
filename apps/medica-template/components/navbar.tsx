"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/doctors", label: "Our Doctors" },
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

  const navBg =
    isHomepage && !scrolled
      ? "rgba(255,255,255,0.85)"
      : "rgba(255,255,255,0.97)";

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: navBg,
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#0891B2" }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
            >
              Medica
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{
                  color: pathname === link.href ? "#0891B2" : "#64748B",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: "#0891B2",
                borderRadius: "12px",
              }}
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0F172A">
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
          <div className="md:hidden py-4 space-y-3 border-t" style={{ borderColor: "#E2E8F0" }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium py-1"
                style={{ color: pathname === link.href ? "#0891B2" : "#64748B" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block text-center px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#0891B2", borderRadius: "12px" }}
              onClick={() => setMobileOpen(false)}
            >
              Book Appointment
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
