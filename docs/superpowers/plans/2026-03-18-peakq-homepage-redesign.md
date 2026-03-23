# PeakQ Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `apps/peakq` homepage from a generic dark template to a conversion-focused "Bold Tech Precision" site that serves as a live proof of the AI-Powered Business Operating System platform.

**Architecture:** Replace all 6 existing homepage sections with 9 new sections (Hero → LogoMarquee → Stats → ServicesPreview → PlatformPreview → CompoundingStack → Testimonials → FinalCta → Footer). Extract global Navbar+Footer from root layout into a `(site)` route group so the homepage can use its own inline nav and page-level Footer.

**Tech Stack:** Next.js 15 App Router · Tailwind CSS v4 · Framer Motion v12 · TypeScript · `next/font/google` (Bebas Neue + Space Mono)

**Spec:** `docs/superpowers/specs/2026-03-18-peakq-homepage-redesign-design.md`

---

## File Map

| Action | File |
|--------|------|
| Modify | `apps/peakq/app/layout.tsx` — strip Navbar/Footer, add Bebas Neue + Space Mono fonts + CSS vars |
| Create | `apps/peakq/app/(site)/layout.tsx` — Navbar + Footer for all non-homepage pages |
| Modify | `apps/peakq/app/globals.css` — replace green tokens → blue, add `@keyframes marquee/bounce`, add `prefers-reduced-motion` |
| Rewrite | `apps/peakq/components/sections/hero.tsx` — full-bleed hero with inline nav + neural SVG |
| Create | `apps/peakq/components/sections/logo-marquee.tsx` — CSS-only infinite marquee |
| Create | `apps/peakq/components/sections/stats.tsx` — count-up stats row |
| Delete | `apps/peakq/components/sections/industry-showcase.tsx` |
| Rewrite | `apps/peakq/components/sections/services-preview.tsx` — 3×2 card grid |
| Create | `apps/peakq/components/sections/platform-preview.tsx` — browser chrome mockup |
| Rewrite | `apps/peakq/components/sections/compounding-stack.tsx` — 3-step sequential reveal |
| Create | `apps/peakq/components/sections/testimonials.tsx` — 3-column testimonial grid |
| Keep | `apps/peakq/components/sections/pricing-preview.tsx` — untouched (used by pricing page) |
| Rewrite | `apps/peakq/components/sections/final-cta.tsx` — accent animation + dual CTAs |
| Modify | `apps/peakq/components/footer.tsx` — mono font + blue accent |
| Rewrite | `apps/peakq/app/page.tsx` — new 9-section assembly, no Navbar import |

---

## Task 0: Layout Restructure + Design System

**Purpose:** Fonts, CSS variables, global keyframes, and route group so homepage can suppress global Navbar.

**Files:**
- Modify: `apps/peakq/app/layout.tsx`
- Create: `apps/peakq/app/(site)/layout.tsx`
- Modify: `apps/peakq/app/globals.css`

- [ ] **Step 1: Update root layout.tsx — add fonts, strip Navbar/Footer, apply CSS variables**

> **Important:** Fonts go in the ROOT layout (not `(site)/layout.tsx`) so they load on ALL pages including the homepage. The `bebasNeue.variable` and `spaceMono.variable` classnames apply the CSS custom properties `--font-display` and `--font-mono` to the `<html>` element, making them available everywhere via `var(--font-display)` / `var(--font-mono)`.

```tsx
// apps/peakq/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",  // makes var(--font-display) available globally
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",     // makes var(--font-mono) available globally
});

export const metadata: Metadata = {
  title: "PeakQ — AI-Powered Business Operating System",
  description:
    "We don't just build websites. We build revenue machines. AI-powered platform purpose-built for your industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Apply all font variables to <html> so var(--font-display/mono/sans) work everywhere
    <html
      lang="en"
      className={`dark ${inter.variable} ${bebasNeue.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[#020a1a] text-white antialiased">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `(site)` route group layout — Navbar + Footer for all non-homepage pages**

```tsx
// apps/peakq/app/(site)/layout.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Move all non-homepage page directories into the `(site)` group**

```bash
cd apps/peakq/app
mkdir -p "(site)"
mv about blog contact features get-started pricing services templates "(site)/"
```

> **Note:** Route groups (`(site)`) are transparent to URL routing. `/about` still resolves to `(site)/about/page.tsx`. No URL changes.

- [ ] **Step 4: Update `globals.css` — replace green tokens with blue, add keyframes**

Replace the existing `globals.css` content. Key additions:

```css
/* apps/peakq/app/globals.css */
@import "tailwindcss";

:root {
  --bg-base: #020a1a;
  --bg-surface: #050d1f;
  --bg-elevated: #030d20;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-blue: rgba(59, 130, 246, 0.2);
  --accent-blue: #3b82f6;
  --accent-blue-light: #60a5fa;
  --accent-blue-muted: rgba(59, 130, 246, 0.1);
  --text-primary: #ffffff;
  --text-muted: rgba(255, 255, 255, 0.45);
  --text-dim: rgba(255, 255, 255, 0.25);
}

@keyframes marquee {
  from { transform: translateX(0%); }
  to   { transform: translateX(-50%); }
}

@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Verify build passes**

```bash
cd /path/to/monorepo
pnpm --filter peakq build
```

Expected: Build succeeds with no TypeScript errors. If pages inside `(site)/` fail to find `Navbar`/`Footer`, check import paths (`@/components/navbar` and `@/components/footer`).

> **If build fails on other pages:** The `@/` alias always resolves from `apps/peakq/` regardless of where inside `app/` the page lives — no import changes needed in moved pages.

- [ ] **Step 6: Commit**

```bash
git add apps/peakq/app/layout.tsx apps/peakq/app/globals.css "apps/peakq/app/(site)/layout.tsx"
git commit -m "feat(peakq): add font variables, route group, blue design tokens"
```

---

## Task 1: Hero Section

**File:** `apps/peakq/components/sections/hero.tsx` (full rewrite, `"use client"`)

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
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

// Edges: pairs of node indices
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Stroke dasharray for edge draw animation
  const edgeLength = 200; // approximate

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
              key={i}
              x1={NODES[a].cx} y1={NODES[a].cy}
              x2={NODES[b].cx} y2={NODES[b].cy}
              stroke="#3b82f6"
              strokeWidth="0.5"
              strokeDasharray={dashed ? "4 4" : undefined}
              strokeDashoffset={shouldReduceMotion ? 0 : edgeLength}
              animate={shouldReduceMotion ? {} : { strokeDashoffset: 0 }}
              transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
            />
          ))}
          {NODES.map((node, i) => (
            <motion.circle
              key={i}
              cx={node.cx} cy={node.cy} r={node.r}
              fill={node.fill}
              animate={shouldReduceMotion ? {} : {
                opacity: [0.2, 0.8, 0.2],
                transition: { duration: 3, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" },
              }}
              initial={{ opacity: 0.2 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Floating navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
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
            style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.05)" }}>
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm --filter peakq build
```

Expected: No errors in `hero.tsx`.

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/sections/hero.tsx
git commit -m "feat(peakq): rewrite hero — neural SVG, inline nav, Bebas Neue headline"
```

---

## Task 2: Logo Marquee

**File:** `apps/peakq/components/sections/logo-marquee.tsx` (new, **server component — do NOT add `"use client"`**)

> The marquee uses CSS animation only (`animation: marquee 25s linear infinite`). No Framer Motion, no hooks — it must remain a server component.

- [ ] **Step 1: Write the component**

```tsx
// apps/peakq/components/sections/logo-marquee.tsx
// NOTE: No "use client" — CSS animation only, stays a server component
const CLIENTS = [
  "APEX DENTAL", "NOVA REALTY", "KLEO FITNESS", "BLOOM HOSPITALITY",
  "SUMMIT LEGAL", "CREST CLINICS", "PEAK EVENTS", "HARBOR STAYS",
];

export function LogoMarquee() {
  // Duplicate array for seamless loop
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <div
      className="w-full overflow-hidden py-6"
      style={{ borderTop: "1px solid rgba(59,130,246,0.12)", borderBottom: "1px solid rgba(59,130,246,0.12)" }}
    >
      <p
        className="text-center mb-4 text-[10px] uppercase tracking-[0.15em]"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.25)" }}
      >
        Trusted by businesses across 12+ industries
      </p>
      <div className="flex overflow-hidden">
        <div
          className="flex gap-16 whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          {items.map((name, i) => (
            <span
              key={i}
              className="text-sm tracking-[0.1em]"
              style={{ fontFamily: "Courier New, monospace", color: "rgba(255,255,255,0.25)" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm --filter peakq build
```

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/sections/logo-marquee.tsx
git commit -m "feat(peakq): add logo marquee trust strip"
```

---

## Task 3: Stats Row + Delete industry-showcase

**Files:**
- Create: `apps/peakq/components/sections/stats.tsx`
- Delete: `apps/peakq/components/sections/industry-showcase.tsx`

- [ ] **Step 1: Write stats.tsx**

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const STATS = [
  { number: 50, suffix: "+", label: "Industry Templates" },
  { number: 3, suffix: "×", label: "Faster Deployment" },
  { number: 98, suffix: "%", label: "Client Retention Rate" },
  { number: 0, suffix: "", label: "Setup Cost — Ever", prefix: "$" },
];

function useCountUp(target: number, duration = 1200, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

function StatItem({
  stat,
  delay,
  trigger,
}: {
  stat: (typeof STATS)[0];
  delay: number;
  trigger: boolean;
}) {
  const count = useCountUp(stat.number, 1200, trigger);
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-10 px-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="text-4xl font-bold mb-1" style={{ fontFamily: "Impact, sans-serif" }}>
        {stat.prefix && <span className="text-white">{stat.prefix}</span>}
        <span className="text-white">{count}</span>
        <span style={{ color: "#3b82f6" }}>{stat.suffix}</span>
      </div>
      <div
        className="text-[10px] uppercase tracking-[0.12em]"
        style={{ fontFamily: "Courier New, monospace", color: "rgba(255,255,255,0.45)" }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4"
      style={{
        borderTop: "1px solid rgba(59,130,246,0.12)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
      }}
    >
      {STATS.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} delay={i * 0.15} trigger={isInView} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Delete industry-showcase.tsx**

```bash
rm apps/peakq/components/sections/industry-showcase.tsx
```

- [ ] **Step 3: Temporarily patch page.tsx to remove the deleted import**

The current `apps/peakq/app/page.tsx` imports `IndustryShowcase`. Remove that import and usage now so the build doesn't break. (Task 10 will fully replace `page.tsx`.)

```tsx
// In apps/peakq/app/page.tsx — remove these two lines for now:
// import { IndustryShowcase } from "@/components/sections/industry-showcase";
// <IndustryShowcase />
```

- [ ] **Step 4: Verify build**

```bash
pnpm --filter peakq build
```

Expected: Build passes. `industry-showcase.tsx` is gone; its import is removed from `page.tsx`.

- [ ] **Step 5: Commit**

```bash
git add apps/peakq/components/sections/stats.tsx apps/peakq/app/page.tsx
git rm apps/peakq/components/sections/industry-showcase.tsx
git commit -m "feat(peakq): add stats row with count-up; remove industry-showcase"
```

---

## Task 4: Services Grid

**File:** `apps/peakq/components/sections/services-preview.tsx` (rewrite, `"use client"`)

- [ ] **Step 1: Rewrite the component**

```tsx
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
              background: "rgba(5,13,31,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              y: -4,
              borderColor: "rgba(59,130,246,0.3)",
              backgroundColor: "rgba(59,130,246,0.04)",
              transition: { duration: 0.15, ease: "easeOut" },
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
```

- [ ] **Step 2: Verify build**

```bash
pnpm --filter peakq build
```

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/sections/services-preview.tsx
git commit -m "feat(peakq): rewrite services grid — 3×2 cards with hover lift"
```

---

## Task 5: Platform Preview

**File:** `apps/peakq/components/sections/platform-preview.tsx` (new, `"use client"`)

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function KpiCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-4"
      style={{ background: "#020a1a", border: "1px solid rgba(59,130,246,0.15)" }}
    >
      <div className="text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: "Courier New, monospace", color: "rgba(255,255,255,0.4)" }}>
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {delta && (
        <div className="text-[11px]" style={{ color: "#3b82f6" }}>{delta}</div>
      )}
    </div>
  );
}

export function PlatformPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow + H2 */}
        <div className="text-center mb-12">
          <p
            className="text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}
          >
            See It In Action
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 4vw, 52px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
            }}
          >
            YOUR ENTIRE BUSINESS<br />
            FROM ONE DASHBOARD.
          </h2>
        </div>

        {/* Browser mockup */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            border: "1px solid rgba(59,130,246,0.25)",
            boxShadow: isInView
              ? "0 0 80px rgba(59,130,246,0.2)"
              : "0 0 60px rgba(59,130,246,0.1)",
            transition: "box-shadow 0.7s ease",
          }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: "#050d1f", borderBottom: "1px solid rgba(59,130,246,0.15)" }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <div
              className="ml-4 px-4 py-1 text-[11px] flex-1 max-w-xs"
              style={{
                fontFamily: "Courier New, monospace",
                background: "#020a1a",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              peakq.tech/dashboard
            </div>
          </div>

          {/* Dashboard interior */}
          <div className="p-6" style={{ background: "#030d20" }}>
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <KpiCard label="Leads Today" value="24" delta="+8 vs yesterday" />
              <KpiCard label="Reviews" value="4.9★" delta="12 new this week" />
              <KpiCard label="Automated %" value="78%" delta="↑ 6% this month" />
            </div>

            {/* Activity feed + mini chart */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-4"
                style={{ background: "#020a1a", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                <div className="text-[10px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "Courier New, monospace", color: "rgba(255,255,255,0.4)" }}>
                  Recent Activity
                </div>
                {[
                  "Lead captured via web form",
                  "Review request sent × 3",
                  "Follow-up email triggered",
                  "New booking confirmed",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div
                className="p-4 flex flex-col"
                style={{ background: "#020a1a", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                <div className="text-[10px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "Courier New, monospace", color: "rgba(255,255,255,0.4)" }}>
                  Lead Volume — 7d
                </div>
                <svg viewBox="0 0 200 60" className="flex-1">
                  <polyline
                    points="0,50 30,40 60,45 90,25 120,30 150,15 200,10"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <polyline
                    points="0,50 30,40 60,45 90,25 120,30 150,15 200,10 200,60 0,60"
                    fill="rgba(59,130,246,0.08)"
                    stroke="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm --filter peakq build
```

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/sections/platform-preview.tsx
git commit -m "feat(peakq): add platform preview — browser chrome dashboard mockup"
```

---

## Task 6: How It Works (CompoundingStack)

**File:** `apps/peakq/components/sections/compounding-stack.tsx` (rewrite, `"use client"`)

- [ ] **Step 1: Rewrite the component**

```tsx
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
          style={{ height: "2px", zIndex: 0 }}
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
        >
          <motion.line
            x1="33" y1="1" x2="67" y2="1"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="4 4"
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
              background: "rgba(5,13,31,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.3, ease: "easeOut" }}
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
```

- [ ] **Step 2: Verify build**

```bash
pnpm --filter peakq build
```

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/sections/compounding-stack.tsx
git commit -m "feat(peakq): rewrite compounding-stack — 3-step sequential reveal"
```

---

## Task 7: Testimonials

**File:** `apps/peakq/components/sections/testimonials.tsx` (new, `"use client"`)

- [ ] **Step 1: Write the component**

```tsx
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
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
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
              className="w-10 h-10 flex items-center justify-center text-sm transition-colors"
              style={{
                border: "1px solid rgba(59,130,246,0.2)",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-mono)",
              }}
              aria-label={i === 0 ? "Previous" : "Next"}
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
              background: "rgba(5,13,31,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
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
                  border: "1px solid rgba(59,130,246,0.2)",
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
```

- [ ] **Step 2: Verify build**

```bash
pnpm --filter peakq build
```

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/sections/testimonials.tsx
git commit -m "feat(peakq): add testimonials section with specific-number quotes"
```

---

## Task 8: Final CTA

**File:** `apps/peakq/components/sections/final-cta.tsx` (rewrite, `"use client"`)

- [ ] **Step 1: Rewrite the component**

```tsx
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
          transition={{ duration: 0.6, ease: "easeOut" }}
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
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
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
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
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
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
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
            style={{ border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}
          >
            Talk to Us First
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm --filter peakq build
```

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/sections/final-cta.tsx
git commit -m "feat(peakq): rewrite final-cta — accent underline + glow animation"
```

---

## Task 9: Footer Update

**File:** `apps/peakq/components/footer.tsx` (minor update — mono font + blue accent)

- [ ] **Step 1: Update footer.tsx**

Replace the logo style and accent color:
- Logo: `PEAKQ` in `var(--font-mono)`, uppercase, tracking
- Column headers: `var(--font-mono)` instead of `text-gray-400`
- Hover color: `hover:text-blue-400` instead of `hover:text-white`
- Border: `border-blue-900/30` instead of `border-gray-800`

```tsx
// apps/peakq/components/footer.tsx
import Link from "next/link";
import { BRAND } from "@/lib/constants";

const FOOTER_LINKS = {
  Platform: [
    { label: "Templates", href: "/templates" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "QA & Testing", href: "/services/qa-testing" },
    { label: "Custom Dev", href: "/services/custom-development" },
    { label: "Managed", href: "/services/managed" },
  ],
  "Get In Touch": [
    { label: "hello@peakq.tech", href: "mailto:hello@peakq.tech" },
    { label: "Book a Call", href: "/get-started" },
  ],
} as const;

export function Footer() {
  return (
    <footer style={{ background: "#020a1a", borderTop: "1px solid rgba(59,130,246,0.12)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div
              className="text-lg font-bold tracking-[0.12em] mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PEAKQ
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              {BRAND.tagline}
            </p>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([category, links]) => (
              <div key={category}>
                <h3
                  className="text-[10px] uppercase tracking-[0.12em] mb-4"
                  style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)" }}
                >
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] transition-colors hover:text-blue-400"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-[10px]"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)" }}
          >
            © 2026 PeakQ. All rights reserved.
          </p>
          <p
            className="text-[10px]"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.15)" }}
          >
            {BRAND.subtleProof}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm --filter peakq build
```

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/components/footer.tsx
git commit -m "feat(peakq): update footer — mono font, blue accent, 4-column grid"
```

---

## Task 10: Page Assembly

**File:** `apps/peakq/app/page.tsx` (full replacement)

- [ ] **Step 1: Replace page.tsx with new 9-section assembly**

```tsx
// apps/peakq/app/page.tsx
import { Hero } from "@/components/sections/hero";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Stats } from "@/components/sections/stats";
import { ServicesPreview } from "@/components/sections/services-preview";
import { PlatformPreview } from "@/components/sections/platform-preview";
import { CompoundingStack } from "@/components/sections/compounding-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/footer";
// DO NOT import Navbar — hero.tsx renders its own nav inline
// DO NOT import IndustryShowcase or PricingPreview — replaced by Stats and Testimonials

export const metadata = {
  title: "PeakQ — AI-Powered Business Operating System",
  description:
    "We don't just build websites. We build revenue machines. AI-powered platform purpose-built for your industry.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <Stats />
      <ServicesPreview />
      <PlatformPreview />
      <CompoundingStack />
      <Testimonials />
      <FinalCta />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Final build check**

```bash
pnpm --filter peakq build
```

Expected: Clean build. All 9 sections resolve. No TypeScript errors.

- [ ] **Step 3: Visual smoke test**

```bash
pnpm --filter peakq dev
```

Open `http://localhost:4100` and verify:
- [ ] Bebas Neue loads for H1 headings (condensed bold uppercase)
- [ ] Space Mono loads for nav and labels
- [ ] Hero fills full viewport, neural SVG visible at low opacity
- [ ] Inline nav appears (no duplicate global navbar)
- [ ] Logo marquee scrolls continuously
- [ ] Stats count up on scroll into view
- [ ] Services cards have hover lift effect
- [ ] Platform Preview browser chrome mockup renders
- [ ] How It Works steps reveal sequentially
- [ ] Testimonials slide in from right
- [ ] Final CTA underline sweep + glow trigger on scroll
- [ ] Footer has 4-column mono layout
- [ ] No green anywhere — all accents are blue `#3b82f6`
- [ ] Non-homepage pages still have Navbar via `(site)` layout
- [ ] `prefers-reduced-motion`: On macOS go to System Settings → Accessibility → Display → Reduce Motion, reload `localhost:4100`, verify all animations are suppressed

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/app/page.tsx
git commit -m "feat(peakq): assemble 9-section homepage — hero to footer"
```

---

## Rollback Reference

If anything breaks other pages after the `(site)` route group restructure:

```bash
# Revert (site) layout if needed
cd apps/peakq/app
mv "(site)"/about "(site)"/blog "(site)"/contact "(site)"/features \
   "(site)"/get-started "(site)"/pricing "(site)"/services "(site)"/templates .
# Restore Navbar+Footer to root layout.tsx
```

Pages use absolute imports (`@/components/...`) so moving directories within `app/` does not affect component imports.

---

## Done Criteria

- [ ] `pnpm --filter peakq build` passes with zero errors
- [ ] Homepage at `localhost:4100` renders all 9 sections
- [ ] Bebas Neue and Space Mono fonts load (visible in DevTools Network tab)
- [ ] All animations play on first visit (and are suppressed with `prefers-reduced-motion`)
- [ ] No green accent anywhere — all blue
- [ ] `/features`, `/pricing`, `/about` still render with Navbar+Footer
