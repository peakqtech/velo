"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const SERVICES = [
  {
    icon: "🤖",
    name: "AI Automation",
    description: "Deploy intelligent workflows that handle repetitive tasks, follow-ups, and reporting — freeing your team for high-value work.",
    href: "/services/ai-automation",
  },
  {
    icon: "🖥️",
    name: "Website Templates",
    description: "Industry-specific, conversion-optimized templates deployed in hours, not weeks. Your brand. Your content. Zero setup cost.",
    href: "/templates",
  },
  {
    icon: "📊",
    name: "Analytics & QA",
    description: "Real-time performance dashboards and automated quality assurance that surface issues before your clients do.",
    href: "/services/analytics-qa",
  },
  {
    icon: "🎯",
    name: "Lead Capture",
    description: "Multi-channel lead capture systems with automated qualification, nurturing sequences, and CRM sync out of the box.",
    href: "/services/lead-capture",
  },
  {
    icon: "⭐",
    name: "Reputation Engine",
    description: "Systematic review generation, monitoring, and response workflows that compound your online reputation over time.",
    href: "/services/reputation",
  },
  {
    icon: "🔗",
    name: "Custom Integrations",
    description: "Connect your existing tools — PMS, CRM, booking, POS — into a unified data layer that powers your AI team.",
    href: "/services/integrations",
  },
];

export function ServicesPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Eyebrow */}
      <p
        className="text-[11px] uppercase tracking-[0.15em] mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}
      >
        What We Build
      </p>

      {/* H2 */}
      <h2
        className="mb-14"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 4vw, 52px)",
          letterSpacing: "-0.01em",
          lineHeight: 1.05,
        }}
      >
        WE DON&apos;T JUST BUILD<br />
        WEBSITES. WE BUILD<br />
        REVENUE MACHINES.
      </h2>

      {/* Grid */}
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.name}
            className="flex flex-col p-6 gap-4"
            style={{
              backgroundColor: "rgba(5,13,31,0.8)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" as const }}
            whileHover={{
              scale: 1.02,
              y: -4,
              borderColor: "rgba(59,130,246,0.3)",
              backgroundColor: "rgba(59,130,246,0.04)",
              transition: { duration: 0.15, ease: "easeOut" as const },
            }}
          >
            <div
              className="w-9 h-9 flex items-center justify-center text-lg"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {service.icon}
            </div>
            <div
              className="text-lg uppercase"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              {service.name}
            </div>
            <p className="text-[13px] leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              {service.description}
            </p>
            <Link
              href={service.href}
              className="text-[10px] uppercase tracking-[0.1em] mt-auto transition-opacity hover:opacity-70"
              style={{ fontFamily: "Courier New, monospace", color: "#3b82f6" }}
            >
              Learn More →
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
