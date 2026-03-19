// apps/peakq/components/sections/final-cta.tsx
"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { revealVariants, fadeUpVariants } from "@/lib/animation-variants";

const DELIVERABLE_PILLS = ["Websites", "Blogs", "Ads", "Email", "Reviews", "Analytics"];

const HEADLINE_LINES = [
  { text: "YOUR WEBSITE.", outline: false, accent: false },
  { text: "YOUR ADS.",     outline: true,  accent: false },
  { text: "YOUR REVIEWS.", outline: false, accent: false },
  { text: "ALL HANDLED.",  outline: false, accent: true  },
];

interface FinalCtaProps {
  id?: string;
}

export function FinalCta({ id }: FinalCtaProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      ref={ref}
      className="relative overflow-hidden"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,5,7,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Radial blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
      <div className="px-8 py-20 max-w-[860px]">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-2 mb-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={fadeUpVariants}
          custom={0}
        >
          <span
            className="text-[9px] uppercase tracking-[.14em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
          >
            10 / Get Started
          </span>
        </motion.div>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(40px, 5.5vw, 68px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: 0.94,
            marginBottom: "2rem",
          }}
        >
          {HEADLINE_LINES.map((line, i) => (
            <div key={i} style={{ overflow: "hidden", display: "block", marginBottom: 4 }}>
              <motion.span
                style={{
                  display: "block",
                  ...(line.outline
                    ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" }
                    : line.accent
                    ? { color: "var(--accent)" }
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

        {/* Subtext */}
        <motion.p
          className="text-[13px] leading-[1.7] mb-8 max-w-[480px]"
          style={{ color: "var(--muted)" }}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={fadeUpVariants}
          custom={5}
        >
          One system. Every channel. No agency markup, no freelancer coordination, no monthly "strategy calls."
          Just results.
        </motion.p>

        {/* Deliverable pills */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={fadeUpVariants}
          custom={6}
        >
          {DELIVERABLE_PILLS.map((pill) => (
            <span
              key={pill}
              className="text-[9px] uppercase tracking-[.1em] px-3 py-1.5"
              style={{
                border: "1px solid var(--border-mid)",
                color: "var(--muted)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {pill}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={fadeUpVariants}
          custom={7}
        >
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[.08em] font-semibold transition-all hover:brightness-110"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Get Started — It&apos;s Free →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[.08em] transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            Talk to Us First
          </Link>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
