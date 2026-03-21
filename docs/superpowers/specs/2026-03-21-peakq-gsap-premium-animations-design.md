# PeakQ GSAP Premium Animation Integration — Design Spec

**Date**: 2026-03-21
**Status**: Approved
**Approach**: Section-by-section migration (Approach A) — layer GSAP on top of existing Framer Motion, replacing FM per-section as GSAP takes over.

---

## Overview

Integrate GSAP (now 100% free) into the PeakQ website to add premium animation effects that Framer Motion cannot achieve: SplitText character animations, ScrollTrigger pin/scrub, ScrollSmoother, ScrambleText, DrawSVG, and Flip layout transitions. Each section is upgraded independently, replacing its FM animations with GSAP equivalents.

## Goals

- Premium, cinematic animation quality across all 10 homepage sections
- Scroll-driven storytelling (pin, scrub, snap) for key sections
- Buttery smooth page scrolling via ScrollSmoother
- Maintain existing accessibility (prefers-reduced-motion support)
- Incremental migration — each section is a self-contained unit

## Non-Goals

- No new sections or content changes
- No redesign of visual style (dark theme, glassmorphism, brutalist borders stay)
- No removal of Framer Motion dependency until all sections are migrated

---

## Foundation

### Dependencies

```bash
npm install gsap @gsap/react
```

### Plugin Registration

Single module-level registration file (`hooks/use-gsap-setup.ts`):

```ts
"use client";
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
    ScrollTrigger, ScrollSmoother, SplitText,
    ScrambleTextPlugin, DrawSVGPlugin, Flip, Observer
  );
}

// Export to prevent tree-shaking from eliminating this side-effect module
export const gsapReady = true;
```

Every section component imports this file as a side-effect (`import "@/hooks/use-gsap-setup"`) and uses `useGSAP` from `@gsap/react` with `scope: containerRef` for automatic cleanup. The export ensures bundlers retain the module.

### ScrollSmoother Setup

Modify the root layout to wrap content in the required structure:

```
<body>
  <nav> (OUTSIDE smooth-wrapper — stays fixed) </nav>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      {children}
    </div>
  </div>
</body>
```

ScrollSmoother config:
- `smooth: 1.5`
- `effects: true` (enable `data-speed`/`data-lag` attributes)
- `ignoreMobileResize: true`
- **Note**: Do NOT use `normalizeScroll: true` on ScrollSmoother when pinned ScrollTrigger sections exist — they conflict and cause stutter/miscalculation. Instead, use `ScrollTrigger.config({ ignoreMobileResize: true })` separately. Test pinned sections on iOS Safari before sign-off.

Create as a client component (`SmoothScrollProvider`) rendered in the layout.

### Reduced Motion

Inside `useGSAP`, use `gsap.matchMedia()` with `(prefers-reduced-motion: reduce)` condition. When active, use `gsap.set()` for final states with no animation. Matches the existing `useReducedMotion()` pattern.

---

## Section Designs

### 1. Hero — SplitText + DrawSVG + ScrollTrigger Pin

**File**: `components/sections/hero.tsx`

**Entrance timeline** (on mount, after `document.fonts.ready`):
1. **Headline**: SplitText `type: "chars"` → `gsap.from(split.chars, { y: 80, opacity: 0, rotationX: -90, stagger: 0.02, duration: 0.6, ease: "back.out(1.7)" })`
2. **Badge SVG arcs**: DrawSVG `drawSVG: 0` → `"100%"` over 2s, then infinite rotation tween (`rotation: 360, duration: 8, repeat: -1, ease: "none"`)
3. **Subheadline + CTA**: Sequenced in timeline after headline — `y: 30, opacity: 0, duration: 0.6`
4. **Scroll hint**: GSAP `yoyo: true, repeat: -1` bounce

**Scroll-away** (ScrollTrigger):
- Pin hero at `"top top"`
- `end: "+=800"` (800px scroll travel)
- Scrubbed timeline: content fades out + scales down (`scale: 0.95, opacity: 0`)
- Creates parallax exit before next section arrives

**Remove**: All FM `motion.div` wrappers, `revealVariants`, `fadeUpVariants`, `useInView` from hero.

### 2. Logo Marquee — GSAP Infinite Scroll

**File**: `components/sections/logo-marquee.tsx`

- Replace CSS `@keyframes marquee` with GSAP `gsap.to()` using `modifiers` + `gsap.utils.wrap(-width, 0)` for seamless loop
- Duration calculated from `width / speed` for consistent velocity
- Hover: `timeScale(0)` with smooth deceleration, `timeScale(1)` on leave
- Remove `@keyframes marquee` from globals.css

### 3. Stats — ScrambleText Counters

**File**: `components/sections/stats.tsx`

- Cards enter with GSAP timeline: `y: 60, opacity: 0, stagger: 0.15`
- Each KPI number uses `scrambleText` with `chars: "number"`, triggered by ScrollTrigger `start: "top 75%"`, `once: true`
- Labels fade in after their number completes (`y: 20, opacity: 0`)
- Stagger `0.2s` between each number's scramble start

**Remove**: FM `fadeUpVariants` and viewport observer.

### 4. Services Preview — Batch Reveal

**File**: `components/sections/services-preview.tsx`

- `ScrollTrigger.batch()` on all 6 cards with `start: "top 85%"`, `batchMax: 3`
- Entrance via `onEnter` callback: `onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: { each: 0.12, from: "center", grid: "auto" }, overwrite: true })`
- Initial state set via `gsap.set(".card", { y: 80, opacity: 0 })`
- Hover effects: Keep as CSS transitions (no GSAP overhead needed)
- **Note**: Stagger config belongs inside the `onEnter` callback's `gsap.to()`, not as a top-level `batch()` parameter.

**Remove**: FM motion wrappers and `useInView`.

### 5. Templates Showcase — Flip Filter Transitions

**File**: `components/sections/templates-showcase.tsx`

- **Scroll entrance**: Tab bar enters first, then cards batch-reveal via `ScrollTrigger.batch()` with stagger
- **Filter transitions**: On tab click:
  1. `Flip.getState(cards)` — capture current layout
  2. Toggle visibility classes based on filter
  3. `Flip.from(state, { duration: 0.7, ease: "power2.inOut", scale: true, absolute: true, stagger: 0.04, onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }), onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0 }) })`

**Remove**: FM `AnimatePresence` and related motion components.

### 6. Compounding Stack — Pinned Scroll Storytelling

**File**: `components/sections/compounding-stack.tsx`

- **Pin**: ScrollTrigger pins section at `"top top"`, `end: "+=2500"`, `scrub: 1`
- **Timeline** (scrubbed):
  - Each of 4 steps enters sequentially: card slides in (`x: 60, opacity: 0`), number ScrambleText, description fades in
  - Previous step dims (`opacity: 0.4`) as next enters
  - Labels at each step for snap targets
- **Snap**: `snap: "labels"` with `duration: { min: 0.2, max: 1.5 }`
- **Progress indicator**: Horizontal line at top driven by `onUpdate: (self) => progress = self.progress`
- **Layout change**: Restructure from static 2x2 grid to sequential/stacked layout during pin

**Remove**: FM fade-ups. Section layout changes from grid to pinned storytelling.

### 7. Platform Preview — Parallax + Entrance

**File**: `components/sections/platform-preview.tsx`

- ScrollTrigger entrance: `y: 80, opacity: 0, duration: 0.8`
- Browser mockup gets `data-speed="0.95"` via ScrollSmoother for subtle parallax lag
- Keep existing visual design

**Remove**: FM viewport animation.

### 8. Testimonials — Batch Reveal + SplitText Quotes

**File**: `components/sections/testimonials.tsx`

- `ScrollTrigger.batch()` on 4 cards: `stagger: 0.15, from: "start"` (left-to-right, top-to-bottom)
- Quote text: SplitText `type: "words"`, `opacity: 0, y: 15, stagger: 0.02` — words appear after card enters
- Metric badges: ScrambleText on numbers (`chars: "number"`)

**Remove**: FM motion wrappers.

### 9. Final CTA — SplitText + Parallax

**File**: `components/sections/final-cta.tsx`

- Headline: SplitText char reveal with `ease: "expo.out"` (dramatic)
- Deliverable pills: `rotation: 5, y: 40, opacity: 0, stagger: 0.08`
- Radial glow background: `data-speed="0.8"` via ScrollSmoother (parallax depth)
- CTA button: Idle pulse `repeat: -1, yoyo: true, scale: 1.02` with subtle box-shadow cycle

**Remove**: FM `revealVariants` and `fadeUpVariants`.

### 10. Global — Decorative DrawSVG Lines

**File**: `components/section-divider.tsx` (existing)

- Any SVG section dividers or decorative lines: DrawSVG `drawSVG: 0` → `"100%"` triggered by ScrollTrigger on viewport enter
- Lightweight, adds polish between sections

---

## Migration Strategy

**Order of implementation** (dependency-driven):
1. Foundation (deps, plugin registration, ScrollSmoother layout)
2. Hero (highest impact, tests core GSAP + SplitText + ScrollTrigger)
3. Stats (tests ScrambleText)
4. Logo Marquee (isolated, simple)
5. Services Preview (tests batch reveal)
6. Compounding Stack (tests pin/scrub/snap — most complex)
7. Templates Showcase (tests Flip)
8. Testimonials (combines batch + SplitText)
9. Final CTA (combines SplitText + parallax)
10. Platform Preview (simple parallax)
11. Global decorative DrawSVG lines

Each section is a self-contained PR-able unit. FM code is removed from each section as GSAP replaces it.

## Technical Constraints

- All GSAP components must be `"use client"`
- Plugin registration at module level with `typeof window !== "undefined"` guard
- `useGSAP` with `scope: containerRef` for all section components
- SplitText must wait for `document.fonts.ready` before splitting
- SplitText instances must handle responsive resize: listen for `ScrollTrigger.addEventListener("refreshInit", ...)` to `split.revert()` then re-split, preventing broken character positions after window resize
- Fixed elements (navbar) must be OUTSIDE `#smooth-wrapper`
- ScrollSmoother created before any ScrollTriggers
- `anticipatePin: 1` on all pinned ScrollTriggers for mobile
- `invalidateOnRefresh: true` on scrub animations for resize handling
- Do NOT combine `ScrollSmoother.normalizeScroll` with pinned ScrollTrigger sections

## Bundle Impact

- GSAP core: ~24KB gzipped
- ScrollTrigger: ~10KB
- SplitText: ~5KB
- ScrollSmoother: ~4KB
- Other plugins: ~3KB each
- **Total: ~50KB gzipped** (acceptable for premium animation quality)
- Framer Motion (~30KB) will be gradually removed as sections migrate

## Accessibility

- All animations respect `prefers-reduced-motion` via `gsap.matchMedia()`
- SplitText accessibility: Manually set `aria-label` with the original text on the container element BEFORE calling `new SplitText()`. The split fragments text into individual spans which breaks screen reader flow — the `aria-label` preserves the readable text. Example: `el.setAttribute("aria-label", el.textContent); el.setAttribute("aria-hidden", "false");` then split children get `aria-hidden="true"`.
- ScrollTrigger pin sections remain keyboard-navigable
- No content is hidden behind scroll-only reveals — all content is in the DOM
