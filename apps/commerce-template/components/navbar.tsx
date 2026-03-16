"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-tight">
            COMMERCE
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Products
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
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-text)] text-[10px] font-medium text-white">
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
                stroke="currentColor"
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
          <div className="sm:hidden border-t border-[var(--color-border)] py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              onClick={() => setMobileOpen(false)}
            >
              Products
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
