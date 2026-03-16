"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme-context";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { theme, variant } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine nav styling per theme variant
  const getNavStyles = () => {
    if (variant === "luxury") {
      return {
        backgroundColor: scrolled ? `${theme.colors.bg}ee` : "transparent",
        borderBottom: scrolled ? `1px solid ${theme.colors.border}` : "1px solid transparent",
        color: scrolled ? theme.colors.text : "#FFFFFF",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      };
    }
    if (variant === "streetwear") {
      return {
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.border}`,
        color: theme.colors.text,
        backdropFilter: "none",
      };
    }
    // minimal
    return {
      backgroundColor: scrolled ? `${theme.colors.bg}ee` : theme.colors.bg,
      borderBottom: `1px solid ${theme.colors.border}`,
      color: theme.colors.text,
      backdropFilter: scrolled ? "blur(12px)" : "none",
    };
  };

  const navStyles = getNavStyles();

  const logoContent = () => {
    if (variant === "luxury") {
      return (
        <span
          className="text-xl tracking-[0.15em] font-medium"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Atelier
        </span>
      );
    }
    if (variant === "streetwear") {
      return (
        <span
          className="text-xl font-bold tracking-wider uppercase"
          style={{ fontFamily: theme.fonts.heading }}
        >
          HYPE
        </span>
      );
    }
    return (
      <span
        className="text-lg font-medium"
        style={{ fontFamily: theme.fonts.heading }}
      >
        Muji
      </span>
    );
  };

  const linkStyle = {
    color: variant === "luxury" && !scrolled ? "rgba(255,255,255,0.8)" : theme.colors.textSecondary,
    fontSize: variant === "minimal" ? "13px" : "14px",
    textTransform: (variant === "streetwear" ? "uppercase" : "none") as React.CSSProperties["textTransform"],
    letterSpacing: variant === "streetwear" ? "0.08em" : "0",
    fontWeight: variant === "streetwear" ? 600 : 400,
  };

  const cartIconColor = variant === "luxury" && !scrolled ? "#FFFFFF" : theme.colors.text;
  const badgeBg = variant === "streetwear" ? theme.colors.primary : theme.colors.text;

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        ...navStyles,
        height: variant === "minimal" ? "56px" : "64px",
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" style={{ color: navStyles.color }}>
            {logoContent()}
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-8">
            <Link href="/" className="transition-opacity hover:opacity-70" style={linkStyle}>
              Home
            </Link>
            <Link href="/products" className="transition-opacity hover:opacity-70" style={linkStyle}>
              {variant === "streetwear" ? "Drops" : variant === "minimal" ? "Shop" : "Collection"}
            </Link>
          </div>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={cartIconColor}
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium text-white"
                  style={{ backgroundColor: badgeBg }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={cartIconColor}
                className="w-5 h-5"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="sm:hidden py-4 space-y-3"
            style={{ borderTop: `1px solid ${theme.colors.border}` }}
          >
            <Link
              href="/"
              className="block text-sm"
              style={{ color: theme.colors.textSecondary }}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block text-sm"
              style={{ color: theme.colors.textSecondary }}
              onClick={() => setMobileOpen(false)}
            >
              {variant === "streetwear" ? "Drops" : "Products"}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
