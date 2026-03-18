import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  href: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular,
  href,
}: PricingCardProps) {
  return (
    <div className="relative flex flex-col">
      {popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{ backgroundColor: "#a78bfa", color: "#030712" }}
        >
          Popular
        </div>
      )}
      <div
        className="flex flex-col flex-1 rounded-2xl p-8 transition-all duration-200"
        style={{
          border: popular ? "2px solid #a78bfa" : "1px solid #1f2937",
          background: popular ? "rgba(167,139,250,0.04)" : "#0d1117",
        }}
      >
        {/* Tier name */}
        <div className="mb-2">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: popular ? "#a78bfa" : "#6b7280" }}
          >
            {name}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-5xl font-bold text-white">{price}</span>
          {period && (
            <span className="text-base" style={{ color: "#9ca3af" }}>
              {period}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
          {description}
        </p>

        {/* Divider */}
        <div
          className="mb-6"
          style={{ borderTop: "1px solid #1f2937" }}
        />

        {/* Features */}
        <ul className="flex flex-col gap-3 mb-8 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <span
                className="mt-0.5 flex-shrink-0 text-base leading-none"
                style={{ color: "#4ade80" }}
              >
                ✓
              </span>
              <span style={{ color: "#d1d5db" }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={href}
          className="block w-full text-center py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: "#4ade80",
            color: "#030712",
          }}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
