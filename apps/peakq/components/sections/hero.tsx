"use client";

import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// 22-node neural network data
const NODES = [
  { cx: 80, cy: 120, r: 3, fill: "#60a5fa" },
  { cx: 200, cy: 60, r: 2, fill: "#93c5fd" },
  { cx: 350, cy: 180, r: 3, fill: "#60a5fa" },
  { cx: 150, cy: 300, r: 2, fill: "#93c5fd" },
  { cx: 480, cy: 80, r: 3, fill: "#60a5fa" },
  { cx: 600, cy: 150, r: 4, fill: "#60a5fa" },
  { cx: 750, cy: 60, r: 2, fill: "#93c5fd" },
  { cx: 900, cy: 120, r: 3, fill: "#60a5fa" },
  { cx: 1050, cy: 80, r: 2, fill: "#93c5fd" },
  { cx: 1150, cy: 200, r: 3, fill: "#60a5fa" },
  { cx: 1100, cy: 350, r: 2, fill: "#93c5fd" },
  { cx: 950, cy: 300, r: 3, fill: "#60a5fa" },
  { cx: 800, cy: 380, r: 2, fill: "#93c5fd" },
  { cx: 650, cy: 420, r: 4, fill: "#60a5fa" },
  { cx: 500, cy: 350, r: 2, fill: "#93c5fd" },
  { cx: 300, cy: 450, r: 3, fill: "#60a5fa" },
  { cx: 100, cy: 500, r: 2, fill: "#93c5fd" },
  { cx: 250, cy: 600, r: 3, fill: "#60a5fa" },
  { cx: 450, cy: 580, r: 2, fill: "#93c5fd" },
  { cx: 700, cy: 600, r: 3, fill: "#60a5fa" },
  { cx: 900, cy: 550, r: 2, fill: "#93c5fd" },
  { cx: 1100, cy: 600, r: 3, fill: "#60a5fa" },
];

// Edges: pairs of node indices [a, b, dashed]
const EDGES: [number, number, boolean][] = [
  [0, 1, false], [1, 2, false], [2, 5, false], [0, 3, true],
  [3, 5, false], [4, 5, false], [5, 6, false], [6, 7, false],
  [7, 8, true],  [8, 9, false], [9, 10, false],[10, 11, false],
  [11, 12, true],[12, 13, false],[13, 14, false],[14, 15, false],
  [15, 16, true],[16, 17, false],[17, 18, false],[18, 19, false],
  [19, 20, false],[20, 21, false],[13, 19, true],[5, 13, false],
];

const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Stroke dasharray for edge draw animation
  const edgeLength = 600; // covers all edge lengths in the 1200×700 viewBox

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020a1a 0%, #050f2e 40%, #020a1a 100%)" }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 600px 400px at 50% 40%, rgba(59,130,246,0.12), transparent)",
        }}
      />

      {/* Neural network SVG */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: shouldReduceMotion ? 0 : bgY }}
      >
        <svg
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ opacity: 0.18 }}
        >
          {EDGES.map(([a, b, dashed], i) => (
            <motion.line
              key={`edge-${a}-${b}`}
              x1={NODES[a].cx} y1={NODES[a].cy}
              x2={NODES[b].cx} y2={NODES[b].cy}
              stroke="#3b82f6"
              strokeWidth="0.5"
              strokeDasharray={dashed ? `4 4` : `${edgeLength}`}
              strokeDashoffset={shouldReduceMotion ? 0 : edgeLength}
              animate={shouldReduceMotion ? {} : { strokeDashoffset: 0 }}
              transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
            />
          ))}
          {NODES.map((node, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={node.cx} cy={node.cy} r={node.r}
              fill={node.fill}
              animate={shouldReduceMotion ? {} : { opacity: [0.2, 0.8, 0.2] }}
              transition={shouldReduceMotion ? {} : { duration: 3, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" as const }}
              initial={{ opacity: 0.2 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Floating navigation */}
      <nav aria-label="Main navigation" className="relative z-10 flex items-center justify-between px-8 py-6">
        <div
          className="text-lg font-bold tracking-[0.12em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          PEAKQ
        </div>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.12em] transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.45)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/get-started"
          className="text-[11px] uppercase tracking-[0.1em] px-4 py-2 transition-colors hover:bg-blue-500/10"
          style={{
            fontFamily: "var(--font-mono)",
            border: "1px solid rgba(59,130,246,0.5)",
            color: "#60a5fa",
          }}
        >
          Get Started
        </Link>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 gap-5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-5 max-w-4xl"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(59,130,246,0.3)", backgroundColor: "rgba(59,130,246,0.05)" }}>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span
              className="text-[10px] uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.6)" }}
            >
              AI-Powered Business Operating System
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 8vw, 96px)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            YOUR INDUSTRY.<br />
            YOUR AI TEAM.<br />
            YOUR{" "}
            <span style={{ color: "#3b82f6" }}>[UNFAIR]</span>{" "}
            EDGE.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-base max-w-[520px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Deploy AI-powered workflows, templates, and automation systems purpose-built for your industry. No setup cost. No hiring. Just results.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap justify-center">
            <motion.div
              animate={shouldReduceMotion ? {} : {
                boxShadow: [
                  "0 0 0px rgba(59,130,246,0)",
                  "0 0 20px rgba(59,130,246,0.5)",
                  "0 0 0px rgba(59,130,246,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, delay: 2 }}
            >
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors"
              >
                Deploy Now →
              </Link>
            </motion.div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors hover:bg-blue-500/10"
              style={{ border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}
            >
              View Pricing
            </Link>
          </motion.div>

          {/* Proof note */}
          <motion.p
            variants={itemVariants}
            className="text-[11px]"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)" }}
          >
            // This site runs on our platform. You&apos;re looking at the product.
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center pb-8 gap-2">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-blue-400/40" />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
