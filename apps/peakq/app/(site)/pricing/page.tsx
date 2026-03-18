import Link from "next/link";
import { PricingCard } from "@/components/pricing-card";

export const metadata = {
  title: "Pricing — PeakQ",
  description:
    "Start where you are. Scale when you're ready. Every tier compounds the one below it.",
};

const tiers = [
  {
    name: "Starter",
    price: "$99",
    period: "/mo",
    description:
      "Your industry-optimized online presence — launch-ready in days",
    features: [
      "Website + Hosting",
      "Content Management System",
      "Industry Template",
      "Basic SEO Setup",
      "Contact Form",
    ],
    cta: "Get Started",
    popular: false,
    href: "/get-started",
  },
  {
    name: "Growth",
    price: "$499",
    period: "/mo",
    description: "AI that captures leads and builds your reputation on autopilot",
    features: [
      "Everything in Starter",
      "AI SEO Engine",
      "Lead Capture System",
      "Reputation Management",
      "Review Automation",
    ],
    cta: "Get Started",
    popular: false,
    href: "/get-started",
  },
  {
    name: "Scale",
    price: "$999",
    period: "/mo",
    description:
      "Full-funnel: automated ad spend → lead tracking → ROI dashboard",
    features: [
      "Everything in Growth",
      "Ads Autopilot",
      "Business Intelligence Dashboard",
      "Full Funnel Analytics",
      "Revenue Attribution",
    ],
    cta: "Get Started",
    popular: true,
    href: "/get-started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored workflows, dedicated success manager, API access",
    features: [
      "Everything in Scale",
      "Custom Integrations",
      "Priority Support",
      "Dedicated Account Manager",
      "API Access",
    ],
    cta: "Contact Sales",
    popular: false,
    href: "/contact",
  },
];

const faqs = [
  {
    q: "Can I switch tiers?",
    a: "Yes, upgrade or downgrade anytime. Changes take effect on your next billing cycle.",
  },
  {
    q: "Is there a contract?",
    a: "No long-term contracts. Everything runs month-to-month — cancel whenever you like.",
  },
  {
    q: "What's included in all tiers?",
    a: "Hosting, SSL, CDN, and 24/7 uptime monitoring are included across every plan.",
  },
  {
    q: "Do you offer custom pricing?",
    a: "Yes. Contact us for enterprise solutions tailored to your industry and team size.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Pricing
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Start Where You Are.
            <br />
            Scale When You&rsquo;re Ready.
          </h1>
          <p className="text-lg" style={{ color: "#9ca3af" }}>
            Every tier compounds the one below it — your growth stack, fully
            managed.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {tiers.map((tier) => (
              <PricingCard key={tier.name} {...tier} />
            ))}
          </div>

          {/* Note */}
          <p
            className="text-center text-sm mt-8"
            style={{ color: "#6b7280" }}
          >
            * Price depends on industry and scope. Book a call for an exact
            quote.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-6">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl p-6"
                style={{ background: "#0d1117", border: "1px solid #1f2937" }}
              >
                <p className="font-semibold text-white mb-2">{q}</p>
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-28 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="mb-8" style={{ color: "#9ca3af" }}>
            Join businesses that grow smarter with PeakQ.
          </p>
          <Link
            href="/get-started"
            className="inline-block px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#4ade80", color: "#030712" }}
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  );
}
