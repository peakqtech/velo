"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    number: "01",
    title: "Pick Your Template",
    description:
      "Choose from 50+ industry-specific templates built for conversion. Dental, legal, fitness, hospitality — every vertical has a proven foundation.",
  },
  {
    number: "02",
    title: "Deploy Your AI Team",
    description:
      "Activate AI agents for lead capture, review generation, follow-up sequences, and reporting. They work 24/7. No onboarding. No sick days.",
  },
  {
    number: "03",
    title: "Watch It Compound",
    description:
      "Each AI action feeds the next. More reviews → higher search ranking → more leads → more reviews. The flywheel starts on day one.",
  },
];

export function CompoundingStack() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <p
        className="text-[11px] uppercase tracking-[0.15em] mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}
      >
        How It Works
      </p>
      <h2
        className="mb-14"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 4vw, 52px)",
          letterSpacing: "-0.01em",
          lineHeight: 1.05,
        }}
      >
        EACH LAYER COMPOUNDS<br />
        THE ONE BELOW IT.
      </h2>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Connector lines (desktop only) */}
        <svg
          className="hidden md:block absolute top-8 left-0 w-full pointer-events-none"
          width="100%"
          style={{ height: "2px", zIndex: 0 }}
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M33,1 L67,1"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </svg>

        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            className="flex flex-col gap-4 p-6 relative z-10"
            style={{
              backgroundColor: "rgba(5,13,31,0.8)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.3, ease: "easeOut" as const }}
          >
            <div
              className="text-[11px] tracking-[0.1em]"
              style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}
            >
              {step.number}
            </div>
            <div
              className="text-xl uppercase"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              {step.title}
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
