// apps/peakq/components/sections/compounding-stack.tsx
"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { revealVariants, fadeUpVariants } from "@/lib/animation-variants";

const STEPS = [
  {
    num: "01",
    title: "Tell Us Your Business",
    body: "Answer 5 questions about your industry, audience, and goals. Takes under 3 minutes.",
  },
  {
    num: "02",
    title: "We Build Everything",
    body: "Your website, blog setup, ad campaigns, email sequences, and review system — configured and launched.",
  },
  {
    num: "03",
    title: "AI Runs It Daily",
    body: "Our Business AI OS monitors performance, publishes content, optimises ads, and sends follow-ups — automatically.",
  },
  {
    num: "ROI",
    title: "4.3× Average Return",
    body: "Clients see measurable results within 90 days. We track every dollar in, every lead out.",
    isMetric: true,
  },
];

interface CompoundingStackProps {
  id?: string;
}

export function CompoundingStack({ id }: CompoundingStackProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      ref={ref}
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,5,7,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="px-8 pt-14 pb-10" style={{ borderBottom: "1px solid var(--border)" }}>
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={fadeUpVariants}
          custom={0}
        >
          <span
            className="text-[9px] uppercase tracking-[.14em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
          >
            05 / How It Works
          </span>
        </motion.div>

        <h2
          style={{
            fontSize: "clamp(26px, 3.2vw, 40px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: 0.96,
          }}
        >
          {[
            { text: "UP AND RUNNING", outline: false },
            { text: "IN 48 HOURS.",   outline: true  },
          ].map((line, i) => (
            <div key={i} style={{ overflow: "hidden", display: "block", marginBottom: 3 }}>
              <motion.span
                style={{
                  display: "block",
                  ...(line.outline
                    ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" }
                    : { color: "var(--text)" }),
                }}
                initial={shouldReduceMotion ? "visible" : "hidden"}
                animate={inView ? "visible" : "hidden"}
                variants={revealVariants}
                custom={i}
              >
                {line.text}
              </motion.span>
            </div>
          ))}
        </h2>
      </div>

      {/* 2×2 grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            className="group relative px-8 py-10 flex flex-col gap-4 overflow-hidden"
            style={{
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate={inView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            custom={i + 2}
          >
            {/* Accent bar sweeps top on hover */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] origin-left"
              style={{ background: "var(--accent)" }}
              initial={{ scaleX: 0 }}
              whileHover={shouldReduceMotion ? {} : { scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Oversized step number */}
            <div
              className="text-[52px] font-black leading-none tracking-tight"
              style={
                step.isMetric
                  ? { color: "var(--accent)" }
                  : { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.2)" }
              }
            >
              {step.num}
            </div>

            <div>
              <div
                className="text-[11px] uppercase tracking-[.08em] font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                {step.title}
              </div>
              <p className="text-[12px] leading-[1.7]" style={{ color: "var(--muted)" }}>
                {step.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
