import Link from "next/link";
import { BRAND } from "@/lib/constants";

const FOOTER_LINKS = {
  Product: [
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
    { label: "Custom Development", href: "/services/custom-development" },
    { label: "Managed Services", href: "/services/managed" },
  ],
} as const;

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-white tracking-tight mb-2">
              {BRAND.name}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {BRAND.tagline}
            </p>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([category, links]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
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
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 PeakQ. All rights reserved.
          </p>
          <p className="text-xs text-gray-700 italic">
            {BRAND.subtleProof}
          </p>
        </div>
      </div>
    </footer>
  );
}
