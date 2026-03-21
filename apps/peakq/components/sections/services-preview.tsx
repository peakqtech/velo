// apps/peakq/components/sections/services-preview.tsx
"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  Globe,
  FileText,
  Megaphone,
  Mail,
  Star,
  BarChart3,
} from "lucide-react";
import { revealVariants, fadeUpVariants, expandLineVariants } from "@/lib/animation-variants";

const SERVICES = [
  {
    icon: Globe,
    title: "Website & Landing Pages",
    description: "Custom-built sites that convert. Designed for your industry, optimised for search, live in 48 hours.",
    learnMoreHref: "/services/website",
    learnMoreLabel: "See Templates",
  },
  {
    icon: FileText,
    title: "Blog & Content",
    description: "Weekly articles, SEO content, and thought-leadership — written, published, and promoted for you.",
    learnMoreHref: "/services/blog",
    learnMoreLabel: "Learn More",
  },
  {
    icon: Megaphone,
    title: "Ads & Campaigns",
    description: "Google, Meta, and retargeting campaigns managed end-to-end. You set the budget; we maximise it.",
    learnMoreHref: "/services/ads",
    learnMoreLabel: "Learn More",
  },
  {
    icon: Mail,
    title: "Email & Follow-Ups",
    description: "Automated sequences that nurture leads, recover abandoned carts, and keep customers coming back.",
    learnMoreHref: "/services/email",
    learnMoreLabel: "Learn More",
  },
  {
    icon: Star,
    title: "Reviews & Reputation",
    description: "Automated review requests, response templates, and reputation monitoring across Google and Yelp.",
    learnMoreHref: "/services/reviews",
    learnMoreLabel: "Learn More",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "A single dashboard showing your traffic, leads, conversions, and ROI — updated in real time.",
    learnMoreHref: "/services/analytics",
    learnMoreLabel: "Learn More",
  },
];

interface ServicesPreviewProps {
  id?: string;
}

export function ServicesPreview({ id }: ServicesPreviewProps) {
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
        {/* Eyebrow */}
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
            02 / What We Handle
          </span>
        </motion.div>

        {/* Headline */}
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
            { text: "EVERYTHING YOUR", outline: false },
            { text: "BUSINESS NEEDS",  outline: true  },
            { text: "ONLINE. DONE.",   outline: false },
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

        {/* Expand line */}
        <motion.div
          className="w-full h-px mt-8 origin-left"
          style={{ background: "var(--border)" }}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          variants={expandLineVariants}
        />
      </div>

      {/* Services grid — 3×2 bordered */}
      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              className="group px-8 py-10 flex flex-col gap-4"
              style={{
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                transition: "background 0.25s ease",
              }}
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate={inView ? "visible" : "hidden"}
              variants={fadeUpVariants}
              custom={i + 3}
              whileHover={shouldReduceMotion ? {} : { backgroundColor: "rgba(59,130,246,0.05)" }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{ border: "1px solid var(--border-mid)" }}
              >
                <Icon
                  size={14}
                  aria-hidden="true"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <div>
                <div
                  className="text-[11px] uppercase tracking-[.08em] font-semibold mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {service.title}
                </div>
                <p className="text-[12px] leading-[1.7]" style={{ color: "var(--muted)" }}>
                  {service.description}
                </p>
              </div>
              <a
                href={service.learnMoreHref}
                className="mt-auto text-[9px] uppercase tracking-[.1em] transition-colors"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono, monospace)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {service.learnMoreLabel} →
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* AI footnote row */}
      <motion.div
        className="flex items-center gap-3 px-8 py-5"
        style={{ borderTop: "1px solid var(--border)" }}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate={inView ? "visible" : "hidden"}
        variants={fadeUpVariants}
        custom={9}
      >
        <span
          className="text-[8px]"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
        >
          ●
        </span>
        <span className="text-[11px] leading-[1.6]" style={{ color: "var(--muted)" }}>
          All coordinated by our Business AI Operating System — replacing your agency, freelancer, and marketing stack.
        </span>
      </motion.div>
      </div>
    </section>
  );
}
