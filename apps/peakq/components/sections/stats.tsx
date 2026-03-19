// apps/peakq/components/sections/stats.tsx
"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { fadeUpVariants, expandLineVariants } from "@/lib/animation-variants";

const STATS = [
  { value: "200+", unit: "Active Clients",    sub: "Across 14 industries" },
  { value: "40+",  unit: "Templates Ready",   sub: "Deploy in 48 hours" },
  { value: "4.3×", unit: "Average ROI",        sub: "Measured over 90 days" },
  { value: "48h",  unit: "Time to Launch",     sub: "From signup to live site" },
];

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,5,7,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Section label */}
      <div
        className="flex items-center gap-3 px-8 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <motion.div
          className="h-px flex-1 origin-left"
          style={{ background: "var(--border-mid)" }}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={expandLineVariants}
        />
        <span
          className="text-[9px] uppercase tracking-[.14em]"
          style={{ color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}
        >
          By the numbers
        </span>
        <motion.div
          className="h-px flex-1 origin-right"
          style={{ background: "var(--border-mid)", transformOrigin: "right" }}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={expandLineVariants}
        />
      </div>

      {/* 4-column grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.unit}
            className="group relative px-8 py-10 flex flex-col gap-1"
            style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate={inView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            custom={i}
          >
            {/* Accent underline — expands on hover */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] origin-left"
              style={{ background: "var(--accent)", width: "100%" }}
              initial={{ scaleX: 0 }}
              whileHover={shouldReduceMotion ? {} : { scaleX: 1 }}
              transition={{ duration: 0.25 }}
            />

            <div
              className="text-[42px] font-black leading-none tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {stat.value}
            </div>
            <div
              className="text-[10px] uppercase tracking-[.1em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
            >
              {stat.unit}
            </div>
            <div
              className="text-[11px] leading-[1.5] mt-1"
              style={{ color: "var(--muted)" }}
            >
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
