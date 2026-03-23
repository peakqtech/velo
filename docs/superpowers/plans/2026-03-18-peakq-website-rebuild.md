# PeakQ Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `apps/peakq/` as a new Next.js app in the velocity-template monorepo — the PeakQ.tech company website that runs on its own platform as living proof.

**Architecture:** A new Next.js app following the same patterns as existing template apps (e.g., `tropica-template`). PeakQ-specific sections live inside the app's `components/sections/` directory. The app consumes `@velo/` packages for SEO, forms, analytics, and shared motion components. A `templates.config.ts` provides metadata for the gallery page.

**Tech Stack:** Next.js 16+, React 19, Tailwind CSS v4 (CSS-based config), Framer Motion, @velo/motion-components, @velo/integration-forms, @velo/integration-analytics

**Note:** `@velo/seo-engine` is deferred to a later phase (it requires `@velo/db` + Prisma setup). For launch, SEO is handled via Next.js built-in `metadata` exports. `@velo/types` does not exist as a standalone package — use types from the packages that do exist, or define PeakQ-specific types locally.

**Note:** `framer-motion` and `lucide-react` are new additions not used in the reference `tropica-template` app. They are intentional for PeakQ's richer animations and iconography. Template iframe previews on the gallery page are deferred — gradient placeholders are used for launch.

**Spec:** `docs/superpowers/specs/2026-03-18-peakq-website-rebuild-design.md`

---

## File Structure

```
apps/peakq/
  app/
    layout.tsx                    # Root layout with metadata, fonts, nav
    page.tsx                      # Homepage — assembles all homepage sections
    globals.css                   # Tailwind config + PeakQ custom styles
    templates/
      page.tsx                    # Industry Solutions Gallery
    pricing/
      page.tsx                    # Full pricing detail page
    features/
      page.tsx                    # Platform capabilities deep dive
    services/
      page.tsx                    # Services overview
      [slug]/
        page.tsx                  # Individual service detail
    about/
      page.tsx                    # Company story + team
    contact/
      page.tsx                    # Contact form + book a demo
    blog/
      page.tsx                    # Coming Soon + email signup
    get-started/
      page.tsx                    # Lead capture form
  components/
    navbar.tsx                    # Site navigation
    footer.tsx                    # Site footer
    sections/
      hero.tsx                    # Homepage hero section
      industry-showcase.tsx       # Industry cards grid
      compounding-stack.tsx       # Revenue machines visual stack
      pricing-preview.tsx         # 4-tier pricing cards
      services-preview.tsx        # Secondary services strip
      final-cta.tsx               # Bottom CTA section
    template-card.tsx             # Reusable template gallery card
    template-filter.tsx           # Category filter pills
    template-gallery.tsx          # Client component: filter + grid wrapper
    pricing-card.tsx              # Reusable pricing tier card
    lead-capture-form.tsx         # Get-started form component
  lib/
    templates.config.ts           # Template metadata — single source of truth
    services.config.ts            # Services data
    constants.ts                  # Brand messaging, URLs, etc.
  next.config.ts                  # Next.js config (turbopack root)
  package.json                    # App dependencies
  tsconfig.json                   # TypeScript config with @/* alias
  template.json                   # App metadata for monorepo tooling
  postcss.config.mjs              # PostCSS config for Tailwind v4
```

---

## Task 1: Scaffold the App

**Files:**
- Create: `apps/peakq/package.json`
- Create: `apps/peakq/next.config.ts`
- Create: `apps/peakq/tsconfig.json`
- Create: `apps/peakq/template.json`
- Create: `apps/peakq/tailwind.config.ts`
- Create: `apps/peakq/app/globals.css`
- Create: `apps/peakq/app/layout.tsx`
- Create: `apps/peakq/app/page.tsx`

- [ ] **Step 1: Create `package.json`**

Follow the `tropica-template` pattern. Key dependencies:

Check the reference app `apps/tropica-template/package.json` for exact pinned version numbers and copy them. Use the same versions for `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `@types/react`, `@types/react-dom`, `@types/node`.

```json
{
  "name": "peakq",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 4100 --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "<pin from tropica>",
    "react": "<pin from tropica>",
    "react-dom": "<pin from tropica>",
    "framer-motion": "^12.0.0",
    "@velo/motion-components": "workspace:*",
    "@velo/animations": "workspace:*",
    "@velo/integration-forms": "workspace:*",
    "@velo/integration-analytics": "workspace:*",
    "lucide-react": "^0.500.0"
  },
  "devDependencies": {
    "typescript": "<pin from tropica>",
    "tailwindcss": "<pin from tropica>",
    "@tailwindcss/postcss": "<pin from tropica>",
    "@types/react": "<pin from tropica>",
    "@types/react-dom": "<pin from tropica>",
    "@types/node": "<pin from tropica>"
  }
}
```

Port 4100 avoids conflict with dashboard (4000). `framer-motion` and `lucide-react` are new additions (not in tropica) — use caret ranges for these only.

- [ ] **Step 2: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create `tsconfig.json`**

Copy from `apps/tropica-template/tsconfig.json` as the reference. Key things to verify:
- `"jsx": "react-jsx"` (NOT `"preserve"` — monorepo convention)
- `"paths": { "@/*": ["./*"] }` for local imports
- `"include"` must contain `".next/types/**/*.ts"` (for Next.js generated types)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create `template.json`**

```json
{
  "name": "peakq",
  "displayName": "PeakQ",
  "description": "AI-Powered Business Operating System — the PeakQ company website",
  "businessType": "SaaS / Technology Platform",
  "style": "Modern Dark Tech",
  "contentType": "PeakQContent",
  "features": ["industry-templates", "ai-seo", "lead-capture", "pricing-tiers"],
  "sections": {}
}
```

- [ ] **Step 5: Create `postcss.config.mjs`**

This monorepo uses Tailwind v4 with CSS-based config. No `tailwind.config.ts` file needed.

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Verify by checking if `apps/tropica-template/postcss.config.mjs` exists and matches this pattern.

- [ ] **Step 6: Create `app/globals.css`**

```css
@import "tailwindcss";
```

Add any PeakQ-specific CSS custom properties (colors, fonts) after the import. Follow the pattern from `tropica-template/app/globals.css`. No `tailwind.config.ts` file — Tailwind v4 uses CSS-based configuration.

- [ ] **Step 7: Create `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder `app/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">PeakQ — Coming Soon</h1>
    </main>
  );
}
```

- [ ] **Step 9: Install dependencies and verify dev server starts**

Run:
```bash
cd /Users/yohanesmarthinhutabarat/Personal/monorepo/velocity-template
pnpm install
pnpm --filter peakq dev
```

Expected: Dev server starts on `http://localhost:4100`, shows "PeakQ — Coming Soon".

- [ ] **Step 10: Commit**

```bash
git add apps/peakq/
git commit -m "feat(peakq): scaffold app — Next.js + Tailwind in monorepo"
```

---

## Task 2: Constants, Config & Shared Data

**Files:**
- Create: `apps/peakq/lib/constants.ts`
- Create: `apps/peakq/lib/templates.config.ts`
- Create: `apps/peakq/lib/services.config.ts`

- [ ] **Step 1: Create `lib/constants.ts`**

```ts
export const BRAND = {
  name: "PeakQ",
  domain: "peakq.tech",
  tagline: "AI-Powered Business Operating System",
  heroHeadline: "Your Industry. Your AI Team.\nYour Unfair Advantage.",
  heroSubtext:
    "An intelligent platform that understands how your industry works — from marketing to lead capture to reputation management. Not generic tools. Purpose-built for your business.",
  stackHeadline: "We Don't Just Build Websites.\nWe Build Revenue Machines.",
  stackSubtext:
    "Every layer compounds the one below it. Start simple. Scale when you're ready.",
  ctaHeadline: "Stop Hiring. Start Deploying.",
  ctaSubtext:
    "AI-powered tools that cost less than one employee and outperform an entire team.",
  subtleProof:
    "This site runs on our platform. You're looking at the product.",
} as const;

export const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
```

- [ ] **Step 2: Create `lib/templates.config.ts`**

```ts
export interface TemplateConfig {
  slug: string;
  name: string;
  industry: string;
  category: string;
  capabilities: string[];
  previewUrl: string;
  gradient: [string, string];
  icon: string;
}

export const TEMPLATE_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "food-hospitality", label: "Food & Hospitality" },
  { slug: "real-estate", label: "Real Estate" },
  { slug: "health-wellness", label: "Health & Wellness" },
  { slug: "professional-services", label: "Professional Services" },
  { slug: "e-commerce", label: "E-Commerce" },
  { slug: "creative", label: "Creative" },
] as const;

export const templates: TemplateConfig[] = [
  {
    slug: "tropica",
    name: "Tropica",
    industry: "Restaurant & Dining",
    category: "food-hospitality",
    capabilities: ["Menu SEO", "Online reservations", "Review management", "Food photography showcase"],
    previewUrl: "https://tropica-template.vercel.app",
    gradient: ["#f97316", "#dc2626"],
    icon: "🍽️",
  },
  {
    slug: "haven",
    name: "Haven",
    industry: "Real Estate",
    category: "real-estate",
    capabilities: ["Listing SEO", "Lead scoring", "Property showcase", "Market intelligence"],
    previewUrl: "https://haven-template.vercel.app",
    gradient: ["#3b82f6", "#1d4ed8"],
    icon: "🏠",
  },
  {
    slug: "serenity",
    name: "Serenity",
    industry: "Wellness & Spa",
    category: "health-wellness",
    capabilities: ["Booking AI", "Client retention", "Treatment upsells", "Wellness content"],
    previewUrl: "https://serenity-template.vercel.app",
    gradient: ["#ec4899", "#a855f7"],
    icon: "💆",
  },
  {
    slug: "medica",
    name: "Medica",
    industry: "Healthcare",
    category: "health-wellness",
    capabilities: ["Patient scheduling", "Compliance SEO", "Intake automation", "Provider profiles"],
    previewUrl: "https://medica-template.vercel.app",
    gradient: ["#14b8a6", "#0d9488"],
    icon: "🏥",
  },
  {
    slug: "commerce",
    name: "Commerce",
    industry: "E-Commerce",
    category: "e-commerce",
    capabilities: ["Product SEO", "Cart recovery", "Ad autopilot", "Inventory showcase"],
    previewUrl: "https://commerce-template.vercel.app",
    gradient: ["#f59e0b", "#d97706"],
    icon: "🛍️",
  },
  {
    slug: "lexis",
    name: "Lexis",
    industry: "Legal & Professional",
    category: "professional-services",
    capabilities: ["Practice SEO", "Client intake", "Case management", "Attorney profiles"],
    previewUrl: "https://lexis-template.vercel.app",
    gradient: ["#6366f1", "#4338ca"],
    icon: "⚖️",
  },
  {
    slug: "prism",
    name: "Prism",
    industry: "Creative & Portfolio",
    category: "creative",
    capabilities: ["Portfolio SEO", "Lead capture", "Project booking", "Gallery showcase"],
    previewUrl: "https://prism-template.vercel.app",
    gradient: ["#8b5cf6", "#7c3aed"],
    icon: "🎨",
  },
  {
    slug: "ember",
    name: "Ember",
    industry: "Events & Entertainment",
    category: "creative",
    capabilities: ["Event SEO", "Ticket booking", "Gallery showcase", "Venue management"],
    previewUrl: "https://ember-template.vercel.app",
    gradient: ["#ef4444", "#b91c1c"],
    icon: "🔥",
  },
  {
    slug: "forma",
    name: "Forma",
    industry: "Fitness & Training",
    category: "health-wellness",
    capabilities: ["Class scheduling", "Membership management", "Trainer profiles", "Program SEO"],
    previewUrl: "https://forma-template.vercel.app",
    gradient: ["#22c55e", "#16a34a"],
    icon: "💪",
  },
  {
    slug: "nexus",
    name: "Nexus",
    industry: "Tech & SaaS",
    category: "professional-services",
    capabilities: ["Service SEO", "Lead generation", "Case studies", "Team showcase"],
    previewUrl: "https://nexus-template.vercel.app",
    gradient: ["#06b6d4", "#0891b2"],
    icon: "🚀",
  },
];
```

- [ ] **Step 3: Create `lib/services.config.ts`**

```ts
export interface ServiceConfig {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  capabilities: string[];
}

export const services: ServiceConfig[] = [
  {
    slug: "qa-testing",
    name: "QA & Testing",
    shortDescription: "Comprehensive quality assurance for software products",
    description:
      "Our roots are in quality. We offer functional testing, automation testing, performance testing, and security testing — with the same rigor we apply to our own platform.",
    capabilities: [
      "Functional Testing",
      "Test Automation",
      "Performance Testing",
      "Security Testing",
      "QA Strategy Consulting",
    ],
  },
  {
    slug: "custom-development",
    name: "Custom Development",
    shortDescription: "Tailored integrations and platform extensions",
    description:
      "Need something beyond what the platform offers out of the box? Our team builds custom integrations, workflows, and features on top of the PeakQ platform.",
    capabilities: [
      "Custom Integrations",
      "API Development",
      "Platform Extensions",
      "Data Migration",
      "Third-party Connectors",
    ],
  },
  {
    slug: "managed-services",
    name: "Managed Services",
    shortDescription: "Hands-off management of your entire platform",
    description:
      "We built the platform — we know it inside out. Let our team manage your content, SEO, and campaigns so you can focus on running your business.",
    capabilities: [
      "Content Management",
      "SEO Campaign Management",
      "Analytics & Reporting",
      "Platform Monitoring",
      "Ongoing Optimization",
    ],
  },
];
```

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/lib/
git commit -m "feat(peakq): add brand constants, template config, and services data"
```

---

## Task 3: Navbar & Footer

**Files:**
- Create: `apps/peakq/components/navbar.tsx`
- Create: `apps/peakq/components/footer.tsx`
- Modify: `apps/peakq/app/layout.tsx`

- [ ] **Step 1: Create `components/navbar.tsx`**

Build a responsive navbar with:
- PeakQ logo/wordmark (left)
- Navigation links from `NAV_LINKS` constant (center)
- "Get Started" CTA button (right)
- Mobile hamburger menu
- Sticky header with backdrop blur on scroll
- Import `NAV_LINKS` from `@/lib/constants`

Follow the Tailwind styling patterns from existing template navbars (check `apps/tropica-template/components/navbar.tsx` for reference). Use `lucide-react` for menu icon.

- [ ] **Step 2: Create `components/footer.tsx`**

Build a footer with:
- PeakQ logo + tagline
- 3 column links: Product (Templates, Features, Pricing), Company (About, Blog, Contact), Services (QA, Custom Dev, Managed)
- "This site runs on our platform" badge at bottom
- Copyright line

- [ ] **Step 3: Update `app/layout.tsx`**

Import Navbar and Footer, wrap `{children}` between them:

```tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// ... in body:
<Navbar />
<main>{children}</main>
<Footer />
```

- [ ] **Step 4: Verify in browser**

Run: `pnpm --filter peakq dev`

Check `http://localhost:4100` — navbar and footer should render on the placeholder page. Test mobile responsive behavior.

- [ ] **Step 5: Commit**

```bash
git add apps/peakq/components/navbar.tsx apps/peakq/components/footer.tsx apps/peakq/app/layout.tsx
git commit -m "feat(peakq): add responsive navbar and footer"
```

---

## Task 4: Homepage Sections

**Files:**
- Create: `apps/peakq/components/sections/hero.tsx`
- Create: `apps/peakq/components/sections/industry-showcase.tsx`
- Create: `apps/peakq/components/sections/compounding-stack.tsx`
- Create: `apps/peakq/components/sections/pricing-preview.tsx`
- Create: `apps/peakq/components/sections/services-preview.tsx`
- Create: `apps/peakq/components/sections/final-cta.tsx`
- Modify: `apps/peakq/app/page.tsx`

- [ ] **Step 1: Create `components/sections/hero.tsx`**

Build the hero section following the spec:
- Eyebrow: "AI-Powered Business Operating System" (from `BRAND.tagline`)
- Headline: from `BRAND.heroHeadline`
- Subtext: from `BRAND.heroSubtext`
- Two CTAs: "See It In Action →" (link to `/templates`) + "View Pricing" (link to `/pricing`)
- Subtle proof text: from `BRAND.subtleProof`
- Use `@velo/motion-components` for entrance animations (`AnimatedText`, `MotionSection`) if available, otherwise use `framer-motion` directly
- Dark background, green accent color (#4ade80) for primary CTA

- [ ] **Step 2: Create `components/sections/industry-showcase.tsx`**

Build the industry showcase grid:
- Headline: "Purpose-Built for Your Industry"
- Subtext: "Each industry gets intelligence trained on its specific patterns, workflows, and growth levers."
- 4x2 grid of industry cards using data from `templates.config.ts`
  - Group templates by unique industry, show icon + name + 3 capabilities per card
  - Last card: dashed border "+More Industries / Growing library / Request yours"
- Bottom CTA: "Explore all industry solutions →" (link to `/templates`)
- Import templates data from `@/lib/templates.config`

- [ ] **Step 3: Create `components/sections/compounding-stack.tsx`**

Build the visual compounding stack — the key section:
- Headline: from `BRAND.stackHeadline`
- Subtext: from `BRAND.stackSubtext`
- 4 stacked layers with "compounds into" arrows:
  - Starter (green): Website + Hosting + CMS
  - Growth (blue): SEO + Lead Capture + Reputation
  - Scale (purple): Ads Autopilot + Business Intelligence
  - Enterprise (gold): Custom Integrations + Priority Support
- Each layer has: icon row, description, tier label badge
- Use framer-motion for stagger-in animation on scroll

- [ ] **Step 4: Create `components/sections/pricing-preview.tsx`**

Build the 4-tier pricing preview:
- Headline: "Start Where You Are. Scale When You're Ready."
- 4 cards in a row: Starter ($99/mo), Growth ($499/mo), Scale ($999/mo + "POPULAR" badge), Enterprise (Custom)
- Each card shows tier name, price, and 3 key features
- Bottom CTA: "See full pricing →" (link to `/pricing`)

- [ ] **Step 5: Create `components/sections/services-preview.tsx`**

Build the secondary services strip:
- Intro: "Need hands-on help? Our team built the platform — we know it inside out."
- 3 cards: QA & Testing, Custom Development, Managed Services
- Data from `@/lib/services.config`

- [ ] **Step 6: Create `components/sections/final-cta.tsx`**

Build the bottom CTA section:
- Headline: from `BRAND.ctaHeadline`
- Subtext: from `BRAND.ctaSubtext`
- CTA button: "Get Started →" (link to `/get-started`)
- Full-width dark section with green accent

- [ ] **Step 7: Assemble homepage in `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/hero";
import { IndustryShowcase } from "@/components/sections/industry-showcase";
import { CompoundingStack } from "@/components/sections/compounding-stack";
import { PricingPreview } from "@/components/sections/pricing-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IndustryShowcase />
      <CompoundingStack />
      <PricingPreview />
      <ServicesPreview />
      <FinalCta />
    </>
  );
}
```

- [ ] **Step 8: Verify in browser**

Run dev server, check `http://localhost:4100`. All 6 sections should render in order. Check:
- Scroll flow feels natural
- Animations trigger on scroll
- CTAs link to correct routes
- Mobile responsive layout

- [ ] **Step 9: Commit**

```bash
git add apps/peakq/components/sections/ apps/peakq/app/page.tsx
git commit -m "feat(peakq): add all homepage sections — hero, industry, stack, pricing, services, cta"
```

---

## Task 5: Templates Gallery Page

**Files:**
- Create: `apps/peakq/components/template-card.tsx`
- Create: `apps/peakq/components/template-filter.tsx`
- Create: `apps/peakq/app/templates/page.tsx`

- [ ] **Step 1: Create `components/template-card.tsx`**

A card component that takes a `TemplateConfig` object:
- Top: gradient background (from `template.gradient`) as placeholder for future iframe preview. Show icon centered.
- Bottom: template name, industry label, capabilities list (comma-separated), "Preview →" and "Use This" links
- "Preview →" links to the template's `previewUrl` (opens in new tab)
- "Use This" links to `/get-started?template={slug}`
- Hover effect: subtle scale + border glow

```tsx
import type { TemplateConfig } from "@/lib/templates.config";

interface TemplateCardProps {
  template: TemplateConfig;
}
```

- [ ] **Step 2: Create a "Request Industry" card variant**

Either as a prop on `TemplateCard` or a separate small component:
- Dashed border, no gradient
- "+" icon, "Don't See Your Industry?", "We're building new solutions every month.", "Request Yours →" (links to `/contact`)

- [ ] **Step 3: Create `components/template-filter.tsx`**

Filter pill bar:
- Import `TEMPLATE_CATEGORIES` from config
- "All" is active by default (highlighted green)
- Clicking a category filters the grid
- Use React state (`useState`) for active filter — this is a client component

```tsx
"use client";

import { TEMPLATE_CATEGORIES } from "@/lib/templates.config";

interface TemplateFilterProps {
  active: string;
  onChange: (category: string) => void;
}
```

- [ ] **Step 4: Create `app/templates/page.tsx`**

Assemble the gallery page:
- Header: eyebrow "Industry Solutions", headline "See What Your Business Could Look Like", subtext
- `TemplateFilter` component
- Grid of `TemplateCard` components (3 columns on desktop, 2 tablet, 1 mobile)
- "Request Industry" card as the last item
- Bottom CTA: "Every template includes the full AI-Powered Business Operating System."
- **Important:** The page itself must be a server component (so it can export `metadata`). Extract the interactive filter + grid into a client component wrapper.

Create `components/template-gallery.tsx` (client component):

```tsx
"use client";

import { useState } from "react";
import { templates } from "@/lib/templates.config";
import { TemplateCard } from "@/components/template-card";
import { TemplateFilter } from "@/components/template-filter";

export function TemplateGallery() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all"
    ? templates
    : templates.filter((t) => t.category === filter);

  return (
    <>
      <TemplateFilter active={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <TemplateCard key={t.slug} template={t} />
        ))}
        {/* Request Industry card */}
      </div>
    </>
  );
}
```

Then `app/templates/page.tsx` (server component):

```tsx
import { TemplateGallery } from "@/components/template-gallery";

export const metadata = {
  title: "Industry Solutions — PeakQ",
  description: "See what your business could look like...",
};

export default function TemplatesPage() {
  return (
    <>
      {/* Header section */}
      <TemplateGallery />
      {/* Bottom CTA */}
    </>
  );
}
```

- [ ] **Step 5: Verify in browser**

Navigate to `http://localhost:4100/templates`. Check:
- All templates render as cards
- Filter pills work (clicking a category shows only matching templates)
- "All" shows everything
- "Request Yours" card appears at the end
- Mobile responsive grid (1 col → 2 col → 3 col)

- [ ] **Step 6: Commit**

```bash
git add apps/peakq/components/template-card.tsx apps/peakq/components/template-filter.tsx apps/peakq/app/templates/
git commit -m "feat(peakq): add templates gallery page with filter and cards"
```

---

## Task 6: Pricing Page

**Files:**
- Create: `apps/peakq/components/pricing-card.tsx`
- Create: `apps/peakq/app/pricing/page.tsx`

- [ ] **Step 1: Create `components/pricing-card.tsx`**

A detailed pricing card (more detail than the homepage preview):
- Tier name, price, description
- Feature list with checkmarks
- CTA button
- "POPULAR" badge variant for Scale tier
- Highlighted border for the popular tier

- [ ] **Step 2: Create `app/pricing/page.tsx`**

Full pricing page with:
- Header: "Start Where You Are. Scale When You're Ready."
- 4-tier grid using `PricingCard` components
- Feature comparison table below (what's included in each tier)
- FAQ section at bottom (common pricing questions)
- Note: "Price depends on industry and scope"
- Bottom CTA: "Get Started →"

Define pricing data inline in this file (or in a separate `pricing.config.ts` if it gets large):

```ts
const tiers = [
  {
    name: "Starter",
    price: "$99",
    period: "/mo",
    description: "Your industry-optimized online presence — launch-ready in days",
    features: ["Website + Hosting", "CMS", "Industry Template", "Basic SEO", "Contact Form"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "$499",
    period: "/mo",
    description: "AI that captures leads and builds your reputation on autopilot",
    features: ["Everything in Starter", "SEO Engine", "Lead Capture", "Reputation Management", "Review Automation"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Scale",
    price: "$999",
    period: "/mo",
    description: "Full-funnel: automated ad spend → lead tracking → ROI dashboard",
    features: ["Everything in Growth", "Ads Autopilot", "Business Intelligence", "Full Funnel Analytics", "Revenue Attribution"],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored workflows, dedicated success manager, API access",
    features: ["Everything in Scale", "Custom Integrations", "Priority Support", "Dedicated Account Manager", "API Access"],
    cta: "Contact Sales",
    popular: false,
  },
];
```

- [ ] **Step 3: Verify in browser**

Navigate to `http://localhost:4100/pricing`. Check layout, "POPULAR" badge, feature comparison table renders correctly, responsive design.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/components/pricing-card.tsx apps/peakq/app/pricing/
git commit -m "feat(peakq): add full pricing page with tier comparison"
```

---

## Task 7: Features Page

**Files:**
- Create: `apps/peakq/app/features/page.tsx`

- [ ] **Step 1: Create `app/features/page.tsx`**

Platform capabilities deep dive:
- Header: "Everything You Need to Run Your Business"
- Feature blocks (alternating layout — image left/text right, then text left/image right):
  1. **Website + CMS** — Industry templates, drag-and-drop content, mobile-optimized
  2. **SEO Engine** — AI-powered keyword research, auto-generated content, ranking tracking
  3. **Lead Capture** — Smart forms, chatbot, WhatsApp integration, lead scoring
  4. **Reputation Management** — Review automation, response AI, rating monitoring
  5. **Ads Autopilot** — Google/Meta ad management, budget optimization, conversion tracking
  6. **Business Intelligence** — Revenue dashboard, client analytics, growth reporting
- Each block: headline, description (2-3 sentences), 3-4 bullet capabilities
- Use placeholder divs for feature illustrations (can be replaced with real graphics later)
- Bottom CTA: "See Pricing →"

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:4100/features`. Check alternating layout renders, content is readable, responsive.

- [ ] **Step 3: Commit**

```bash
git add apps/peakq/app/features/
git commit -m "feat(peakq): add features page with platform capability deep dive"
```

---

## Task 8: Services Pages

**Files:**
- Create: `apps/peakq/app/services/page.tsx`
- Create: `apps/peakq/app/services/[slug]/page.tsx`

- [ ] **Step 1: Create `app/services/page.tsx`**

Services overview:
- Header: "Expert Services from the Team That Built the Platform"
- 3 service cards using data from `@/lib/services.config`
- Each card: service name, short description, "Learn More →" link to `/services/{slug}`

- [ ] **Step 2: Create `app/services/[slug]/page.tsx`**

Dynamic service detail page:
- `generateStaticParams()` from `services.config` for static generation
- Header with service name
- Full description
- Capabilities list with checkmarks
- CTA: "Get in Touch" (links to `/contact`)
- Handle unknown slugs with `notFound()`

```tsx
import { services } from "@/lib/services.config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  // ... render
}
```

- [ ] **Step 3: Verify in browser**

Check `/services`, `/services/qa-testing`, `/services/custom-development`, `/services/managed-services`. Verify unknown slug shows 404.

- [ ] **Step 4: Commit**

```bash
git add apps/peakq/app/services/
git commit -m "feat(peakq): add services overview and dynamic detail pages"
```

---

## Task 9: About, Contact, Blog, Get-Started Pages

**Files:**
- Create: `apps/peakq/app/about/page.tsx`
- Create: `apps/peakq/app/contact/page.tsx`
- Create: `apps/peakq/app/blog/page.tsx`
- Create: `apps/peakq/components/lead-capture-form.tsx`
- Create: `apps/peakq/app/get-started/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

Company story page:
- Header: "We Built the Platform. Then We Proved It Works."
- Origin story: QA roots → saw the gap → built the platform
- Team section (placeholder for now — name, role, brief bio cards)
- Mission: "AI-powered tools that make every business competitive"

- [ ] **Step 2: Create `app/contact/page.tsx`**

Contact page:
- Header: "Let's Talk"
- Contact form using `@velo/integration-forms` if the `ContactForm` component exists. Otherwise, build a simple form with fields: Name, Email, Company, Message
- "Book a Demo" CTA section alongside the form
- Company email and location info

Check what `@velo/integration-forms` exports. If it provides `ContactForm` or `contactFormSchema`, use them. If the package API doesn't fit, build a simple form component and store submissions via a Next.js server action.

- [ ] **Step 3: Create `app/blog/page.tsx`**

Coming Soon page (per spec):
- Header: "Blog — Coming Soon"
- Subtext: "Industry insights, platform updates, and growth strategies. Subscribe to get notified."
- Email signup field + "Notify Me" button
- Minimal page — this is a placeholder

- [ ] **Step 4: Create `components/lead-capture-form.tsx`**

Lead capture form for the get-started page:
- Fields: Name, Email, Company Name, Industry (dropdown from template categories), "Which template caught your eye?" (optional dropdown from templates config)
- Submit button: "Get Started"
- Client component with form validation
- On submit: call a server action that stores the lead (or for now, just logs to console — full backend integration comes later)

```tsx
"use client";

import { useState } from "react";
import { TEMPLATE_CATEGORIES } from "@/lib/templates.config";
import { templates } from "@/lib/templates.config";
```

- [ ] **Step 5: Create `app/get-started/page.tsx`**

Get-started page:
- Header: "Start Building Your Revenue Machine"
- Subtext: "Tell us about your business and we'll set you up with the perfect solution."
- `LeadCaptureForm` component
- Side panel: "What happens next?" — 1. We review your info, 2. We set up your template, 3. You launch
- Read `?template=` from search params to pre-select the template dropdown

- [ ] **Step 6: Verify all pages in browser**

Check:
- `/about` — story and team section render
- `/contact` — form renders and submits
- `/blog` — coming soon with email signup
- `/get-started` — form renders, template dropdown works
- `/get-started?template=tropica` — dropdown pre-selects tropica

- [ ] **Step 7: Commit**

```bash
git add apps/peakq/app/about/ apps/peakq/app/contact/ apps/peakq/app/blog/ apps/peakq/app/get-started/ apps/peakq/components/lead-capture-form.tsx
git commit -m "feat(peakq): add about, contact, blog (coming soon), and get-started pages"
```

---

## Task 10: Polish & Final Verification

**Files:**
- Modify: various files for polish

- [ ] **Step 1: Add page-level metadata to all pages**

Each page.tsx should export a `metadata` object:

```tsx
export const metadata = {
  title: "Templates — PeakQ",
  description: "...",
};
```

Do this for: templates, pricing, features, services, about, contact, blog, get-started.

- [ ] **Step 2: Add smooth scroll behavior**

In `globals.css`, add:
```css
html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 3: Full navigation test**

Visit every page and verify:
- All navbar links work
- All footer links work
- All CTA buttons navigate correctly
- "See It In Action →" goes to `/templates`
- "View Pricing" goes to `/pricing`
- Template "Use This" goes to `/get-started?template=X`
- Mobile navigation works

- [ ] **Step 4: Responsive check**

Test at these breakpoints:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px
- Wide: 1536px

Key things to verify: hero text wrapping, template grid columns, pricing cards stacking, navbar hamburger menu.

- [ ] **Step 5: Commit**

```bash
git add apps/peakq/
git commit -m "feat(peakq): add page metadata and polish navigation"
```

- [ ] **Step 6: Build check**

Run:
```bash
pnpm --filter peakq build
```

Expected: Build completes without errors. Fix any TypeScript or build errors.

- [ ] **Step 7: Final commit if fixes needed**

```bash
git add apps/peakq/
git commit -m "fix(peakq): resolve build errors"
```
