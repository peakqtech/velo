import Link from "next/link";
import { BRAND } from "@/lib/constants";

const FOOTER_LINKS = {
  Platform: [
    { label: "Templates", href: "/templates" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "QA & Testing", href: "/services/qa-testing" },
    { label: "Custom Dev", href: "/services/custom-development" },
    { label: "Managed", href: "/services/managed" },
  ],
  "Get In Touch": [
    { label: "hello@peakq.tech", href: "mailto:hello@peakq.tech" },
    { label: "Book a Call", href: "/get-started" },
  ],
} as const;

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#020a1a", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "rgba(59,130,246,0.12)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div
              className="text-lg font-bold tracking-[0.12em] mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PEAKQ
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              {BRAND.tagline}
            </p>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([category, links]) => (
              <div key={category}>
                <h3
                  className="text-[10px] uppercase tracking-[0.12em] mb-4"
                  style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)" }}
                >
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] transition-colors hover:text-blue-400"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-[10px]"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)" }}
          >
            © 2026 PeakQ. All rights reserved.
          </p>
          <p
            className="text-[10px]"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.15)" }}
          >
            {BRAND.subtleProof}
          </p>
        </div>
      </div>
    </footer>
  );
}
