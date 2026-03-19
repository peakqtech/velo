# PeakQ Homepage — Cinematic Redesign Spec

**Date:** 2026-03-19
**Status:** Approved
**Scope:** `apps/peakq` — homepage only (`app/page.tsx` + all section components)

---

## 1. Goal

Transform the PeakQ homepage from its current dark-navy + basic Framer Motion state into a **cinematic, brutalist editorial website** with:

- Plain-language messaging that leads with deliverables (websites, blogs, ads) — not abstract AI
- Clip-path word-reveal animations (film-trailer style)
- Ethereal shadow ambient background (drifting glow orbs)
- Fixed right-side scroll dot navigation + top progress bar
- Templates/portfolio showcase section (new)
- Lucide SVG icons replacing all emoji icons
- Monochrome + single electric blue (`#3b82f6`) accent system

---

## 2. Design System

### 2.1 Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#050507` | Page background |
| `--bg-raised` | `#0d0d10` | Elevated surfaces (nav, browser chrome) |
| `--border` | `rgba(255,255,255,0.07)` | Default dividers and card borders |
| `--border-mid` | `rgba(255,255,255,0.12)` | Hover/active borders |
| `--text` | `#f0f0f0` | Primary text |
| `--muted` | `rgba(255,255,255,0.35)` | Secondary/body text |
| `--accent` | `#3b82f6` | Single color accent — CTAs, active dots, highlights |
| `--accent-dim` | `rgba(59,130,246,0.15)` | Subtle accent fills |

**Rule:** Blue appears only on CTAs, active states, eyebrow labels, stat units, and the `[HANDLED]` accent word. Everything else is black/white.

### 2.2 Typography

| Role | Style |
|---|---|
| Hero H1 | `clamp(48px,6.5vw,78px)` · weight 900 · uppercase · tracking `-.03em` · leading `.94` |
| Section H2 | `clamp(26px,3.2vw,40px)` · weight 900 · uppercase · tracking `-.03em` · leading `.96` |
| Body | `13px` · leading `1.7` · color `--muted` |
| Eyebrow | `9px` · mono · uppercase · tracking `.14em` · color `--accent` |
| Labels/tags | `8–10px` · mono · uppercase · tracking `.1em` |

**Outline style:** Alternate lines use hollow stroke text — `color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,0.32)` — for visual contrast and depth.

### 2.3 Grid / Spacing

- Max content width: `860px` centered, `border-left/right: 1px solid --border`
- Section padding: `56px 32px` (hero `72px 32px`)
- Internal grids use CSS Grid with `1px solid --border` gutters (no gap, borders form the grid lines)
- Spacing scale: 4px base, multiples of 4

### 2.4 Animation System

**Clip-path word reveals** (primary entrance animation):
```tsx
// Each headline line wraps in overflow:hidden, inner span animates translateY
const revealVariants = {
  hidden: { y: '106%' },
  visible: (i: number) => ({
    y: 0,
    transition: { duration: 0.75, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }
  })
}
```

**Expand line:**
```tsx
// Horizontal rule that scales from 0 → 1 on scaleX
transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
```

**Fade-up:** `opacity 0→1` + `translateY 10px→0` for body text and CTAs, staggered after headlines.

**Rules:**
- All animations triggered by `useInView` with `once: true, margin: "-80px"`
- `useReducedMotion()` disables all animations — static fallback
- Duration range: `0.6–0.75s` entrance, `0.15–0.25s` hover micro-interactions
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` throughout

---

## 3. New Architecture: Ethereal Background

A fixed, full-viewport ambient background layer rendered behind all content.

**Component:** `components/ethereal-background.tsx`

```
EtherealBackground (position:fixed, z-index:0, pointer-events:none)
  ├── Orb 1 — 600px deep blue, top-left, 22s loop
  ├── Orb 2 — 500px indigo, center-right, 28s loop
  ├── Orb 3 — 400px blue, bottom-center, 18s loop
  ├── Orb 4 — 300px purple, mid-right, 24s loop
  ├── Vignette overlay (darkens edges)
  └── Noise texture (4% opacity grain)
```

Each orb: `position:absolute`, `border-radius:50%`, `filter:blur(80px)`, animated with Framer Motion `animate` + `transition.repeat:Infinity` on `x`/`y`/`scale`.

All page sections use `background: transparent` or `rgba(5,5,7, 0.4–0.6)` with `backdrop-filter:blur(8–16px)` so orbs bleed through subtly.

---

## 4. New Architecture: Scroll Navigation

**Component:** `components/scroll-nav.tsx`

Fixed right-side dot navigation + top progress bar.

```
ScrollNav (position:fixed, right:24px, top:50%, z-index:200)
  ├── ScrollProgress bar (position:fixed, top:0, height:1px)
  └── For each section:
      ├── Label (hidden, appears on hover/active)
      └── Dot (6px → 8px + blue glow when active)
```

**Implementation:**
- `useScroll()` from Framer Motion → drives progress bar `scaleX`
- `useActiveSection(sectionIds)` custom hook using `IntersectionObserver` → sets active dot
- Dot click → smooth scroll via `element.scrollIntoView({ behavior: 'smooth' })`
- Follows the `story-dots` pattern from `packages/sections/brand-story`
- Hidden on mobile (`md:flex`)

**Sections tracked:** hero, services, templates, platform, how-it-works, results, cta

---

## 5. Homepage Sections (in order)

### 01 — Navigation (updated)
- Glassmorphism: `backdrop-filter:blur(16px)` + `background:rgba(5,5,7,0.88)`
- Sticky top, `z-index:100`
- Logo: `PEAKQ` monospace, weight 900, tracking `.16em`
- Links: Templates, Services, Pricing, About
- CTA button: `Get Started →` — bordered, accent color, fills on hover

### 02 — Hero (full rewrite)
**Messaging:**
```
WEBSITES. BLOGS.
ADS. CONTENT.        ← hollow stroke
ALL OF IT —
HANDLED.             ← accent blue
```
- Sub: *"Your website, blog, ads, and entire digital presence — built, managed, and grown by one system."*
- Deliverable pills: `Websites` `Blogs` `Ads` `Email` `Reviews` `Analytics` + *"Powered by Business AI OS"* in muted
- CTAs: `See What We Handle →` (primary blue) + `View Templates` (ghost)
- Blueprint grid overlay (`.018` opacity)
- `Scroll to explore` hint bottom-left
- `min-height: 88vh`

### 03 — Logo Marquee (unchanged structure, updated style)
- Frosted glass background `rgba(5,5,7,0.4)` with `backdrop-filter:blur(8px)`
- Client names in mono uppercase, opacity `.16`

### 04 — Stats (updated)
- 4-column ruled grid
- Stats: `200+ Active Clients` · `40+ Templates Ready` · `4.3× Average ROI` · `48h Time to Launch`
- Accent underline animates `scaleX(0→1)` on hover per cell

### 05 — Services / "What We Handle" (full rewrite)
**New section title:**
```
EVERYTHING YOUR
BUSINESS NEEDS    ← hollow stroke
ONLINE. DONE.
```
**Services (Lucide icons, no emoji):**
1. Website & Landing Pages
2. Blog & Content
3. Ads & Campaigns
4. Email & Follow-Ups
5. Reviews & Reputation
6. Analytics & Reporting

**AI footnote row** at bottom of grid:
`● All coordinated by our Business AI Operating System — replacing your agency, freelancer, and marketing stack.`

### 06 — Templates Showcase (NEW SECTION)
**Headline:**
```
40+ TEMPLATES.
YOUR INDUSTRY.   ← hollow stroke
YOUR BRAND.
```
- Industry filter tabs: All / Hospitality / Healthcare / Real Estate / Fitness / Restaurant
- Filmstrip: 4-column grid of template cards (mini site screenshot mockups)
- Each card: live demo badge, template name, industry tag, hover lift
- `+37 More` ghost card
- `Browse All 40+ Templates →` full-width button below

**Tab filtering:** client-side state, filters `TEMPLATES` array by industry. Animation: `AnimatePresence` with fade on tab switch.

### 07 — Platform Preview (updated)
**New headline:** `ONE SCREEN. / YOUR WHOLE / DIGITAL BUSINESS.`
- Browser chrome mockup: `app.peakq.tech/dashboard`
- Dashboard sidebar now shows: Overview, Website, Ads, Email, Reviews, Analytics (matches new service names)

### 08 — How It Works / Compounding Stack (updated)
**New headline:** `UP AND RUNNING / IN 48 HOURS.`
- 4-cell 2×2 grid (3 steps + ROI stat)
- Oversized hollow stroke step numbers (01, 02, 03)
- Accent bar sweeps top on hover

### 09 — Testimonials (updated copy)
**New headline:** `REAL NUMBERS. / REAL CLIENTS.`
- Copy updated to reference concrete deliverables (website, email, stars, agency replacement)
- 2×2 ruled grid

### 10 — Final CTA (full rewrite)
**Headline:**
```
YOUR WEBSITE.
YOUR ADS.        ← hollow stroke
YOUR REVIEWS.
ALL HANDLED.     ← accent blue
```
- Deliverable pills row repeated
- CTAs: `Get Started — It's Free →` + `Talk to Us First`
- Radial blue glow `rgba(59,130,246,0.07)` behind

### 11 — Footer (updated)
- Tagline: *"Your website, ads, blog, and digital presence — handled."*
- 4-column: Brand / Services / Company / Legal
- Frosted: `backdrop-filter:blur(12px)`
- Footer credit: `// Powered by Business AI OS`

---

## 6. CSS Token Migration

`app/globals.css` currently defines a different token set. **Replace all existing tokens** with the new set below — do not alias. All existing section components reference inline `rgba()` values directly (not CSS vars), so there is no cascade breakage risk.

**Replace the `:root` block in `globals.css` with:**
```css
:root {
  --bg:          #050507;
  --bg-raised:   #0d0d10;
  --border:      rgba(255,255,255,0.07);
  --border-mid:  rgba(255,255,255,0.12);
  --text:        #f0f0f0;
  --muted:       rgba(255,255,255,0.35);
  --accent:      #3b82f6;
  --accent-dim:  rgba(59,130,246,0.15);
}
```
Remove: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--border-subtle`, `--border-blue`, `--accent-blue`, `--accent-blue-light`, `--accent-blue-muted`, `--text-primary`, `--text-muted`, `--text-dim`.

**Hollow stroke utility class** — add to `globals.css`:
```css
.text-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255,255,255,0.32);
}
.text-outline-thin {
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.28);
}
```

---

## 6b. Updated `app/page.tsx` Structure

```tsx
import { EtherealBackground } from "@/components/ethereal-background";
import { ScrollNav } from "@/components/scroll-nav";
// ... all section imports

const SECTIONS = [
  { id: "hero",      label: "Hero" },
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

Each section component accepts an optional `id?: string` prop and spreads it onto its root `<section>` element. `SectionDivider` components are removed — replaced by the scroll nav.

---

## 6c. Templates Data Structure

Define in `components/sections/templates-showcase.tsx`:

```ts
interface Template {
  id: string;
  name: string;
  industry: "Hospitality" | "Healthcare" | "Real Estate" | "Fitness" | "Restaurant" | "Other";
  accentColor: string;        // hex, used for the mini CTA button color
  demoUrl?: string;           // links to live demo page
  screenshot?: string;        // optional real image path, falls back to generated mockup
}

const TEMPLATES: Template[] = [
  { id: "hotel-pro",    name: "Hotel Pro",    industry: "Hospitality", accentColor: "#3b82f6" },
  { id: "clinic-suite", name: "Clinic Suite", industry: "Healthcare",  accentColor: "#8b5cf6" },
  { id: "realtor-os",   name: "Realtor OS",   industry: "Real Estate", accentColor: "#10b981" },
  { id: "fitness-co",   name: "Fitness Co",   industry: "Fitness",     accentColor: "#f59e0b" },
  { id: "restaurant",   name: "The Table",    industry: "Restaurant",  accentColor: "#ef4444" },
  // ... additional templates
];
```

**Screenshot fallback:** If `screenshot` is undefined, render a generated CSS mockup (nav bar + headline blocks + CTA button in `accentColor`) — same mini-site style shown in the mockup.

**Filter logic:** `selectedIndustry === "All" ? TEMPLATES : TEMPLATES.filter(t => t.industry === selectedIndustry)`

**Animation on tab switch:** `AnimatePresence` with `mode="wait"` — grid fades out then new cards fade in.

---

## 6d. Nav Links

Nav renders 4 links: **Templates, Services, Pricing, About** — removing "Features" from the current hero.tsx list.

---

## 6e. Noise Texture for EtherealBackground

Use an inline SVG data URI for the noise — no static asset required:

```tsx
// In EtherealBackground component:
<div
  className="absolute inset-0 opacity-[0.04] pointer-events-none"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }}
/>
```

---

## 7. Files to Create

| File | Purpose |
|---|---|
| `components/ethereal-background.tsx` | Fixed ambient glow background |
| `components/scroll-nav.tsx` | Fixed dot navigation + progress bar |
| `hooks/use-active-section.ts` | IntersectionObserver hook for active dot |

## 7. Files to Modify

| File | Change |
|---|---|
| `app/page.tsx` | Add `EtherealBackground`, `ScrollNav`, new section order with IDs |
| `components/sections/hero.tsx` | Full rewrite — new messaging, layout, animations |
| `components/sections/services-preview.tsx` | Rename → "What We Handle", Lucide icons, AI footnote |
| `components/sections/stats.tsx` | Update stat: "Templates Ready" replaces one stat |
| `components/sections/platform-preview.tsx` | Updated headline + sidebar labels |
| `components/sections/compounding-stack.tsx` | New headline + updated copy |
| `components/sections/testimonials.tsx` | Updated headline + copy |
| `components/sections/final-cta.tsx` | Full rewrite — new headline + pills |
| `components/footer.tsx` | Updated tagline + frosted glass |
| `app/globals.css` | Updated CSS tokens |

## 8. Files to Create (Sections)

| File | Purpose |
|---|---|
| `components/sections/templates-showcase.tsx` | New templates section (tabs + filmstrip) |

---

## 9. Dependencies

All already installed in `apps/peakq/package.json`:
- `framer-motion ^12` — clip-path reveals, orb animation, scroll progress
- `lucide-react ^0.500` — SVG icons replacing emojis
- No new packages required

---

## 10. Accessibility & Performance

- `useReducedMotion()` disables all animations (clip-path reveals, orb drift, progress bar)
- All Lucide icons have `aria-hidden="true"` with adjacent text labels
- Scroll nav has `aria-label="Section navigation"` and keyboard-accessible dots
- `backdrop-filter` degrades gracefully — no content lost without it
- Template cards have descriptive `alt` text on live screenshots
- Contrast: all text meets WCAG AA (white on dark `#050507`)
