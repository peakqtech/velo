"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TESTIMONIALS = [
  {
    client: "APEX DENTAL",
    quote:
      "PeakQ's review engine generated 3× more Google reviews in the first 30 days than we had collected in the previous year.",
    name: "Sarah M.",
    title: "Practice Owner",
    initial: "SM",
  },
  {
    client: "NOVA REALTY",
    quote:
      "We recovered 14 leads in the first week through the automated follow-up sequences. Those were leads we had completely lost track of.",
    name: "James T.",
    title: "Brokerage Director",
    initial: "JT",
  },
  {
    client: "KLEO FITNESS",
    quote:
      "Our front desk was overwhelmed. Now AI handles bookings, reminders, and review requests. We went from 40 to 200 monthly leads without adding staff.",
    name: "Priya K.",
    title: "Studio Founder",
    initial: "PK",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto" style={{ borderTop: "1px solid rgba(59,130,246,0.12)" }}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-14">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}
          >
            Client Results
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 4vw, 52px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
            }}
          >
            CONSISTENCY &amp; RELIABILITY<br />
            DRIVE PARTNERSHIP.
          </h2>
        </div>
        {/* Decorative prev/next — no carousel logic in this phase */}
        <div className="hidden md:flex gap-2 mt-2">
          {["←", "→"].map((arrow, i) => (
            <button
              key={i}
              disabled
              aria-disabled="true"
              className="w-10 h-10 flex items-center justify-center text-sm transition-colors opacity-40 cursor-not-allowed"
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(59,130,246,0.2)",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-mono)",
              }}
              aria-label={i === 0 ? "Previous (coming soon)" : "Next (coming soon)"}
            >
              {arrow}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.client}
            className="flex flex-col gap-5 p-6"
            style={{
              backgroundColor: "rgba(5,13,31,0.8)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" as const }}
          >
            <motion.div
              className="text-[11px] uppercase tracking-[0.12em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)" }}
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {t.client}
            </motion.div>
            <p className="text-[14px] leading-relaxed italic flex-1" style={{ color: "rgba(255,255,255,0.7)" }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(96,165,250,0.2))",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "rgba(59,130,246,0.2)",
                  fontFamily: "var(--font-mono)",
                  color: "#60a5fa",
                }}
              >
                {t.initial}
              </div>
              <div>
                <div className="text-[12px] font-semibold">{t.name}</div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
