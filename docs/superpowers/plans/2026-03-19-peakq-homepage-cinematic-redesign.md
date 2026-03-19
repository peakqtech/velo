# PeakQ Homepage — Cinematic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the PeakQ homepage into a cinematic brutalist editorial site with clip-path word-reveal animations, ethereal ambient background, scroll dot navigation, and plain-language deliverables-first messaging.

**Architecture:** All work is isolated to `apps/peakq`. New shared components (`EtherealBackground`, `ScrollNav`) are created in `apps/peakq/components/`. A shared animation variants file avoids duplication across sections. `SectionDivider` usage is removed — replaced by the scroll nav.

**Tech Stack:** Next.js 16, React 19, Framer Motion 12, Tailwind CSS 4, Lucide React 0.500, TypeScript 5. No new packages needed.

---

## File Map

### Create
| File | Responsibility |
|---|---|
| `apps/peakq/components/ethereal-background.tsx` | Fixed ambient glow orb background layer |
| `apps/peakq/components/scroll-nav.tsx` | Fixed right-side dot nav + top progress bar |
| `apps/peakq/hooks/use-active-section.ts` | IntersectionObserver hook → returns active section id |
| `apps/peakq/lib/animation-variants.ts` | Shared Framer Motion variants: revealVariants, fadeUp, expandLine |
| `apps/peakq/components/sections/templates-showcase.tsx` | New templates section: industry tabs + filmstrip |

### Modify
| File | Change |
|---|---|
| `apps/peakq/app/globals.css` | Replace CSS token set, add `.text-outline` utility classes |
| `apps/peakq/app/page.tsx` | Add EtherealBackground + ScrollNav, section IDs, remove SectionDivider |
| `apps/peakq/components/sections/hero.tsx` | Full rewrite: new messaging, layout, clip-path animations |
| `apps/peakq/components/sections/stats.tsx` | New stat values + brutalist grid layout (remove count-up) |
| `apps/peakq/components/sections/services-preview.tsx` | "What We Handle" reframe, Lucide icons, AI footnote row |
| `apps/peakq/components/sections/platform-preview.tsx` | New headline + updated dashboard sidebar labels |
| `apps/peakq/components/sections/compounding-stack.tsx` | New headline + updated copy + brutalist 2×2 grid |
| `apps/peakq/components/sections/testimonials.tsx` | New headline + updated copy + 2×2 ruled grid |
| `apps/peakq/components/sections/final-cta.tsx` | Full rewrite: deliverables-first headline + pills |
| `apps/peakq/components/footer.tsx` | Updated tagline + frosted glass treatment |

### Delete (implicit — stop importing)
| File | Action |
|---|---|
| `apps/peakq/components/section-divider.tsx` | No longer used — remove from `page.tsx` import |

---

## Task 1: CSS Tokens + Animation Variants

**Files:**
- Modify: `apps/peakq/app/globals.css`
- Create: `apps/peakq/lib/animation-variants.ts`

- [ ] **Step 1.1: Replace CSS token set in globals.css**

Open `apps/peakq/app/globals.css`. Replace the entire `:root` block with:

```css
:root {
  --bg:         #050507;
  --bg-raised:  #0d0d10;
  --border:     rgba(255,255,255,0.07);
  --border-mid: rgba(255,255,255,0.12);
  --text:       #f0f0f0;
  --muted:      rgba(255,255,255,0.35);
  --accent:     #3b82f6;
  --accent-dim: rgba(59,130,246,0.15);
}
```

Remove the old tokens: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--border-subtle`, `--border-blue`, `--accent-blue`, `--accent-blue-light`, `--accent-blue-muted`, `--text-primary`, `--text-muted`, `--text-dim`.

- [ ] **Step 1.2: Add utility classes to globals.css**

Append after the `:root` block:

```css
/* Hollow stroke headline utility */
.text-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255,255,255,0.32);
}
.text-outline-thin {
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.28);
}

/* Brutalist grid borders helper */
.grid-bordered {
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
}
.grid-bordered > * {
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
```

- [ ] **Step 1.3: Create `apps/peakq/lib/animation-variants.ts`**

```ts
// apps/peakq/lib/animation-variants.ts
import type { Variants } from "framer-motion";

export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

/** Clip-path word reveal — wrap each line in overflow:hidden, apply to inner span */
export const revealVariants: Variants = {
  hidden: { y: "106%" },
  visible: (i: number = 0) => ({
    y: 0,
    transition: {
      duration: 0.75,
      delay: i * 0.13,
      ease: EASE_CINEMATIC,
    },
  }),
};

/** Fade + slight upward drift — for body text, pills, CTAs */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: EASE_CINEMATIC,
    },
  }),
};

/** Horizontal expand — for decorative ruled lines */
export const expandLineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: EASE_CINEMATIC },
  },
};

/** Container that triggers children with useInView */
export const inViewContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
```

- [ ] **Step 1.4: Verify dev server still starts**

```bash
cd apps/peakq && pnpm dev
```

Open http://localhost:4100 — page should still load (styling will be broken, that's expected).

- [ ] **Step 1.5: Commit**

```bash
git add apps/peakq/app/globals.css apps/peakq/lib/animation-variants.ts
git commit -m "feat(peakq): new CSS tokens + shared animation variants"
```

---

## Task 2: EtherealBackground Component

**Files:**
- Create: `apps/peakq/components/ethereal-background.tsx`

- [ ] **Step 2.1: Create the component**

```tsx
// apps/peakq/components/ethereal-background.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

const ORBS = [
  {
    size: 600,
    color: "rgba(37,99,235,0.16)",
    style: { top: "-8%", left: "-4%" },
    duration: 22,
    delay: 0,
    drift: { x: [0, 40, 20, -30, 0], y: [0, -30, 50, 20, 0] },
  },
  {
    size: 500,
    color: "rgba(99,102,241,0.12)",
    style: { top: "28%", right: "-8%" },
    duration: 28,
    delay: -8,
    drift: { x: [0, -35, -15, 25, 0], y: [0, 25, -40, -10, 0] },
  },
  {
    size: 400,
    color: "rgba(59,130,246,0.09)",
    style: { bottom: "8%", left: "18%" },
    duration: 18,
    delay: -14,
    drift: { x: [0, 30, -20, 10, 0], y: [0, -20, 30, -15, 0] },
  },
  {
    size: 300,
    color: "rgba(139,92,246,0.07)",
    style: { top: "55%", left: "58%" },
    duration: 24,
    delay: -5,
    drift: { x: [0, -20, 15, -10, 0], y: [0, 15, -25, 10, 0] },
  },
] as const;

export function EtherealBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            ...orb.style,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: orb.drift.x,
                  y: orb.drift.y,
                }
          }
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Edge vignette to keep content readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, transparent 40%, #050507 100%), radial-gradient(ellipse 60% 40% at 50% 100%, transparent 40%, #050507 100%)",
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2.2: Verify it renders**

Import into `app/page.tsx` temporarily and confirm orbs are visible at http://localhost:4100.

- [ ] **Step 2.3: Commit**

```bash
git add apps/peakq/components/ethereal-background.tsx
git commit -m "feat(peakq): ethereal ambient background — drifting glow orbs"
```

---

## Task 3: Scroll Navigation

**Files:**
- Create: `apps/peakq/hooks/use-active-section.ts`
- Create: `apps/peakq/components/scroll-nav.tsx`

- [ ] **Step 3.1: Create `use-active-section.ts`**

```ts
// apps/peakq/hooks/use-active-section.ts
"use client";

import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return activeId;
}
```

- [ ] **Step 3.2: Create `scroll-nav.tsx`**

```tsx
// apps/peakq/components/scroll-nav.tsx
"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { useActiveSection } from "@/hooks/use-active-section";

export interface SectionDef {
  id: string;
  label: string;
}

interface ScrollNavProps {
  sections: SectionDef[];
}

export function ScrollNav({ sections }: ScrollNavProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const activeId = useActiveSection(sections.map((s) => s.id));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Top scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px origin-left z-[300]"
        style={{
          scaleX: shouldReduceMotion ? 1 : scaleX,
          background: "linear-gradient(90deg, #3b82f6, rgba(99,102,241,0.6))",
        }}
      />

      {/* Right-side dot navigation — hidden on mobile */}
      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-[200] hidden md:flex flex-col gap-3.5 items-end"
        aria-label="Section navigation"
      >
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="flex items-center gap-2.5 group"
              aria-label={`Go to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Label — visible on hover or active */}
              <span
                className="text-[8px] uppercase tracking-[0.12em] font-mono whitespace-nowrap transition-all duration-200"
                style={{
                  color: isActive
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0)",
                  transform: isActive ? "translateX(0)" : "translateX(4px)",
                }}
              >
                {section.label}
              </span>
              <span
                className="group-hover:[--label-opacity:0.5] group-hover:[--label-x:0]"
                style={{ display: "contents" }}
              />

              {/* Dot */}
              <motion.div
                className="rounded-full flex-shrink-0"
                animate={{
                  width: isActive ? 8 : 6,
                  height: isActive ? 8 : 6,
                  backgroundColor: isActive ? "#3b82f6" : "rgba(255,255,255,0.2)",
                  boxShadow: isActive ? "0 0 8px rgba(59,130,246,0.6)" : "none",
                }}
                transition={{ duration: 0.2 }}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
```

- [ ] **Step 3.3: Commit**

```bash
git add apps/peakq/hooks/use-active-section.ts apps/peakq/components/scroll-nav.tsx
git commit -m "feat(peakq): scroll dot navigation + progress bar"
```

---

## Task 4: Update `page.tsx`

**Files:**
- Modify: `apps/peakq/app/page.tsx`

- [ ] **Step 4.1: Rewrite page.tsx**

```tsx
// apps/peakq/app/page.tsx
import { EtherealBackground } from "@/components/ethereal-background";
import { ScrollNav } from "@/components/scroll-nav";
import { Hero } from "@/components/sections/hero";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Stats } from "@/components/sections/stats";
import { ServicesPreview } from "@/components/sections/services-preview";
import { TemplatesShowcase } from "@/components/sections/templates-showcase";
import { PlatformPreview } from "@/components/sections/platform-preview";
import { CompoundingStack } from "@/components/sections/compounding-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "PeakQ — Websites, Blogs, Ads & Digital Presence. Handled.",
  description:
    "Your website, blog, ads, and entire digital presence — built, managed, and grown by one system. No agency. No freelancers.",
};

const SECTIONS = [
  { id: "hero",      label: "Home" },
  { id: "services",  label: "Services" },
  { id: "templates", label: "Templates" },
  { id: "platform",  label: "Platform" },
  { id: "how",       label: "How It Works" },
  { id: "results",   label: "Results" },
  { id: "cta",       label: "Get Started" },
];

export default function HomePage() {
  return (
    <>
      <EtherealBackground />
      <ScrollNav sections={SECTIONS} />
      <Hero id="hero" />
      <LogoMarquee />
      <Stats />
      <ServicesPreview id="services" />
      <TemplatesShowcase id="templates" />
      <PlatformPreview id="platform" />
      <CompoundingStack id="how" />
      <Testimonials id="results" />
      <FinalCta id="cta" />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4.2: Verify page loads without errors**

```bash
pnpm dev
```

Expect TypeScript errors on the section components (they don't accept `id` yet) — that's fixed in later tasks.

- [ ] **Step 4.3: Commit**

```bash
git add apps/peakq/app/page.tsx
git commit -m "feat(peakq): wire EtherealBackground, ScrollNav, new section order"
```

---

## Task 5: Hero Section

**Files:**
- Modify: `apps/peakq/components/sections/hero.tsx`

- [ ] **Step 5.1: Rewrite hero.tsx**

```tsx
// apps/peakq/components/sections/hero.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { revealVariants, fadeUpVariants, expandLineVariants, EASE_CINEMATIC } from "@/lib/animation-variants";

const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "Services",  href: "/services" },
  { label: "Pricing",   href: "/pricing" },
  { label: "About",     href: "/about" },
];

const DELIVERABLE_PILLS = ["Websites", "Blogs", "Ads", "Email", "Reviews", "Analytics"];

const HEADLINE_LINES = [
  { text: "WEBSITES. BLOGS.",  outline: false },
  { text: "ADS. CONTENT.",     outline: true  },
  { text: "ALL OF IT —",       outline: false },
  { text: "HANDLED.",          outline: false, accent: true },
];

interface HeroProps {
  id?: string;
}

export function Hero({ id }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      className="relative flex flex-col overflow-hidden border-b"
      style={{
        minHeight: "88vh",
        borderColor: "var(--border)",
        background: "transparent",
      }}
    >
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glassmorphism navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-[18px] border-b sticky top-0"
        style={{
          borderColor: "var(--border)",
          background: "rgba(5,5,7,0.88)",
          backdropFilter: "blur(16px)",
        }}
        aria-label="Main navigation"
      >
        <div
          className="text-[13px] font-black tracking-[.16em] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          PEAKQ
        </div>
        <ul className="hidden md:flex items-center gap-6 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[10px] uppercase tracking-[.1em] transition-colors"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/get-started"
          className="text-[10px] uppercase tracking-[.1em] px-4 py-2 transition-all"
          style={{
            fontFamily: "var(--font-mono)",
            border: "1px solid var(--border-mid)",
            color: "var(--accent)",
          }}
        >
          Get Started →
        </Link>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 py-[72px]">
        {/* Index line */}
        <motion.div
          className="flex items-center gap-2.5 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          custom={0}
        >
          <div className="w-6 h-px" style={{ background: "var(--border-mid)" }} />
          <span
            className="text-[9px] uppercase tracking-[.14em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
          >
            01 / HOMEPAGE
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          style={{
            fontSize: "clamp(48px, 6.5vw, 78px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: 0.94,
            marginBottom: 0,
          }}
        >
          {HEADLINE_LINES.map((line, i) => (
            <div key={i} style={{ marginBottom: 3 }}>
              <div style={{ overflow: "hidden", display: "block" }}>
                <motion.span
                  display="block"
                  variants={revealVariants}
                  custom={i}
                  style={{
                    display: "block",
                    ...(line.outline
                      ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" }
                      : {}),
                    ...(line.accent ? { color: "var(--accent)" } : {}),
                  }}
                >
                  {line.text}
                </motion.span>
              </div>
            </div>
          ))}
        </motion.h1>

        {/* Expand rule */}
        <motion.div
          className="my-7 origin-left"
          style={{ height: 1, background: "var(--border-mid)" }}
          initial="hidden"
          animate="visible"
          variants={expandLineVariants}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE_CINEMATIC }}
        />

        {/* Bottom row: sub + actions */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr auto", alignItems: "end" }}>
          <div>
            <motion.p
              className="text-[13px] leading-[1.7] max-w-[400px]"
              style={{ color: "var(--muted)" }}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={5}
            >
              Your{" "}
              <strong style={{ color: "var(--text)" }}>
                website, blog, ads, and entire digital presence
              </strong>{" "}
              — built, managed, and grown by one system. No agency. No freelancers.
            </motion.p>

            {/* Deliverable pills */}
            <motion.div
              className="flex flex-wrap gap-1.5 mt-3.5"
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={6}
            >
              {DELIVERABLE_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="text-[9px] uppercase tracking-[.1em] px-2.5 py-1.5"
                  style={{
                    fontFamily: "var(--font-mono)",
                    border: "1px solid rgba(59,130,246,0.35)",
                    color: "#60a5fa",
                    background: "rgba(59,130,246,0.06)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {pill}
                </span>
              ))}
              <span
                className="text-[8px] uppercase tracking-[.1em] px-2.5 py-1.5"
                style={{
                  fontFamily: "var(--font-mono)",
                  border: "1px solid var(--border)",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                Powered by Business AI OS
              </span>
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col gap-2 items-end"
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            custom={7}
          >
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-white transition-colors whitespace-nowrap"
              style={{ background: "var(--accent)" }}
            >
              See What We Handle →
            </Link>
            <Link
              href="/templates"
              className="text-[10px] uppercase tracking-[.1em] transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
            >
              View Templates
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="relative z-10 flex items-center gap-2 px-8 pb-7"
        aria-hidden="true"
      >
        <div className="w-8 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
        <span
          className="text-[8px] uppercase tracking-[.14em]"
          style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)" }}
        >
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 5.2: Verify hero renders at http://localhost:4100**

Check:
- [ ] Headline lines reveal from bottom up on load
- [ ] Rule line expands left→right
- [ ] Blueprint grid visible faintly
- [ ] Pills with blue borders render
- [ ] Reduced motion: open DevTools → Rendering → Emulate prefers-reduced-motion → animations should be instant

- [ ] **Step 5.3: Commit**

```bash
git add apps/peakq/components/sections/hero.tsx
git commit -m "feat(peakq): hero rewrite — brutalist headline, clip-path reveals, deliverables pills"
```

---

## Task 6: Stats Section

**Files:**
- Modify: `apps/peakq/components/sections/stats.tsx`

- [ ] **Step 6.1: Rewrite stats.tsx**

Replace entire file:

```tsx
// apps/peakq/components/sections/stats.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STATS = [
  { number: "200+", label: "Active Clients" },
  { number: "40+",  label: "Templates Ready" },
  { number: "4.3×", label: "Average ROI" },
  { number: "48h",  label: "Time to Launch" },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 border-b"
      style={{ borderColor: "var(--border)", background: "rgba(5,5,7,0.5)", backdropFilter: "blur(8px)" }}
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="relative px-6 py-7 overflow-hidden"
          style={{ borderRight: "1px solid var(--border)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Accent underline on hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
            style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
          <div
            className="text-[34px] font-black tracking-[-0.03em] leading-none mb-1.5"
            style={{ color: "var(--text)" }}
          >
            {stat.number.replace(/[+×h%]/g, "")}
            <span style={{ color: "var(--accent)", fontSize: "0.55em" }}>
              {stat.number.replace(/[^+×h%]/g, "")}
            </span>
          </div>
          <div
            className="text-[9px] uppercase tracking-[.12em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
          >
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6.2: Commit**

```bash
git add apps/peakq/components/sections/stats.tsx
git commit -m "feat(peakq): stats — brutalist 4-cell grid, accent underline hover"
```

---

## Task 7: Services / "What We Handle"

**Files:**
- Modify: `apps/peakq/components/sections/services-preview.tsx`

- [ ] **Step 7.1: Rewrite services-preview.tsx**

```tsx
// apps/peakq/components/sections/services-preview.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  LayoutTemplate,
  PenLine,
  BarChart2,
  Mail,
  Star,
  PlugZap,
} from "lucide-react";
import { revealVariants, fadeUpVariants } from "@/lib/animation-variants";

const SERVICES = [
  {
    Icon: LayoutTemplate,
    name: "Website & Landing Pages",
    description: "Industry-specific sites launched in 48h. Built for conversions, not just looks. Updated on demand.",
    link: "/templates",
    linkLabel: "See Templates →",
  },
  {
    Icon: PenLine,
    name: "Blog & Content",
    description: "SEO-optimised blog posts, case studies, and content published weekly — without a content team.",
    link: "/services/content",
    linkLabel: "Learn More →",
  },
  {
    Icon: BarChart2,
    name: "Ads & Campaigns",
    description: "Google and Meta ad campaigns created, launched, and optimised — without an agency markup.",
    link: "/services/ads",
    linkLabel: "Learn More →",
  },
  {
    Icon: Mail,
    name: "Email & Follow-Ups",
    description: "Automated email sequences that nurture leads, re-engage clients, and drive repeat bookings.",
    link: "/services/email",
    linkLabel: "Learn More →",
  },
  {
    Icon: Star,
    name: "Reviews & Reputation",
    description: "Automated review requests, monitoring, and responses that build your star rating while you sleep.",
    link: "/services/reputation",
    linkLabel: "Learn More →",
  },
  {
    Icon: PlugZap,
    name: "Analytics & Reporting",
    description: "One dashboard showing website traffic, ad spend, leads, and revenue. Know what's working instantly.",
    link: "/services/analytics",
    linkLabel: "Learn More →",
  },
];

interface ServicesPreviewProps {
  id?: string;
}

export function ServicesPreview({ id }: ServicesPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id={id} className="py-14 px-8 border-b" style={{ borderColor: "var(--border)" }}>
      {/* Eyebrow */}
      <motion.p
        className="flex items-center gap-2 text-[9px] uppercase tracking-[.14em] mb-3.5"
        style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        custom={0}
      >
        <span className="inline-block w-4 h-px" style={{ background: "var(--accent)" }} />
        What We Handle
      </motion.p>

      {/* Headline */}
      <h2
        style={{
          fontSize: "clamp(26px, 3.2vw, 40px)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-.03em",
          lineHeight: 0.96,
          marginBottom: 36,
        }}
      >
        {["EVERYTHING YOUR", "BUSINESS NEEDS", "ONLINE. DONE."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden", display: "block" }}>
            <motion.span
              style={{
                display: "block",
                ...(i === 1 ? { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.28)" } : {}),
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              custom={i}
            >
              {line}
            </motion.span>
          </div>
        ))}
      </h2>

      {/* Services grid */}
      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-3 grid-bordered"
      >
        {SERVICES.map((svc, i) => (
          <motion.div
            key={svc.name}
            className="relative p-6 overflow-hidden transition-colors"
            style={{ background: "transparent" }}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ backgroundColor: "rgba(59,130,246,0.03)" }}
          >
            {/* Left accent bar */}
            <motion.div
              className="absolute top-0 left-0 w-0.5 origin-top"
              style={{ background: "var(--accent)", height: "100%", scaleY: 0 }}
              whileHover={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div
              className="w-[30px] h-[30px] flex items-center justify-center mb-3.5"
              style={{ border: "1px solid var(--border-mid)", color: "var(--accent)" }}
            >
              <svc.Icon size={14} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div
              className="text-[11px] font-bold uppercase tracking-[.06em] mb-2"
              style={{ color: "var(--text)" }}
            >
              {svc.name}
            </div>
            <p className="text-[10px] leading-[1.65] mb-3" style={{ color: "var(--muted)" }}>
              {svc.description}
            </p>
            <a
              href={svc.link}
              className="text-[8px] uppercase tracking-[.1em]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
            >
              {svc.linkLabel}
            </a>
          </motion.div>
        ))}
      </div>

      {/* AI footnote */}
      <div
        className="flex items-center gap-2.5 px-6 py-3.5"
        style={{
          background: "rgba(59,130,246,0.03)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "var(--accent)", animation: "pulse 2s infinite" }}
          aria-hidden="true"
        />
        <p
          className="text-[8px] uppercase tracking-[.1em]"
          style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.28)" }}
        >
          All coordinated by our{" "}
          <strong style={{ color: "rgba(255,255,255,0.55)" }}>Business AI Operating System</strong>
          {" "}— replacing your agency, freelancer, and marketing stack.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 7.2: Commit**

```bash
git add apps/peakq/components/sections/services-preview.tsx
git commit -m "feat(peakq): services rewrite — 'What We Handle', Lucide icons, AI footnote"
```

---

## Task 8: Templates Showcase (New Section)

**Files:**
- Create: `apps/peakq/components/sections/templates-showcase.tsx`

- [ ] **Step 8.1: Create templates-showcase.tsx**

```tsx
// apps/peakq/components/sections/templates-showcase.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { revealVariants, fadeUpVariants } from "@/lib/animation-variants";

type Industry = "All" | "Hospitality" | "Healthcare" | "Real Estate" | "Fitness" | "Restaurant";

interface Template {
  id: string;
  name: string;
  industry: Exclude<Industry, "All">;
  accentColor: string;
  bgColor: string;
  demoUrl?: string;
}

const TEMPLATES: Template[] = [
  { id: "hotel-pro",       name: "Hotel Pro",       industry: "Hospitality", accentColor: "#3b82f6", bgColor: "#0a1a2e" },
  { id: "clinic-suite",    name: "Clinic Suite",    industry: "Healthcare",  accentColor: "#8b5cf6", bgColor: "#150a22" },
  { id: "realtor-os",      name: "Realtor OS",      industry: "Real Estate", accentColor: "#10b981", bgColor: "#0a1a0d" },
  { id: "fitness-co",      name: "Fitness Co",      industry: "Fitness",     accentColor: "#f59e0b", bgColor: "#1a1000" },
  { id: "the-table",       name: "The Table",       industry: "Restaurant",  accentColor: "#ef4444", bgColor: "#1a0a0a" },
  { id: "resort-suite",    name: "Resort Suite",    industry: "Hospitality", accentColor: "#3b82f6", bgColor: "#0a1525" },
  { id: "dental-pro",      name: "Dental Pro",      industry: "Healthcare",  accentColor: "#06b6d4", bgColor: "#0a1a20" },
  { id: "estate-agent",    name: "Estate Agent",    industry: "Real Estate", accentColor: "#10b981", bgColor: "#081a0a" },
];

const TABS: Industry[] = ["All", "Hospitality", "Healthcare", "Real Estate", "Fitness", "Restaurant"];

interface TemplatesShowcaseProps {
  id?: string;
}

export function TemplatesShowcase({ id }: TemplatesShowcaseProps) {
  const [activeTab, setActiveTab] = useState<Industry>("All");

  const filtered = activeTab === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.industry === activeTab);

  return (
    <section id={id} className="py-14 px-8 border-b" style={{ borderColor: "var(--border)" }}>
      {/* Header row */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <motion.p
            className="flex items-center gap-2 text-[9px] uppercase tracking-[.14em] mb-3.5"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0}
          >
            <span className="inline-block w-4 h-px" style={{ background: "var(--accent)" }} />
            Ready to Deploy
          </motion.p>
          <h2
            style={{
              fontSize: "clamp(26px, 3.2vw, 40px)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-.03em",
              lineHeight: 0.96,
            }}
          >
            {["40+ TEMPLATES.", "YOUR INDUSTRY.", "YOUR BRAND."].map((line, i) => (
              <div key={i} style={{ overflow: "hidden", display: "block" }}>
                <motion.span
                  style={{
                    display: "block",
                    ...(i === 1 ? { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.28)" } : {}),
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={revealVariants}
                  custom={i}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h2>
        </div>
        <span
          className="text-[9px] uppercase tracking-[.1em] self-start mt-2"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          Live in 48h →
        </span>
      </div>

      {/* Industry tabs */}
      <div className="flex border-b mb-4" style={{ borderColor: "var(--border)" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-3.5 py-2 text-[9px] uppercase tracking-[.1em] transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              color: activeTab === tab ? "var(--accent)" : "var(--muted)",
              borderBottom: activeTab === tab ? "1px solid var(--accent)" : "1px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Template filmstrip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="grid grid-cols-2 md:grid-cols-4 gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.slice(0, 3).map((tmpl) => (
            <motion.div
              key={tmpl.id}
              className="relative overflow-hidden cursor-pointer transition-transform"
              style={{ border: "1px solid var(--border)" }}
              whileHover={{ y: -3, borderColor: "var(--border-mid)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Mini site mockup */}
              <div
                className="h-[90px] flex flex-col p-1.5"
                style={{ background: tmpl.bgColor }}
              >
                <div className="h-[5px] rounded-sm mb-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-3 rounded-sm mb-0.5 w-4/5" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="h-2 rounded-sm mb-1.5 w-3/5" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-1.5 w-8 rounded-sm" style={{ background: tmpl.accentColor, opacity: 0.6 }} />
              </div>

              {/* Live demo badge */}
              <div
                className="absolute top-1.5 right-1.5 text-[7px] px-1.5 py-0.5 uppercase tracking-[.08em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60a5fa",
                }}
              >
                Live Demo
              </div>

              <div className="px-2.5 py-2" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="text-[9px] font-bold uppercase tracking-[.05em] mb-0.5">{tmpl.name}</div>
                <div
                  className="text-[7px] uppercase tracking-[.08em]"
                  style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.28)" }}
                >
                  {tmpl.industry}
                </div>
              </div>
            </motion.div>
          ))}

          {/* "+N More" placeholder card */}
          <div
            className="flex flex-col items-center justify-center min-h-[130px] cursor-pointer"
            style={{
              border: "1px dashed var(--border)",
              opacity: 0.4,
            }}
          >
            <div
              className="text-[20px] font-black mb-1"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              +{Math.max(0, filtered.length - 3)}
            </div>
            <div
              className="text-[8px] uppercase tracking-[.1em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)" }}
            >
              More Templates
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Browse all */}
      <a
        href="/templates"
        className="flex items-center justify-center gap-2 mt-4 py-3.5 text-[9px] uppercase tracking-[.1em] transition-colors"
        style={{
          fontFamily: "var(--font-mono)",
          border: "1px solid var(--border)",
          color: "var(--muted)",
        }}
      >
        Browse All 40+ Templates →
      </a>
    </section>
  );
}
```

- [ ] **Step 8.2: Verify tabs filter correctly at http://localhost:4100**

Click each industry tab — grid should animate out/in. "+N More" should update.

- [ ] **Step 8.3: Commit**

```bash
git add apps/peakq/components/sections/templates-showcase.tsx
git commit -m "feat(peakq): templates showcase — industry tabs + filmstrip + AnimatePresence"
```

---

## Task 9: Platform Preview

**Files:**
- Modify: `apps/peakq/components/sections/platform-preview.tsx`

- [ ] **Step 9.1: Update headline + sidebar labels**

Replace the `<h2>` content and the sidebar nav items. Keep the existing browser mockup structure — only change text and styling to match the design system.

Key changes:
- Eyebrow: `"The Dashboard"`
- Headline lines: `"ONE SCREEN."` / `"YOUR WHOLE"` (outline) / `"DIGITAL BUSINESS."`
- Browser URL: `"app.peakq.tech/dashboard"`
- Sidebar items: `Overview`, `Website`, `Ads`, `Email`, `Reviews`, `Analytics`
- Section accepts `id?: string` prop on root `<section>`
- Replace hardcoded `#020a1a` / `rgba(59,130,246,...)` colors with CSS vars where possible
- Add clip-path reveal to headline using `revealVariants` + `whileInView`

- [ ] **Step 9.2: Commit**

```bash
git add apps/peakq/components/sections/platform-preview.tsx
git commit -m "feat(peakq): platform preview — updated headline + sidebar labels"
```

---

## Task 10: Compounding Stack

**Files:**
- Modify: `apps/peakq/components/sections/compounding-stack.tsx`

- [ ] **Step 10.1: Rewrite to 2×2 brutalist grid**

Replace entire file:

```tsx
// apps/peakq/components/sections/compounding-stack.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { revealVariants } from "@/lib/animation-variants";

const STEPS = [
  {
    num: "01",
    title: "Pick Your Template",
    desc: "Choose from 40+ industry templates. Add your brand and copy. We handle deployment.",
  },
  {
    num: "02",
    title: "We Launch Everything",
    desc: "Website, blog, ads, email, and review system — all live within 48 hours.",
  },
  {
    num: "03",
    title: "It Runs Itself",
    desc: "Content publishes. Ads optimise. Emails send. Reviews get requested automatically.",
  },
  {
    num: "4.3×",
    title: "Average ROI at 90 Days",
    desc: "Clients running the full system for 90+ days report a 4.3× return on investment.",
    isROI: true,
  },
];

interface CompoundingStackProps {
  id?: string;
}

export function CompoundingStack({ id }: CompoundingStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id={id} className="py-14 px-8 border-b" style={{ borderColor: "var(--border)" }}>
      <motion.p
        className="flex items-center gap-2 text-[9px] uppercase tracking-[.14em] mb-3.5"
        style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      >
        <span className="inline-block w-4 h-px" style={{ background: "var(--accent)" }} />
        The Process
      </motion.p>

      <h2
        style={{
          fontSize: "clamp(26px, 3.2vw, 40px)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-.03em",
          lineHeight: 0.96,
          marginBottom: 32,
        }}
      >
        {["UP AND RUNNING", "IN 48 HOURS."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden", display: "block" }}>
            <motion.span
              style={{
                display: "block",
                ...(i === 1 ? { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.28)" } : {}),
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              custom={i}
            >
              {line}
            </motion.span>
          </div>
        ))}
      </h2>

      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 grid-bordered"
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            className="relative p-6 overflow-hidden transition-colors group"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.01)" }}
          >
            {/* Top accent bar */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 origin-left"
              style={{ background: "var(--accent)", scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
            />
            <div
              className="text-[48px] font-black leading-none mb-2.5 tracking-[-0.04em]"
              style={
                step.isROI
                  ? { color: "var(--accent)", fontSize: 28 }
                  : { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.07)" }
              }
            >
              {step.num}
            </div>
            <div className="text-[13px] font-bold uppercase tracking-[.04em] mb-2">
              {step.title}
            </div>
            <p className="text-[11px] leading-[1.65]" style={{ color: "var(--muted)" }}>
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 10.2: Commit**

```bash
git add apps/peakq/components/sections/compounding-stack.tsx
git commit -m "feat(peakq): compounding stack — 2×2 brutalist grid, updated headline + copy"
```

---

## Task 11: Testimonials

**Files:**
- Modify: `apps/peakq/components/sections/testimonials.tsx`

- [ ] **Step 11.1: Rewrite testimonials.tsx**

Replace entire file:

```tsx
// apps/peakq/components/sections/testimonials.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { revealVariants } from "@/lib/animation-variants";

const TESTIMONIALS = [
  {
    quote: "PeakQ handles our website, weekly blog posts, and review follow-ups. We went from 3.8 to 4.6 stars in 30 days — 47 new reviews, zero effort from our team.",
    highlight: "3.8 to 4.6 stars in 30 days",
    name: "James M.", role: "GM · Marriott Franchise · Austin", initials: "JM",
  },
  {
    quote: "Their template was live in 41 hours. The automated email sequences captured 89 leads in the first week. Our close rate is up 34%.",
    highlight: "41 hours",
    name: "Sarah R.", role: "Owner · RE/MAX Pinnacle · Denver", initials: "SR",
  },
  {
    quote: "I replaced a $6,000/month agency with PeakQ at $299/month. Better results, more visibility, less stress. I should have done this two years ago.",
    highlight: "$6,000/month agency with PeakQ at $299/month",
    name: "Dr. Karen L.", role: "Director · Premier Medical · Chicago", initials: "DK",
  },
  {
    quote: "Replaced 3 FTEs of admin and marketing work for $299/month. ROI calculation took 30 seconds. Easiest business decision I've made this year.",
    highlight: "3 FTEs of admin and marketing work",
    name: "Tom W.", role: "Founder · FitWorks · 12 Locations", initials: "TW",
  },
];

interface TestimonialsProps {
  id?: string;
}

export function Testimonials({ id }: TestimonialsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id={id} className="py-14 px-8 border-b" style={{ borderColor: "var(--border)" }}>
      <motion.p
        className="flex items-center gap-2 text-[9px] uppercase tracking-[.14em] mb-3.5"
        style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      >
        <span className="inline-block w-4 h-px" style={{ background: "var(--accent)" }} />
        Client Results
      </motion.p>

      <h2
        style={{
          fontSize: "clamp(26px, 3.2vw, 40px)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-.03em",
          lineHeight: 0.96,
          marginBottom: 32,
        }}
      >
        {["REAL NUMBERS.", "REAL CLIENTS."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden", display: "block" }}>
            <motion.span
              style={{
                display: "block",
                ...(i === 1 ? { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.28)" } : {}),
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              custom={i}
            >
              {line}
            </motion.span>
          </div>
        ))}
      </h2>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 grid-bordered">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.initials}
            className="p-6 transition-colors"
            style={{ backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.015)" }}
          >
            <div
              className="text-[40px] leading-none mb-2.5"
              style={{ color: "rgba(255,255,255,0.06)", fontFamily: "Georgia, serif" }}
              aria-hidden="true"
            >
              "
            </div>
            <p className="text-[11px] leading-[1.72] mb-4" style={{ color: "rgba(255,255,255,0.72)" }}>
              {t.quote.split(t.highlight).map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && <strong style={{ color: "#fff" }}>{t.highlight}</strong>}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{ border: "1px solid var(--border-mid)", background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
              >
                {t.initials}
              </div>
              <div>
                <div className="text-[10px] font-bold">{t.name}</div>
                <div
                  className="text-[8px] uppercase tracking-[.1em]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                >
                  {t.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 11.2: Commit**

```bash
git add apps/peakq/components/sections/testimonials.tsx
git commit -m "feat(peakq): testimonials — 2×2 grid, bold highlights, updated copy"
```

---

## Task 12: Final CTA

**Files:**
- Modify: `apps/peakq/components/sections/final-cta.tsx`

- [ ] **Step 12.1: Rewrite final-cta.tsx**

```tsx
// apps/peakq/components/sections/final-cta.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { revealVariants, fadeUpVariants } from "@/lib/animation-variants";

const PILLS = ["Websites", "Blogs", "Ads", "Email", "Reviews", "Analytics"];

interface FinalCtaProps {
  id?: string;
}

export function FinalCta({ id }: FinalCtaProps) {
  return (
    <section
      id={id}
      className="relative py-20 px-8 border-b overflow-hidden"
      style={{ borderColor: "var(--border)", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 500px 250px at 50% 50%, rgba(59,130,246,0.07), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <h2
          style={{
            fontSize: "clamp(38px, 5vw, 64px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: 0.95,
            marginBottom: 24,
          }}
        >
          {[
            { text: "YOUR WEBSITE.", outline: false },
            { text: "YOUR ADS.",     outline: true  },
            { text: "YOUR REVIEWS.", outline: false },
            { text: "ALL HANDLED.", outline: false, accent: true },
          ].map((line, i) => (
            <div key={i} style={{ overflow: "hidden", display: "block" }}>
              <motion.span
                style={{
                  display: "block",
                  ...(line.outline ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.22)" } : {}),
                  ...(line.accent ? { color: "var(--accent)" } : {}),
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
                custom={i}
              >
                {line.text}
              </motion.span>
            </div>
          ))}
        </h2>

        <motion.p
          className="text-[13px] leading-[1.65] max-w-[440px] mb-7"
          style={{ color: "var(--muted)" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          custom={4}
        >
          One system.{" "}
          <strong style={{ color: "var(--text)" }}>Everything your business needs online</strong>
          {" "}— built, managed, and grown. From $299/month.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-1.5 mb-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          custom={5}
        >
          {PILLS.map((pill) => (
            <span
              key={pill}
              className="text-[9px] uppercase tracking-[.1em] px-2.5 py-1.5"
              style={{
                fontFamily: "var(--font-mono)",
                border: "1px solid rgba(59,130,246,0.35)",
                color: "#60a5fa",
                background: "rgba(59,130,246,0.06)",
              }}
            >
              {pill}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-3 flex-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          custom={6}
        >
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.1em] text-white transition-colors"
            style={{ background: "var(--accent)" }}
          >
            Get Started — It&apos;s Free →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.1em] transition-colors"
            style={{ border: "1px solid var(--border-mid)", color: "var(--muted)" }}
          >
            Talk to Us First
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 12.2: Commit**

```bash
git add apps/peakq/components/sections/final-cta.tsx
git commit -m "feat(peakq): final CTA rewrite — deliverables-first headline + pills"
```

---

## Task 13: Footer

**Files:**
- Modify: `apps/peakq/components/footer.tsx`

- [ ] **Step 13.1: Read the existing footer.tsx**

Check current structure, then update:
- Tagline to: `"Your website, ads, blog, and digital presence — handled."`
- Add `backdrop-filter: blur(12px)` + `background: rgba(5,5,7,0.6)` to root element
- Footer credit: `// Powered by Business AI OS`
- Keep existing 4-column grid structure

- [ ] **Step 13.2: Commit**

```bash
git add apps/peakq/components/footer.tsx
git commit -m "feat(peakq): footer — updated tagline + frosted glass"
```

---

## Task 14: Final Wiring + Polish

- [ ] **Step 14.1: Verify all section `id` props work**

Open http://localhost:4100, scroll through — confirm scroll dot nav tracks all 7 sections correctly.

- [ ] **Step 14.2: Test reduced motion**

Open DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Confirm:
- No clip-path animations
- No orb drift
- Progress bar stays static

- [ ] **Step 14.3: Test mobile (375px)**

Resize browser to 375px. Confirm:
- Scroll dot nav is hidden
- Hero headline is readable (clamp should handle it)
- Services grid collapses to 1 column
- Templates grid collapses to 2 columns
- No horizontal overflow

- [ ] **Step 14.4: Remove unused SectionDivider import**

The `section-divider.tsx` file can be left in place but confirm it is no longer imported anywhere in `app/page.tsx`.

- [ ] **Step 14.5: Final commit**

```bash
git add -A
git commit -m "feat(peakq): cinematic homepage redesign complete

- Brutalist editorial layout with clip-path word reveals
- Ethereal shadow ambient background (4 drifting orbs)
- Fixed scroll dot navigation + progress bar
- Deliverables-first messaging (websites/blogs/ads, AI secondary)
- New templates showcase section (industry tabs + filmstrip)
- Lucide SVG icons replacing all emojis
- Monochrome + single blue accent system"
```
