# PeakQ GSAP Premium Animation Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate GSAP premium animations (SplitText, ScrollTrigger, ScrollSmoother, ScrambleText, DrawSVG, Flip) into all 10 PeakQ homepage sections, replacing Framer Motion per-section.

**Architecture:** Layer GSAP on top of existing FM, migrating section-by-section. Each section becomes a self-contained `"use client"` component using `useGSAP` with scoped cleanup. ScrollSmoother wraps the layout for global smooth scrolling. FM code is removed from each section as GSAP replaces it.

**Tech Stack:** GSAP 3.x, @gsap/react, Next.js 16 App Router, React 19, Tailwind 4

**Spec:** `docs/superpowers/specs/2026-03-21-peakq-gsap-premium-animations-design.md`

**GSAP Skills:** `gsap-animation`, `gsap-scroll-effects`, `gsap-text-effects` (personal skills at `~/.claude/skills/`)

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `apps/peakq/lib/gsap-setup.ts` | Module-level GSAP plugin registration (SSR-guarded) |
| `apps/peakq/components/smooth-scroll-provider.tsx` | ScrollSmoother initialization component |

### Modified Files
| File | Changes |
|------|---------|
| `apps/peakq/app/layout.tsx` | Add `#smooth-wrapper` / `#smooth-content` structure, import SmoothScrollProvider |
| `apps/peakq/app/page.tsx` | No changes needed (sections handle their own GSAP) |
| `apps/peakq/components/sections/hero.tsx` | Replace FM with GSAP SplitText + DrawSVG + ScrollTrigger pin |
| `apps/peakq/components/sections/logo-marquee.tsx` | Replace CSS marquee with GSAP infinite scroll |
| `apps/peakq/components/sections/stats.tsx` | Replace FM with GSAP ScrambleText counters |
| `apps/peakq/components/sections/services-preview.tsx` | Replace FM with ScrollTrigger.batch() |
| `apps/peakq/components/sections/templates-showcase.tsx` | Replace FM AnimatePresence with Flip |
| `apps/peakq/components/sections/compounding-stack.tsx` | Replace FM with ScrollTrigger pin/scrub/snap |
| `apps/peakq/components/sections/testimonials.tsx` | Replace FM with batch + SplitText quotes |
| `apps/peakq/components/sections/platform-preview.tsx` | Replace FM with ScrollTrigger + parallax |
| `apps/peakq/components/sections/final-cta.tsx` | Replace FM with SplitText + parallax |
| `apps/peakq/components/section-divider.tsx` | Add DrawSVG on gradient line |
| `apps/peakq/app/globals.css` | Remove `@keyframes marquee` |
| `apps/peakq/package.json` | Add gsap, @gsap/react deps |

---

## Task 1: Install Dependencies & Create GSAP Setup Module

**Files:**
- Modify: `apps/peakq/package.json`
- Create: `apps/peakq/lib/gsap-setup.ts`

- [ ] **Step 1: Install GSAP and React hook**

```bash
cd apps/peakq && npm install gsap @gsap/react
```

- [ ] **Step 2: Create GSAP plugin registration module**

Create `apps/peakq/lib/gsap-setup.ts`:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    Flip,
    Observer
  );
}

// Export to prevent tree-shaking from eliminating this side-effect module
export const gsapReady = true;
```

Note: No `"use client"` directive — this is a utility module, not a component. The `typeof window` guard handles SSR safety.

- [ ] **Step 3: Verify the app still builds**

```bash
cd apps/peakq && npx next build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/package.json apps/peakq/package-lock.json apps/peakq/lib/gsap-setup.ts
git commit -m "feat(peakq): install gsap and create plugin registration module"
```

---

## Task 2: ScrollSmoother Layout + Provider

**Files:**
- Create: `apps/peakq/components/smooth-scroll-provider.tsx`
- Modify: `apps/peakq/app/layout.tsx`

- [ ] **Step 1: Create SmoothScrollProvider component**

Create `apps/peakq/components/smooth-scroll-provider.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import "@/lib/gsap-setup";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Configure ScrollTrigger for mobile
    ScrollTrigger.config({ ignoreMobileResize: true });

    ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: 1.5,
      effects: true,
    });
  }, { scope: wrapperRef });

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update root layout to use ScrollSmoother structure**

Modify `apps/peakq/app/layout.tsx` — wrap `{children}` in SmoothScrollProvider. **Important**: The ScrollNav (navbar) is rendered inside `page.tsx` as a fixed-position element. Since it uses `position: fixed` with a high z-index, it will stay visually fixed even inside `#smooth-wrapper`. If issues arise, move ScrollNav to layout.tsx outside SmoothScrollProvider as a follow-up.

```tsx
import type { Metadata } from "next";
import { Inter, Bebas_Neue, Space_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html
      lang="en"
      className={`dark ${inter.variable} ${bebasNeue.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[var(--bg-base)] text-white antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Run dev server and verify smooth scrolling works**

```bash
cd apps/peakq && npx next dev
```

Open http://localhost:3000 — page should scroll with smooth momentum. All existing content should render correctly. Check that the fixed navbar still works.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/smooth-scroll-provider.tsx apps/peakq/app/layout.tsx
git commit -m "feat(peakq): add ScrollSmoother provider with smooth page scrolling"
```

---

## Task 3: Hero — SplitText + DrawSVG + ScrollTrigger Pin

**Files:**
- Modify: `apps/peakq/components/sections/hero.tsx`

This is the most complex section. Read the full current `hero.tsx` before implementing.

- [ ] **Step 1: Read the full current hero.tsx**

Read `apps/peakq/components/sections/hero.tsx` completely to understand the current FM animation structure, SVG badge, headline layout, and all motion.div wrappers.

- [ ] **Step 2: Rewrite hero.tsx with GSAP**

Replace all Framer Motion imports and `motion.div` wrappers with GSAP animations:

Key changes:
- Remove: `import { motion, useReducedMotion } from "framer-motion"` and all FM variant imports
- Remove: All `motion.div`, `motion.span`, `motion.p` wrappers — replace with plain HTML elements
- Add: `import gsap from "gsap"`, `import { useGSAP } from "@gsap/react"`, `import { SplitText } from "gsap/SplitText"`, `import { ScrollTrigger } from "gsap/ScrollTrigger"`, `import "@/lib/gsap-setup"`
- Add: `useRef` for container scoping
- Add: `useGSAP()` block with:

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Wait for fonts before SplitText
    document.fonts.ready.then(() => {

      // Set aria-label before splitting for accessibility
      const headingEl = containerRef.current!.querySelector(".hero-headline");
      if (headingEl) {
        headingEl.setAttribute("aria-label", headingEl.textContent || "");
      }

      const split = new SplitText(".hero-headline", { type: "chars,words" });

      const tl = gsap.timeline();

      // 1. Headline chars reveal
      tl.from(split.chars, {
        y: 80,
        opacity: 0,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
      // 2. Subheadline + pills
      .from(".hero-sub", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
      .from(".hero-pill", { y: 20, opacity: 0, stagger: 0.05, duration: 0.4 }, "-=0.4")
      // 3. CTA
      .from(".hero-cta", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
      // 4. Badge SVG arcs — draw then rotate
      .from(".hero-arc", { drawSVG: 0, duration: 2, stagger: 0.3 }, 0)
      .to(".hero-badge-rotate", { rotation: 360, duration: 20, repeat: -1, ease: "none" }, "-=1");

      // SplitText resize handler — revert and re-split on window resize
      ScrollTrigger.addEventListener("refreshInit", () => {
        split.revert();
        // Re-create split after revert
        const newSplit = new SplitText(".hero-headline", { type: "chars,words" });
        gsap.set(newSplit.chars, { clearProps: "all" }); // show all chars after resize
      });

      // Scroll hint bounce
      gsap.to(".scroll-hint", {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // ScrollTrigger pin — hero pins and fades on scroll
    gsap.to(".hero-content", {
      scale: 0.95,
      opacity: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=800",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".hero-headline, .hero-sub, .hero-pill, .hero-cta, .hero-arc", {
      clearProps: "all",
    });
  });
}, { scope: containerRef });
```

- Add CSS classes: `hero-headline`, `hero-sub`, `hero-pill`, `hero-cta`, `hero-arc`, `hero-badge-rotate`, `hero-content`, `scroll-hint` to corresponding elements (replacing motion.div wrappers).

- [ ] **Step 3: Test in browser**

```bash
cd apps/peakq && npx next dev
```

Verify:
- Headline animates char-by-char on load
- SVG arcs draw themselves then rotate
- Sub-headline, pills, CTA sequence in after headline
- Scroll hint bounces
- Scrolling down pins the hero and fades it out
- Test with DevTools → Rendering → Emulate prefers-reduced-motion: reduce

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/hero.tsx
git commit -m "feat(peakq): hero section — SplitText chars, DrawSVG arcs, ScrollTrigger pin"
```

---

## Task 4: Logo Marquee — GSAP Infinite Scroll

> **Note**: Tasks 4 and 5 are independent and can be done in either order. Spec recommends Stats first (tests ScrambleText plugin early), but there is no hard dependency.

**Files:**
- Modify: `apps/peakq/components/sections/logo-marquee.tsx`
- Modify: `apps/peakq/app/globals.css` (remove `@keyframes marquee`)

- [ ] **Step 1: Rewrite logo-marquee.tsx with GSAP**

Convert from server component to client component. Replace CSS animation with GSAP:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "@/lib/gsap-setup";

const CLIENTS = [
  "APEX DENTAL", "NOVA REALTY", "KLEO FITNESS", "BLOOM HOSPITALITY",
  "SUMMIT LEGAL", "CREST CLINICS", "PEAK EVENTS", "HARBOR STAYS",
];

export function LogoMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Duplicate for seamless loop
  const items = [...CLIENTS, ...CLIENTS];

  useGSAP(() => {
    const track = trackRef.current!;
    const width = track.scrollWidth / 2;
    const speed = 50; // px per second

    tweenRef.current = gsap.to(track, {
      x: -width,
      duration: width / speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(gsap.utils.wrap(-width, 0)),
      },
    });
  }, { scope: containerRef });

  const handleMouseEnter = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5 });
  };
  const handleMouseLeave = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden py-6"
      style={{
        borderTop: "1px solid rgba(59,130,246,0.12)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
        background: "rgba(5,5,7,0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p
        className="text-center mb-4 text-[10px] uppercase tracking-[0.15em]"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.25)" }}
      >
        Trusted by businesses across 12+ industries
      </p>
      <div className="flex overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-16 whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {items.map((name, i) => (
            <span
              key={`${i}-${name}`}
              className="text-sm tracking-[0.1em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.16)", textTransform: "uppercase" }}
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

- [ ] **Step 2: Remove CSS marquee keyframe from globals.css**

In `apps/peakq/app/globals.css`, remove the `@keyframes marquee` block.

- [ ] **Step 3: Test in browser**

Verify: Marquee scrolls smoothly, pauses on hover with smooth deceleration, resumes on mouse leave.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/logo-marquee.tsx apps/peakq/app/globals.css
git commit -m "feat(peakq): logo marquee — GSAP infinite scroll with hover pause"
```

---

## Task 5: Stats — ScrambleText Counters

**Files:**
- Modify: `apps/peakq/components/sections/stats.tsx`

- [ ] **Step 1: Read the full current stats.tsx**

Read `apps/peakq/components/sections/stats.tsx` completely.

- [ ] **Step 2: Rewrite stats.tsx with GSAP ScrambleText**

Replace FM imports and motion wrappers:

Key changes:
- Remove: `framer-motion` imports, `motion.div`, `useInView`, `useReducedMotion`
- Add: `gsap`, `useGSAP`, `@/lib/gsap-setup`
- Add CSS classes: `stat-card`, `stat-value`, `stat-unit`, `stat-sub` on elements
- GSAP animation:

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Set initial state
    gsap.set(".stat-card", { opacity: 0, y: 60 });

    // Cards fade in
    gsap.to(".stat-card", {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        once: true,
      },
    });

    // ScrambleText on each stat value, staggered
    const values = containerRef.current!.querySelectorAll(".stat-value");
    values.forEach((el, i) => {
      const finalText = el.textContent || "";
      gsap.from(el, {
        scrambleText: {
          text: finalText,
          chars: "0123456789.+×",
          revealDelay: 0.3,
          speed: 0.6,
        },
        duration: 1.5,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });
    });

    // Labels fade in after numbers
    gsap.from(".stat-unit", {
      y: 15,
      opacity: 0,
      stagger: 0.2,
      duration: 0.4,
      delay: 0.8,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        once: true,
      },
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".stat-card, .stat-unit", { clearProps: "all" });
  });
}, { scope: containerRef });
```

- [ ] **Step 3: Test in browser**

Scroll to stats section. Verify: cards fade up, numbers scramble from random digits to final values, labels fade in after.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/stats.tsx
git commit -m "feat(peakq): stats section — ScrambleText number counters on scroll"
```

---

## Task 6: Services Preview — ScrollTrigger Batch Reveal

**Files:**
- Modify: `apps/peakq/components/sections/services-preview.tsx`

- [ ] **Step 1: Read the full current services-preview.tsx**

Read `apps/peakq/components/sections/services-preview.tsx` completely.

- [ ] **Step 2: Rewrite with GSAP ScrollTrigger.batch()**

Replace FM with GSAP:
- Remove: `framer-motion` imports, all `motion.div` wrappers
- Add: `gsap`, `useGSAP`, `@/lib/gsap-setup`
- Add CSS class `service-card` on each card element
- Keep existing hover CSS transitions (no GSAP needed for hover)

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(".service-card", { opacity: 0, y: 80 });

    ScrollTrigger.batch(".service-card", {
      start: "top 85%",
      batchMax: 3,
      interval: 0.1,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      }),
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".service-card", { clearProps: "all" });
  });
}, { scope: containerRef });
```

- [ ] **Step 3: Test in browser**

Scroll to services. Verify: 6 cards stagger in from below in batches.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/services-preview.tsx
git commit -m "feat(peakq): services section — ScrollTrigger batch stagger reveal"
```

---

## Task 7: Compounding Stack — Pinned Scroll Storytelling

**Files:**
- Modify: `apps/peakq/components/sections/compounding-stack.tsx`

This is the most complex scroll section.

- [ ] **Step 1: Read the full current compounding-stack.tsx**

Read `apps/peakq/components/sections/compounding-stack.tsx` completely.

- [ ] **Step 2: Rewrite with ScrollTrigger pin/scrub/snap**

Replace FM with GSAP pinned storytelling:
- Remove: FM imports and motion wrappers
- Restructure layout: change from 2x2 grid to stacked steps that reveal one at a time during scroll
- Add progress indicator bar at top

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const steps = gsap.utils.toArray<HTMLElement>(".stack-step");

    // Initially hide all steps except visual placeholder
    gsap.set(steps, { opacity: 0, x: 60 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2500",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: "labels",
          duration: { min: 0.2, max: 1.5 },
          delay: 0.2,
          ease: "power1.inOut",
        },
        onUpdate: (self) => {
          // Update progress bar width
          const bar = containerRef.current?.querySelector(".stack-progress-fill");
          if (bar instanceof HTMLElement) {
            bar.style.width = `${self.progress * 100}%`;
          }
        },
      },
    });

    steps.forEach((step, i) => {
      const label = `step${i}`;
      tl.addLabel(label);

      // Dim previous step
      if (i > 0) {
        tl.to(steps[i - 1], { opacity: 0.3, duration: 0.3 }, label);
      }

      // Reveal current step
      tl.to(step, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, label);

      // ScrambleText on step number
      const numEl = step.querySelector(".step-number");
      if (numEl) {
        tl.from(numEl, {
          scrambleText: {
            text: numEl.textContent || "",
            chars: "number",
          },
          duration: 0.8,
        }, `${label}+=0.2`);
      }
    });

    tl.addLabel("end");
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".stack-step", { clearProps: "all" });
  });
}, { scope: containerRef });
```

- Add CSS classes: `stack-step` on each step card, `step-number` on number elements, `stack-progress-fill` on progress bar.
- Add a progress bar element at top of section: `<div className="stack-progress"><div className="stack-progress-fill" /></div>`

- [ ] **Step 3: Test in browser**

Scroll to "How It Works" section. Verify: section pins, steps reveal one at a time with scroll, numbers scramble, progress bar fills, snaps between steps.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/compounding-stack.tsx
git commit -m "feat(peakq): compounding stack — pinned scroll storytelling with snap"
```

---

## Task 8: Templates Showcase — Flip Filter Transitions

**Files:**
- Modify: `apps/peakq/components/sections/templates-showcase.tsx`

- [ ] **Step 1: Read the full current templates-showcase.tsx**

Read `apps/peakq/components/sections/templates-showcase.tsx` completely.

- [ ] **Step 2: Rewrite filter transitions with Flip**

Replace FM `AnimatePresence` with GSAP Flip:
- Remove: FM imports, `AnimatePresence`, `motion.div` with `layoutId`
- Add: `gsap`, `useGSAP`, `Flip` from `gsap/Flip`
- Keep the tab/filter UI, change the transition logic:

On filter click handler:
```tsx
const handleFilter = (category: string) => {
  const cards = containerRef.current!.querySelectorAll(".template-card");
  const state = Flip.getState(cards);

  // Toggle visibility based on filter
  cards.forEach((card) => {
    const el = card as HTMLElement;
    if (category === "all" || el.dataset.category?.includes(category)) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  Flip.from(state, {
    duration: 0.7,
    ease: "power2.inOut",
    scale: true,
    absolute: true,
    stagger: 0.04,
    onEnter: (elements) =>
      gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 }),
    onLeave: (elements) =>
      gsap.to(elements, { opacity: 0, scale: 0, duration: 0.3 }),
  });
};
```

- Add scroll entrance via ScrollTrigger.batch() for initial card reveal
- Add CSS classes: `template-card` and `data-category` attribute on each card

- [ ] **Step 3: Test in browser**

Click different filter tabs. Verify: cards animate smoothly between layouts, entering cards scale in, leaving cards scale out.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/templates-showcase.tsx
git commit -m "feat(peakq): templates showcase — Flip layout transitions on filter"
```

---

## Task 9: Testimonials — Batch Reveal + SplitText Quotes

**Files:**
- Modify: `apps/peakq/components/sections/testimonials.tsx`

- [ ] **Step 1: Read the full current testimonials.tsx**

Read `apps/peakq/components/sections/testimonials.tsx` completely.

- [ ] **Step 2: Rewrite with GSAP batch + SplitText**

Replace FM with GSAP:

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(".testimonial-card", { opacity: 0, y: 80 });

    ScrollTrigger.batch(".testimonial-card", {
      start: "top 85%",
      interval: 0.1,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            // After cards enter, animate quote text word-by-word
            batch.forEach((card: Element) => {
              const quoteEl = card.querySelector(".testimonial-quote");
              if (quoteEl) {
                quoteEl.setAttribute("aria-label", quoteEl.textContent || "");
                const split = new SplitText(quoteEl, { type: "words" });
                gsap.from(split.words, {
                  opacity: 0,
                  y: 15,
                  stagger: 0.02,
                  duration: 0.4,
                  ease: "power2.out",
                });
              }
            });
          },
        });
      },
    });

    // ScrambleText on metric badges
    gsap.utils.toArray<HTMLElement>(".testimonial-metric").forEach((el, i) => {
      const finalText = el.textContent || "";
      gsap.from(el, {
        scrambleText: { text: finalText, chars: "0123456789+%×", speed: 0.6 },
        duration: 1.5,
        delay: i * 0.15,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".testimonial-card", { clearProps: "all" });
  });
}, { scope: containerRef });
```

- Add CSS classes: `testimonial-card`, `testimonial-quote`, `testimonial-metric`
- **SplitText resize**: Add `ScrollTrigger.addEventListener("refreshInit", ...)` handler to revert and re-split quote text on resize (same pattern as hero Task 3).

- [ ] **Step 3: Test in browser**

Verify: cards batch-stagger in, quote text appears word-by-word, metric numbers scramble.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/testimonials.tsx
git commit -m "feat(peakq): testimonials — batch reveal + SplitText quotes + ScrambleText metrics"
```

---

## Task 10: Final CTA — SplitText + Parallax

**Files:**
- Modify: `apps/peakq/components/sections/final-cta.tsx`

- [ ] **Step 1: Read the full current final-cta.tsx**

Read `apps/peakq/components/sections/final-cta.tsx` completely.

- [ ] **Step 2: Rewrite with GSAP SplitText + parallax**

Replace FM with GSAP:

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    document.fonts.ready.then(() => {
      const headingEl = containerRef.current!.querySelector(".cta-headline");
      if (headingEl) {
        headingEl.setAttribute("aria-label", headingEl.textContent || "");
        const split = new SplitText(headingEl, { type: "chars" });

        gsap.from(split.chars, {
          y: 60,
          opacity: 0,
          stagger: 0.02,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            once: true,
          },
        });
      }
    });

    // Deliverable pills stagger
    gsap.from(".cta-pill", {
      rotation: 5,
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
      },
    });

    // CTA button idle pulse
    gsap.to(".cta-button", {
      scale: 1.02,
      boxShadow: "0 0 30px rgba(59,130,246,0.3)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".cta-headline, .cta-pill", { clearProps: "all" });
  });
}, { scope: containerRef });
```

- Add `data-speed="0.8"` on the radial glow background div for ScrollSmoother parallax
- Add CSS classes: `cta-headline`, `cta-pill`, `cta-button`
- **SplitText resize**: Add `ScrollTrigger.addEventListener("refreshInit", ...)` handler to revert and re-split headline on resize (same pattern as hero Task 3).

- [ ] **Step 3: Test in browser**

Verify: headline chars reveal dramatically, pills stagger in with rotation, CTA button pulses, background glow has parallax depth.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/sections/final-cta.tsx
git commit -m "feat(peakq): final CTA — SplitText chars + pill stagger + parallax glow"
```

---

## Task 11: Platform Preview — ScrollTrigger + Parallax

**Files:**
- Modify: `apps/peakq/components/sections/platform-preview.tsx`

- [ ] **Step 1: Read the full current platform-preview.tsx**

Read `apps/peakq/components/sections/platform-preview.tsx` completely.

- [ ] **Step 2: Rewrite with GSAP ScrollTrigger**

Replace FM with simple GSAP scroll entrance + ScrollSmoother parallax:

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".platform-mockup", {
      y: 80,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        once: true,
      },
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".platform-mockup", { clearProps: "all" });
  });
}, { scope: containerRef });
```

- Add `data-speed="0.95"` on browser mockup div for subtle parallax
- Add CSS class `platform-mockup`

- [ ] **Step 3: Test and commit**

```bash
git add apps/peakq/components/sections/platform-preview.tsx
git commit -m "feat(peakq): platform preview — ScrollTrigger entrance + parallax"
```

---

## Task 12: Section Divider — DrawSVG Line

**Files:**
- Modify: `apps/peakq/components/section-divider.tsx`

- [ ] **Step 1: Add DrawSVG to the gradient line**

Convert to client component. Replace the gradient `div` line with an SVG `<line>` element animated with DrawSVG:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "@/lib/gsap-setup";

interface SectionDividerProps {
  number: string;
  label: string;
}

export function SectionDivider({ number, label }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".divider-line", {
      drawSVG: 0,
      duration: 1.2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
        once: true,
      },
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="w-full px-4 md:px-8 py-3 flex items-center gap-4"
      style={{
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: "rgba(59,130,246,0.2)",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "rgba(59,130,246,0.08)",
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
    >
      <span className="text-[10px] tracking-[0.15em]" style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}>
        {number}
      </span>
      <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.25)" }}>
        ·
      </span>
      <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)" }}>
        {label}
      </span>
      <svg className="flex-1 h-px ml-2" preserveAspectRatio="none" viewBox="0 0 100 1">
        <line
          className="divider-line"
          x1="0" y1="0.5" x2="100" y2="0.5"
          stroke="rgba(59,130,246,0.15)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Test and commit**

```bash
git add apps/peakq/components/section-divider.tsx
git commit -m "feat(peakq): section divider — DrawSVG line animation on scroll"
```

---

## Task 13: Cleanup — Remove Unused FM Imports

**Files:**
- Modify: `apps/peakq/lib/animation-variants.ts`
- Check: All section files for remaining FM imports

- [ ] **Step 1: Check which files still import framer-motion**

```bash
cd apps/peakq && grep -r "from \"framer-motion\"" components/sections/ --files-with-matches
```

If any section files still import FM, they were missed — fix them.

- [ ] **Step 2: Check if animation-variants.ts is still imported anywhere**

```bash
cd apps/peakq && grep -r "animation-variants" --include="*.tsx" --include="*.ts" --files-with-matches
```

If no files import it, delete `apps/peakq/lib/animation-variants.ts`.

- [ ] **Step 3: Verify the full build passes**

```bash
cd apps/peakq && npx next build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Final commit**

```bash
git add -A apps/peakq/
git commit -m "chore(peakq): remove unused Framer Motion animation variants"
```

---

## Task 14: Full Integration Test

- [ ] **Step 1: Run dev server and test all sections end-to-end**

```bash
cd apps/peakq && npx next dev
```

Test checklist:
- [ ] Hero: chars animate, arcs draw, pin/scrub works, scroll hint bounces
- [ ] Logo Marquee: smooth scroll, hover pauses
- [ ] Stats: cards fade in, numbers scramble
- [ ] Services: batch stagger reveal
- [ ] Templates: Flip transitions on filter click
- [ ] Platform: scroll entrance + parallax
- [ ] Compounding Stack: pin, scrub, snap between 4 steps, progress bar
- [ ] Testimonials: batch reveal, word-by-word quotes, metric scramble
- [ ] Final CTA: char reveal, pill stagger, button pulse, glow parallax
- [ ] Section Dividers: DrawSVG line animation
- [ ] ScrollSmoother: entire page has smooth momentum scrolling
- [ ] Reduced Motion: all animations skip when prefers-reduced-motion is set
- [ ] Mobile: no pin stutter, no address bar jitter

- [ ] **Step 2: Fix any issues found**

- [ ] **Step 3: Final commit if fixes needed**

```bash
git add -A apps/peakq/
git commit -m "fix(peakq): polish GSAP animation integration"
```
