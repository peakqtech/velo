# PeakQ Homepage Redesign — Design Spec
**Date:** 2026-03-18
**Scope:** Homepage only (`apps/peakq/app/page.tsx` and related section components)
**Stack:** Next.js 15 · Tailwind CSS v4 · Framer Motion · TypeScript

---

## Overview

Redesign PeakQ's homepage from a generic dark SaaS template to a distinctive, conversion-focused site that serves as a live proof of the platform's capabilities. Design direction: **Bold Tech Precision** — deep navy, electric blue accent, condensed bold headings (Impact/Bebas Neue class), mono labels, immersive full-bleed hero.

The page follows a deliberate storytelling arc:
**Promise → Credibility → Product → How It Works → Evidence → Decision**

---

## Design System

### Colors
```css
--bg-base: #020a1a;          /* page background */
--bg-surface: #050d1f;       /* card/section backgrounds */
--bg-elevated: #030d20;      /* slightly elevated surfaces */
--border-subtle: rgba(255,255,255,0.06);
--border-blue: rgba(59,130,246,0.2);
--accent-blue: #3b82f6;      /* primary accent — replaces green */
--accent-blue-light: #60a5fa;
--accent-blue-muted: rgba(59,130,246,0.1);
--text-primary: #ffffff;
--text-muted: rgba(255,255,255,0.45);
--text-dim: rgba(255,255,255,0.25);
```

### Typography

**Font loading** — add to `app/layout.tsx` via `next/font/google`:
```tsx
import { Bebas_Neue, Space_Mono } from 'next/font/google'
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const spaceMono = Space_Mono({ weight: ['400','700'], subsets: ['latin'], variable: '--font-mono' })
// Apply both variables to <html> element className
```
- **Display headings (H1, H2):** `var(--font-display)` (Bebas Neue) — uppercase, tight letter-spacing (-0.01 to -0.02em). Size: `clamp(56px, 8vw, 96px)` for H1, `clamp(36px, 4vw, 52px)` for H2. Impact is a fallback only — Bebas Neue is the primary display font.
- **Labels / eyebrows / nav:** `var(--font-mono)` (Space Mono) — uppercase, `letter-spacing: 0.1–0.15em`, 10–12px
- **Body / descriptions:** System UI sans-serif, 14–16px, `line-height: 1.6–1.65`, `color: rgba(255,255,255,0.45)`

### Accessibility
All animated components must respect `prefers-reduced-motion`. Use Framer Motion's `useReducedMotion()` hook and skip or minimise all transforms/animations when it returns `true`. The CSS marquee keyframe must also be wrapped:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### Client Components
Every section that uses Framer Motion (`motion.*`, `useScroll`, `useInView`, `useTransform`, `animate`) **must** have `"use client"` as its first line. This applies to: `hero.tsx`, `stats.tsx`, `services-preview.tsx`, `platform-preview.tsx`, `compounding-stack.tsx`, `testimonials.tsx`, `final-cta.tsx`. The `logo-marquee.tsx` uses CSS-only animation and can remain a server component.

### Motion Tokens
- Hover lift: `scale(1.02) translateY(-3px)`, 150ms easeOut
- Scroll reveal: `opacity 0 → 1, translateY 24px → 0`, 600ms easeOut
- Stagger delay: 80–100ms between children
- Count-up: 0 → final value, 1200ms easeOut
- CTA pulse: `boxShadow` glow cycle, 2s, repeat with 4s delay
- Marquee: `translateX 0% → -50%`, 25s linear infinite

---

## Page Sections

### ① Hero — Full-Bleed Immersive
**File:** `components/sections/hero.tsx` (rewrite)

**Layout:** Full viewport height. Abstract AI neural network SVG fills entire background. Floating navigation. Content centered vertically and horizontally.

**Background:**
- Base: `linear-gradient(135deg, #020a1a 0%, #050f2e 40%, #020a1a 100%)`
- Grid overlay: `background-image: linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px)` at 40px spacing
- Radial glow: centered, `rgba(59,130,246,0.12)`, 600×400px ellipse
- Neural network: inline SVG, `opacity: 0.18`, `viewBox="0 0 1200 700"`, `preserveAspectRatio="xMidYMid slice"`, positioned `absolute inset-0 w-full h-full pointer-events-none`. Use the following node positions as a starting point (engineer can adjust density):
  - Nodes (cx, cy, r): (80,120,3), (200,60,2), (350,180,3), (150,300,2), (480,80,3), (600,150,4), (750,60,2), (900,120,3), (1050,80,2), (1150,200,3), (1100,350,2), (950,300,3), (800,380,2), (650,420,4), (500,350,2), (300,450,3), (100,500,2), (250,600,3), (450,580,2), (700,600,3), (900,550,2), (1100,600,3)
  - Edges: connect adjacent nodes with `<line>` elements, `stroke="#3b82f6"`, `stroke-width="0.5"`. A few dashed edges: `stroke-dasharray="4 4"` for depth.
  - Fill color: `#60a5fa` for larger nodes, `#93c5fd` for smaller nodes.

**Navigation (floating, `position: relative z-index: 10`):**
- Logo: `PEAKQ` in Space Mono, 18px, 700 weight, `letter-spacing: 0.12em`
- Links: Templates · Features · Pricing · Services · About — Space Mono, 11px, muted
- CTA: "Get Started" — outlined blue button, `border: 1px solid rgba(59,130,246,0.5)`
- **`components/navbar.tsx` is NOT used on the homepage.** The nav is rendered inline inside `hero.tsx` as a `<nav>` element. `navbar.tsx` remains for other pages. Remove the `<Navbar />` import from `page.tsx` when rewriting — it should not appear above or alongside the hero.

**Hero Content (centered column, `gap: 20px`):**
1. Eyebrow badge: pulsing dot + "AI-Powered Business Operating System" in mono — pill shape with blue border
2. H1: "YOUR INDUSTRY. / YOUR AI TEAM. / YOUR `[UNFAIR]` EDGE." — Impact, `clamp(56px,8vw,96px)`, word "UNFAIR" in `#3b82f6`
3. Subtext: 16px, muted, max-width 520px
4. CTAs: "Deploy Now →" (filled blue, box-shadow glow) + "View Pricing" (ghost blue)
5. Proof note: `// This site runs on our platform. You're looking at the product.` — mono, 11px, very dim

**Scroll indicator:** Centered bottom, animated vertical line + bouncing dot

**Animations (all Framer Motion):**
- Neural network nodes: stagger pulse animation on load (opacity 0.2 → 0.8 → 0.2, each node offset)
- Edge lines: SVG `stroke-dashoffset` draw animation on load, staggered
- Hero content: `variants` with `staggerChildren: 0.1` — each child fades up (y: 24 → 0, opacity: 0 → 1, 600ms easeOut)
- CTA primary button: `boxShadow` pulse after 2s delay, every 4s
- Scroll indicator dot: `translateY` bounce loop
- Neural BG nodes: subtle parallax on scroll (`useScroll` + `useTransform`, 0.1× speed)

---

### ② Logo Marquee
**File:** `components/sections/logo-marquee.tsx` (new)

**Layout:** Full width, `border-top + border-bottom: 1px solid rgba(59,130,246,0.12)`, `padding: 24px 0`

**Content:**
- Label above: "Trusted by businesses across 12+ industries" — mono, 10px, dim
- Marquee: Single row of client/industry names in Courier New, `letter-spacing: 0.1em`, grayscale/dim opacity
- Duplicate array for seamless infinite loop
- Names (placeholder, replace with real clients): `APEX DENTAL · NOVA REALTY · KLEO FITNESS · BLOOM HOSPITALITY · SUMMIT LEGAL · CREST CLINICS · PEAK EVENTS · HARBOR STAYS`

**Animation:** CSS `animation: marquee 25s linear infinite` — `translateX(0%) → translateX(-50%)`

---

### ③ Stats Row
**File:** `components/sections/stats.tsx` (new file — replaces `industry-showcase.tsx`)
**Migration note:** Delete `components/sections/industry-showcase.tsx`. Remove its import and usage from `page.tsx`. Replace with `<Stats />` from `stats.tsx`.

**Layout:** 4-column grid, `border-top + border-bottom: 1px solid rgba(59,130,246,0.12)`, each column separated by `border-right: 1px solid rgba(255,255,255,0.06)`

**Stats:**
| Number | Label |
|---|---|
| 50+ | Industry Templates |
| 3× | Faster Deployment |
| 98% | Client Retention Rate |
| $0 | Setup Cost — Ever |

**Typography:** Impact, 40px for number (white) + accent color for suffix (`+`, `×`, `%`), Courier New 10px for label

**Animation:** `useInView` trigger → count-up hook (0 → final, 1200ms easeOut). Each stat staggers 150ms.

---

### ④ Services Grid
**File:** `components/sections/services-preview.tsx` (rewrite)

**Layout:** Section padding 80px. Eyebrow + H2 above 3×2 card grid, 16px gap.

**H2:** "WE DON'T JUST BUILD / WEBSITES. WE BUILD / REVENUE MACHINES."

**Card anatomy:**
- Icon: 36px square, `background: rgba(59,130,246,0.1)`, blue border, emoji or SVG icon
- Service name: Impact, 20px, uppercase
- Description: 13px, muted, `line-height: 1.6`
- "Learn More →" link: Courier New, 10px, blue, `margin-top: auto`

**6 services:** AI Automation · Website Templates · Analytics & QA · Lead Capture · Reputation Engine · Custom Integrations

**Animation:** `whileInView` stagger — each card fades up with 80ms offset. Hover: `scale(1.02) y(-4px)`, border-color transitions to `rgba(59,130,246,0.3)`, background to `rgba(59,130,246,0.04)`.

---

### ⑤ Platform Preview
**File:** `components/sections/platform-preview.tsx` (new)

**Purpose:** Product demonstrates itself. A browser-chrome mockup of the PeakQ dashboard, slightly overflowing its container at the bottom edge on scroll-in (bleed effect).

**Layout:** Centered, max-width 900px. Section heading above: "SEE IT IN ACTION" (eyebrow) + "YOUR ENTIRE BUSINESS / FROM ONE DASHBOARD." (H2)

**Browser mockup:**
- Window chrome: 3 dot circles + URL bar showing `peakq.tech/dashboard`
- Dashboard interior: 3 KPI cards (Leads Today · Reviews · Automated %) + activity feed + mini chart
- Border: `1px solid rgba(59,130,246,0.25)` with subtle `box-shadow: 0 0 60px rgba(59,130,246,0.1)`

**Animation:**
- On scroll: `translateY(40px) → translateY(0)` + `opacity 0 → 1`, 700ms easeOut
- Border glow intensifies: `boxShadow` animates to `0 0 80px rgba(59,130,246,0.2)` on enter
- KPI numbers inside: count-up on scroll trigger

---

### ⑥ How It Works
**File:** `components/sections/compounding-stack.tsx` (rewrite)

**Layout:** 3 cards in a row. Eyebrow + H2 above.

**H2:** "EACH LAYER COMPOUNDS / THE ONE BELOW IT."

**Steps:** 01 → Pick Your Template · 02 → Deploy Your AI Team · 03 → Watch It Compound

**Each step card:** Numbered label (mono) + Impact title + description body

**Animation:** Sequential scroll-triggered reveal:
1. Step 1 fades in
2. Connector line between 1→2 draws (SVG `stroke-dashoffset`)
3. Step 2 fades in (300ms after step 1)
4. Connector line 2→3 draws
5. Step 3 fades in

---

### ⑦ Trust / Testimonials
**File:** `components/sections/testimonials.tsx` (new file)
**Migration note:** `pricing-preview.tsx` is kept as-is (used by the pricing page). Do NOT rename or delete it. Simply create a new `testimonials.tsx` file and replace `<PricingPreview />` in `page.tsx` with `<Testimonials />`.

**Layout:** Eyebrow + H2 left, prev/next buttons right (decorative only in this phase — no carousel logic). 3-column static testimonial grid below.

**H2:** "CONSISTENCY & RELIABILITY / DRIVE PARTNERSHIP."

**Each testimonial card:**
- Client name/logo (mono, uppercase)
- Quote in italic — **must contain a specific number** (e.g., "3× more reviews", "14 leads recovered", "200 monthly leads")
- Author avatar (gradient circle) + name + title

**Animation:** Cards fade in from right, staggered 120ms. On hover: client logo opacity 0.4 → 0.8.

---

### ⑧ Final CTA
**File:** `components/sections/final-cta.tsx` (rewrite)

**Layout:** Full width, centered text, 100px padding. Background: `linear-gradient(135deg, #020a1a, #050f2e, #020a1a)` + radial glow centered.

**H2:** "STOP HIRING. / START DEPLOYING."

**Body text with accent animation:**
```
AI-powered tools that [cost less than one employee] and [outperform an entire team].
```
- "cost less than one employee" — animated underline sweep (CSS `::after` width 0 → 100%) on scroll trigger, 600ms ease
- "outperform an entire team" — subtle text-shadow glow (`0 0 12px rgba(59,130,246,0.5)`) on trigger

**CTAs:** "Deploy Now — It's Free →" (filled) + "Talk to Us First" (ghost)

---

### ⑨ Footer
**File:** `components/footer.tsx` (minor update)

- Update logo to Courier New mono style
- Update accent color from green → blue
- 4-column grid: Brand + Platform + Company + Get In Touch
- Footer bottom bar: copyright + policy links, mono 10px

---

## File Changes Summary

### `app/page.tsx` — new section order
```tsx
import { Hero } from "@/components/sections/hero"
import { LogoMarquee } from "@/components/sections/logo-marquee"
import { Stats } from "@/components/sections/stats"
import { ServicesPreview } from "@/components/sections/services-preview"
import { PlatformPreview } from "@/components/sections/platform-preview"
import { CompoundingStack } from "@/components/sections/compounding-stack"
import { Testimonials } from "@/components/sections/testimonials"
import { FinalCta } from "@/components/sections/final-cta"
import { Footer } from "@/components/footer"
// DO NOT import Navbar — hero.tsx renders its own nav inline
// DO NOT import IndustryShowcase, PricingPreview — replaced by Stats and Testimonials
```

| File | Action |
|---|---|
| `app/layout.tsx` | Add Bebas Neue + Space Mono via `next/font/google`, apply CSS variables to `<html>` |
| `app/globals.css` | Replace green tokens with blue tokens; add `@keyframes marquee`, `@keyframes bounce`; add `prefers-reduced-motion` block |
| `app/page.tsx` | Full import list replacement per order above |
| `components/sections/hero.tsx` | Full rewrite (`"use client"`) |
| `components/sections/logo-marquee.tsx` | New file (server component, CSS animation only) |
| `components/sections/stats.tsx` | New file (`"use client"`, replaces industry-showcase.tsx) |
| `components/sections/industry-showcase.tsx` | **Delete** |
| `components/sections/services-preview.tsx` | Rewrite (`"use client"`) |
| `components/sections/platform-preview.tsx` | New file (`"use client"`) |
| `components/sections/compounding-stack.tsx` | Rewrite (`"use client"`) |
| `components/sections/testimonials.tsx` | New file (`"use client"`) |
| `components/sections/pricing-preview.tsx` | **Keep unchanged** (used by pricing page) |
| `components/sections/final-cta.tsx` | Rewrite (`"use client"`) |
| `components/footer.tsx` | Minor update: mono font, blue accent |
| `components/navbar.tsx` | **No change** — not used on homepage |

---

## Out of Scope
- Other pages (features, pricing, services, about, contact, blog, get-started, templates)
- Mobile responsive breakpoints (follow-up task)
- Real client data / actual dashboard screenshot (placeholders acceptable for now)
- Backend / API changes
