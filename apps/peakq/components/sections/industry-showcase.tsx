"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { templates } from "@/lib/templates.config";

// Deduplicate by industry, keeping the first template per industry
const uniqueIndustries = (() => {
  const seen = new Set<string>();
  return templates.filter((t) => {
    if (seen.has(t.industry)) return false;
    seen.add(t.industry);
    return true;
  });
})();

const displayedIndustries = uniqueIndustries.slice(0, 7);

export function IndustryShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Purpose-Built for Your Industry
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Each industry gets intelligence trained on its specific patterns,
          workflows, and growth levers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedIndustries.map((template, i) => (
          <motion.div
            key={template.industry}
            className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 hover:border-gray-700 transition-colors"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <span className="text-3xl mb-3 block">{template.icon}</span>
            <h3 className="text-white font-semibold mb-2">
              {template.industry}
            </h3>
            <p className="text-gray-500 text-sm">
              {template.capabilities.slice(0, 3).join(", ")}
            </p>
          </motion.div>
        ))}

        {/* More Industries card */}
        <motion.div
          className="rounded-xl border-2 border-dashed border-purple-400/40 bg-gray-900/30 p-6 flex flex-col items-center justify-center text-center hover:border-purple-400/60 transition-colors"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 7 * 0.07 }}
        >
          <span className="text-3xl mb-3 block text-purple-400">+</span>
          <h3 className="text-purple-400 font-semibold mb-2">
            More Industries
          </h3>
          <p className="text-gray-500 text-sm">
            Growing library &bull; Request yours
          </p>
        </motion.div>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/templates"
          className="text-green-400 hover:text-green-300 font-medium transition-colors"
        >
          Explore all industry solutions &rarr;
        </Link>
      </div>
    </section>
  );
}
