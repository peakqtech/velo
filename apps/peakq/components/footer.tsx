import Link from "next/link";

const FOOTER_LINKS = {
  Services: [
    { label: "Website", href: "/services/website" },
    { label: "Blog & Content", href: "/services/blog-content" },
    { label: "Ads & Campaigns", href: "/services/ads-campaigns" },
    { label: "Email", href: "/services/email" },
    { label: "Reviews", href: "/services/reviews" },
    { label: "Analytics", href: "/services/analytics" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
} as const;

export function Footer() {
  return (
    <footer
      style={{
        background: "rgba(5,5,7,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <div
              className="text-lg font-bold tracking-[0.12em] mb-3"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
            >
              PEAKQ
            </div>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
              Your website, ads, blog, and digital presence — handled.
            </p>
            <p
              className="text-[10px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", opacity: 0.6 }}
            >
              {/* Powered by Business AI OS */}
            </p>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([category, links]) => (
              <div key={category}>
                <h3
                  className="text-[10px] uppercase tracking-[0.12em] mb-4"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                >
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] transition-colors hover:text-blue-400"
                        style={{ color: "var(--muted)" }}
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
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="text-[10px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", opacity: 0.5 }}
          >
            © 2026 PeakQ. All rights reserved.
          </p>
          <p
            className="text-[10px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", opacity: 0.4 }}
          >
            {/* Powered by Business AI OS */}
          </p>
        </div>
      </div>
    </footer>
  );
}
