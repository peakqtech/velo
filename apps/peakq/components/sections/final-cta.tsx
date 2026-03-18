"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="py-24 px-4 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #020a1a, #050f2e, #020a1a)",
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 600px 300px at 50% 50%, rgba(59,130,246,0.08), transparent)",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto">
        {/* H2 */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 6vw, 80px)",
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          STOP HIRING.<br />
          START DEPLOYING.
        </motion.h2>

        {/* Body with accent animations */}
        <motion.p
          className="mt-8 text-base leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          AI-powered tools that{" "}
          <span className="relative inline-block">
            <span className="relative z-10" style={{ color: "rgba(255,255,255,0.85)" }}>
              cost less than one employee
            </span>
            <motion.span
              className="absolute bottom-0 left-0 h-px bg-blue-400"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" as const }}
            />
          </span>{" "}
          and{" "}
          <motion.span
            animate={isInView ? { textShadow: "0 0 12px rgba(59,130,246,0.5)" } : {}}
            transition={{ delay: 1.2, duration: 0.4 }}
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            outperform an entire team
          </motion.span>
          .
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" as const }}
        >
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Deploy Now — It&apos;s Free →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-colors hover:bg-blue-500/10"
            style={{
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(59,130,246,0.3)",
              color: "#60a5fa",
            }}
          >
            Talk to Us First
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
