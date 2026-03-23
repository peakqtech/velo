"use client";

import { useTheme } from "@/lib/theme-context";

export function Footer() {
  const { theme, variant } = useTheme();

  if (variant === "luxury") return <LuxuryFooter theme={theme} />;
  if (variant === "streetwear") return <StreetwearFooter theme={theme} />;
  return <MinimalFooter theme={theme} />;
}

function LuxuryFooter({ theme }: { theme: import("@/lib/themes").ThemeConfig }) {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.bg,
        borderTop: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <h3
              className="text-2xl font-medium tracking-[0.1em]"
              style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            >
              Atelier
            </h3>
            <p
              className="mt-4 text-sm leading-relaxed max-w-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Crafting refined essentials for the modern wardrobe. Each piece tells
              a story of quality and timeless design.
            </p>
            {/* Gold accent line */}
            <div
              className="mt-6 w-12 h-0.5"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4"
              style={{ color: theme.colors.text }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {["All Products", "Tops", "Bottoms", "Outerwear", "Accessories"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "All Products" ? "/products" : `/products?category=${item}`}
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4"
              style={{ color: theme.colors.text }}
            >
              Connect
            </h4>
            <ul className="space-y-3">
              {["Instagram", "Twitter", "Email Us"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-16 pt-6 text-center text-xs"
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            color: theme.colors.textSecondary,
          }}
        >
          &copy; {new Date().getFullYear()} Atelier. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function StreetwearFooter({ theme }: { theme: import("@/lib/themes").ThemeConfig }) {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.surface,
        borderTop: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <h3
              className="text-3xl font-bold uppercase tracking-wider"
              style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            >
              HYPE
            </h3>
            <p
              className="mt-4 text-sm leading-relaxed max-w-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Limited drops. No compromises. Defining street culture one piece at a time.
            </p>
            {/* Neon accent dot */}
            <div className="mt-4 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="text-xs uppercase tracking-wider" style={{ color: theme.colors.accent }}>
                Shipping worldwide
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-xs font-bold tracking-[0.15em] uppercase mb-4"
              style={{ color: theme.colors.text }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {["All Drops", "Tops", "Bottoms", "Outerwear", "Accessories"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "All Drops" ? "/products" : `/products?category=${item}`}
                    className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className="text-xs font-bold tracking-[0.15em] uppercase mb-4"
              style={{ color: theme.colors.text }}
            >
              Follow
            </h4>
            <ul className="space-y-3">
              {["Instagram", "TikTok", "Twitter", "Discord"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm uppercase tracking-wide transition-colors"
                    style={{ color: theme.colors.textSecondary }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textSecondary)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-wider"
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            color: theme.colors.textSecondary,
          }}
        >
          <span>&copy; {new Date().getFullYear()} HYPE. All rights reserved.</span>
          <span style={{ color: theme.colors.accent }}>Built different.</span>
        </div>
      </div>
    </footer>
  );
}

function MinimalFooter({ theme }: { theme: import("@/lib/themes").ThemeConfig }) {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.bg,
        borderTop: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-12">
          {/* Brand */}
          <div>
            <h3
              className="text-lg font-medium"
              style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            >
              Muji
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed max-w-xs"
              style={{ color: theme.colors.textSecondary }}
            >
              Essential pieces designed with purpose.
            </p>
          </div>

          {/* Minimal links */}
          <div className="flex gap-12">
            <div>
              <ul className="space-y-2">
                {["Shop", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={item === "Shop" ? "/products" : "#"}
                      className="text-sm hover:opacity-70 transition-opacity"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                {["Instagram", "Twitter"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          className="mt-16 pt-6 text-xs"
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            color: theme.colors.textSecondary,
          }}
        >
          &copy; {new Date().getFullYear()} Muji
        </div>
      </div>
    </footer>
  );
}
