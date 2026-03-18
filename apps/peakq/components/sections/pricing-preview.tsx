"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$99/mo",
    features: "Website, Hosting, CMS",
    borderClass: "border-gray-700",
    popular: false,
  },
  {
    name: "Growth",
    price: "$499/mo",
    features: "+ SEO, Lead Capture, Reputation",
    borderClass: "border-blue-400",
    popular: false,
  },
  {
    name: "Scale",
    price: "$999/mo",
    features: "+ Ads Autopilot, BI Dashboard, Full Funnel",
    borderClass: "border-purple-400",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: "+ Custom Workflows, Priority Support, API Access",
    borderClass: "border-amber-400",
    popular: false,
  },
];

export function PricingPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Start Where You Are. Scale When You&rsquo;re Ready.
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Every tier compounds the one below it. No wasted spend.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            className={`relative rounded-xl border ${tier.borderClass} bg-gray-900/50 p-6 text-center`}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Popular
              </span>
            )}
            <h3 className="text-white font-semibold text-lg mb-2">
              {tier.name}
            </h3>
            <p className="text-3xl font-bold text-white mb-4">{tier.price}</p>
            <p className="text-gray-400 text-sm">{tier.features}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/pricing"
          className="text-green-400 hover:text-green-300 font-medium transition-colors"
        >
          See full pricing &rarr;
        </Link>
      </div>
    </section>
  );
}
