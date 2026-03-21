// apps/peakq/components/sections/hero.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  revealVariants,
  fadeUpVariants,
  expandLineVariants,
  EASE_CINEMATIC,
} from "@/lib/animation-variants";
import { HeroShaderBg } from "@/components/hero-shader-bg";

const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "Services",  href: "/services" },
  { label: "Pricing",   href: "/pricing" },
  { label: "About",     href: "/about" },
];

const DELIVERABLE_PILLS = ["Websites", "Blogs", "Ads", "Email", "Reviews", "Analytics"];

const HEADLINE_LINES = [
  { text: "WEBSITES. BLOGS.",  outline: false, accent: false },
  { text: "ADS. CONTENT.",     outline: true,  accent: false },
  { text: "ALL OF IT —",       outline: false, accent: false },
  { text: "HANDLED.",          outline: false, accent: true  },
];

interface HeroProps {
  id?: string;
}

export function Hero({ id }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      className="relative flex flex-col overflow-hidden"
      style={{
        minHeight: "88vh",
        borderBottom: "1px solid var(--border)",
        background: "#050507",
      }}
    >
      {/* Shader mesh gradient background */}
      <HeroShaderBg />

      {/* Blueprint grid overlay — subtle on top of shader */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.012) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 1,
        }}
      />

      {/* Glassmorphism navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-[18px] sticky top-0"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(5,5,7,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        aria-label="Main navigation"
      >
        <div
          className="text-[13px] font-black tracking-[.16em] uppercase"
          style={{ color: "var(--text)" }}
        >
          PEAKQ
        </div>
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[10px] uppercase tracking-[.1em] transition-colors hover:opacity-100"
                style={{ color: "var(--muted)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/get-started"
          className="text-[10px] uppercase tracking-[.1em] px-4 py-2 transition-all hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
          style={{
            border: "1px solid var(--border-mid)",
            color: "var(--accent)",
          }}
        >
          Get Started →
        </Link>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 py-[72px] max-w-[860px]">
        {/* Index line */}
        <motion.div
          className="flex items-center gap-2.5 mb-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={fadeUpVariants}
          custom={0}
        >
          <div className="w-6 h-px" style={{ background: "var(--border-mid)" }} />
          <span
            className="text-[9px] uppercase tracking-[.14em]"
            style={{ color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}
          >
            01 / HOMEPAGE
          </span>
        </motion.div>

        {/* Expand line */}
        <motion.div
          className="w-full h-px mb-8 origin-left"
          style={{ background: "var(--border)" }}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={expandLineVariants}
        />

        {/* Headline with clip-path word reveals */}
        <h1
          style={{
            fontSize: "clamp(48px, 6.5vw, 78px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: 0.94,
            marginBottom: "1.5rem",
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
                animate="visible"
                variants={revealVariants}
                custom={i}
              >
                {line.text}
              </motion.span>
            </div>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-[13px] leading-[1.7] mb-8 max-w-[480px]"
          style={{ color: "var(--muted)" }}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={fadeUpVariants}
          custom={5}
        >
          Your website, blog, ads, and entire digital presence — built, managed, and grown by one
          system.{" "}
          <span style={{ color: "var(--text)", fontWeight: 500 }}>
            No agency. No freelancers.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={fadeUpVariants}
          custom={7}
        >
          <Link
            href="#services"
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[.08em] font-semibold transition-all hover:brightness-110"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            See What We Handle →
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[.08em] transition-all hover:border-[var(--border-mid)]"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            View Templates
          </Link>
        </motion.div>
      </div>

      {/* Spinning badge — bottom right */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 w-[120px] h-[120px] hidden md:block"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
        variants={fadeUpVariants}
        custom={8}
      >
        {/* Rotating color arc ring */}
        <motion.div
          className="absolute inset-0"
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="arc-grad-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="arc-grad-2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {/* Color arc segments */}
            <circle cx="60" cy="60" r="38" fill="none" stroke="url(#arc-grad-1)" strokeWidth="3.5"
              strokeDasharray="60 180" strokeLinecap="round" />
            <circle cx="60" cy="60" r="38" fill="none" stroke="url(#arc-grad-2)" strokeWidth="3.5"
              strokeDasharray="40 200" strokeDashoffset="-90" strokeLinecap="round" />
            <circle cx="60" cy="60" r="38" fill="none" stroke="#f472b6" strokeWidth="3"
              strokeDasharray="30 210" strokeDashoffset="-160" strokeLinecap="round" opacity="0.7" />
          </svg>
        </motion.div>

        {/* Rotating text */}
        <motion.svg
          viewBox="0 0 120 120"
          className="absolute inset-0 w-full h-full"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          aria-label="Websites, Blogs, Ads, Email, Reviews, Analytics — Powered by Business AI OS"
        >
          <defs>
            <path
              id="badge-text-path"
              d="M 60,60 m -48,0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
              fill="none"
            />
          </defs>
          <text
            fill="rgba(255,255,255,0.6)"
            fontSize="7.2"
            fontFamily="var(--font-mono, monospace)"
            letterSpacing="2.4"
          >
            <textPath href="#badge-text-path">
              WEBSITES · BLOGS · ADS · EMAIL · REVIEWS · ANALYTICS ·
            </textPath>
          </text>
        </motion.svg>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-8 flex items-center gap-2"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
        variants={fadeUpVariants}
        custom={9}
      >
        <motion.div
          className="w-px h-8"
          style={{ background: "var(--border-mid)", transformOrigin: "top" }}
          animate={shouldReduceMotion ? {} : { scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="text-[8px] uppercase tracking-[.14em]"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-mono, monospace)" }}
        >
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
}
