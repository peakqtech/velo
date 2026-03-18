"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BRAND } from "@/lib/constants";

const layers = [
  {
    tier: "Starter",
    color: "green",
    borderClass: "border-green-400",
    bgClass: "bg-green-400/5",
    badgeClass: "bg-green-400/20 text-green-400",
    items: "Website + Hosting + CMS",
    icon: "\ud83c\udf10",
    description:
      "Your industry-optimized online presence \u2014 launch-ready in days",
  },
  {
    tier: "Growth",
    color: "blue",
    borderClass: "border-blue-400",
    bgClass: "bg-blue-400/5",
    badgeClass: "bg-blue-400/20 text-blue-400",
    items: "SEO + \ud83c\udfaf Lead Capture + \u2b50 Reputation",
    icon: "\ud83d\udd0d",
    description:
      "AI that knows your industry\u2019s search patterns, captures leads, and builds your reputation on autopilot",
  },
  {
    tier: "Scale",
    color: "purple",
    borderClass: "border-purple-400",
    bgClass: "bg-purple-400/5",
    badgeClass: "bg-purple-400/20 text-purple-400",
    items: "Ads Autopilot + \ud83d\udcca Business Intelligence",
    icon: "\ud83d\udce2",
    description:
      "Full-funnel: automated ad spend \u2192 lead tracking \u2192 ROI dashboard \u2014 see exactly what\u2019s working",
  },
  {
    tier: "Enterprise",
    color: "amber",
    borderClass: "border-amber-400",
    bgClass: "bg-amber-400/5",
    badgeClass: "bg-amber-400/20 text-amber-400",
    items: "Custom Integrations + \ud83c\udfaf Priority Support",
    icon: "\ud83d\udd27",
    description:
      "Tailored workflows, dedicated success manager, API access \u2014 your business, your rules",
  },
];

export function CompoundingStack() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="px-6 py-24 max-w-4xl mx-auto" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 whitespace-pre-line">
          {BRAND.stackHeadline}
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {BRAND.stackSubtext}
        </p>
      </div>

      <div className="flex flex-col gap-0">
        {layers.map((layer, i) => (
          <div key={layer.tier}>
            <motion.div
              className={`rounded-xl border-l-4 ${layer.borderClass} ${layer.bgClass} p-6 flex flex-col sm:flex-row sm:items-center gap-4`}
              initial={{ opacity: 0, x: -32 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="flex-1">
                <p className="text-white font-semibold text-lg mb-1">
                  <span className="mr-2">{layer.icon}</span>
                  {layer.items}
                </p>
                <p className="text-gray-400 text-sm">{layer.description}</p>
              </div>
              <span
                className={`${layer.badgeClass} text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-center`}
              >
                {layer.tier}
              </span>
            </motion.div>

            {/* Arrow between layers */}
            {i < layers.length - 1 && (
              <div className="flex items-center justify-center py-2 text-gray-600 text-sm">
                <span className="mr-2">\u25bc</span> compounds into
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
