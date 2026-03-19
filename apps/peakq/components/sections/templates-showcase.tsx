// apps/peakq/components/sections/templates-showcase.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { revealVariants, fadeUpVariants } from "@/lib/animation-variants";

interface Template {
  id: string;
  name: string;
  industry: "Hospitality" | "Healthcare" | "Real Estate" | "Fitness" | "Restaurant" | "Other";
  accentColor: string;
}

const TEMPLATES: Template[] = [
  { id: "hotel-pro",      name: "Hotel Pro",       industry: "Hospitality",  accentColor: "#3b82f6" },
  { id: "villa-luxe",     name: "Villa Luxe",      industry: "Hospitality",  accentColor: "#6366f1" },
  { id: "clinic-suite",   name: "Clinic Suite",    industry: "Healthcare",   accentColor: "#8b5cf6" },
  { id: "medcare",        name: "MedCare Pro",     industry: "Healthcare",   accentColor: "#7c3aed" },
  { id: "realtor-os",     name: "Realtor OS",      industry: "Real Estate",  accentColor: "#10b981" },
  { id: "property-hub",   name: "Property Hub",    industry: "Real Estate",  accentColor: "#059669" },
  { id: "fitness-co",     name: "Fitness Co",      industry: "Fitness",      accentColor: "#f59e0b" },
  { id: "gym-elite",      name: "Gym Elite",       industry: "Fitness",      accentColor: "#d97706" },
  { id: "restaurant",     name: "The Table",       industry: "Restaurant",   accentColor: "#ef4444" },
  { id: "cafe-noir",      name: "Café Noir",       industry: "Restaurant",   accentColor: "#dc2626" },
  { id: "salon-pro",      name: "Salon Pro",       industry: "Other",        accentColor: "#ec4899" },
  { id: "agency-dark",    name: "Agency Dark",     industry: "Other",        accentColor: "#3b82f6" },
];

const INDUSTRIES = ["All", "Hospitality", "Healthcare", "Real Estate", "Fitness", "Restaurant"] as const;

function TemplateMockup({ template }: { template: Template }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        height: 180,
        background: "#0a0a0d",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Mockup nav bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0"
        style={{ background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {["#ef4444","#f59e0b","#22c55e"].map((c) => (
          <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
        ))}
      </div>

      {/* Mockup content */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-2">
        {/* Headline blocks */}
        <div className="h-2 rounded-sm w-3/4" style={{ background: "rgba(255,255,255,0.15)" }} />
        <div className="h-1.5 rounded-sm w-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-1.5 rounded-sm w-2/3" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* CTA button */}
        <div
          className="h-4 rounded-sm w-1/3 mt-1"
          style={{ background: template.accentColor, opacity: 0.9 }}
        />
      </div>

      {/* Live demo badge */}
      <div
        className="absolute top-6 right-2 text-[7px] uppercase tracking-[.1em] px-1.5 py-0.5"
        style={{
          background: template.accentColor,
          color: "#fff",
          fontFamily: "monospace",
        }}
      >
        Live Demo
      </div>

      {/* Card footer */}
      <div
        className="px-3 py-2 flex items-center justify-between flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#111114" }}
      >
        <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
          {template.name}
        </span>
        <span
          className="text-[7px] uppercase tracking-[.08em]"
          style={{ color: template.accentColor, fontFamily: "monospace" }}
        >
          {template.industry}
        </span>
      </div>
    </div>
  );
}

interface TemplatesShowcaseProps {
  id?: string;
}

export function TemplatesShowcase({ id }: TemplatesShowcaseProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const filtered =
    selectedIndustry === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.industry === selectedIndustry);

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
            06 / Templates
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
            { text: "40+ TEMPLATES.", outline: false },
            { text: "YOUR INDUSTRY.",  outline: true  },
            { text: "YOUR BRAND.",     outline: false },
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

      {/* Filter tabs */}
      <div
        className="flex items-center gap-0 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {INDUSTRIES.map((industry) => {
          const isActive = selectedIndustry === industry;
          return (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className="px-5 py-3 text-[9px] uppercase tracking-[.1em] whitespace-nowrap transition-all flex-shrink-0"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                color: isActive ? "var(--accent)" : "var(--muted)",
                borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                background: isActive ? "var(--accent-dim)" : "transparent",
              }}
            >
              {industry}
            </button>
          );
        })}
      </div>

      {/* Template filmstrip grid */}
      <div className="px-8 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndustry}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.slice(0, 4).map((template, i) => (
              <motion.div
                key={template.id}
                initial={shouldReduceMotion ? "visible" : "hidden"}
                animate="visible"
                variants={fadeUpVariants}
                custom={i}
              >
                <TemplateMockup template={template} />
              </motion.div>
            ))}

            {/* +More ghost card */}
            {filtered.length > 4 && (
              <motion.div
                initial={shouldReduceMotion ? "visible" : "hidden"}
                animate="visible"
                variants={fadeUpVariants}
                custom={4}
                className="hidden md:flex items-center justify-center"
                style={{
                  height: 180,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <span
                  className="text-[10px] uppercase tracking-[.1em]"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}
                >
                  +{filtered.length - 4} More
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Browse all button */}
      <div className="px-8 pb-10">
        <motion.a
          href="/templates"
          className="flex items-center justify-center gap-2 w-full py-4 text-[10px] uppercase tracking-[.12em] transition-all"
          style={{
            border: "1px solid var(--border-mid)",
            color: "var(--muted)",
          }}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={fadeUpVariants}
          custom={5}
          whileHover={shouldReduceMotion ? {} : { borderColor: "var(--accent)", color: "var(--accent)" }}
        >
          Browse All 40+ Templates →
        </motion.a>
      </div>
    </section>
  );
}
