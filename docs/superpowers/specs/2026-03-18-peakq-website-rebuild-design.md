# PeakQ.tech Website Rebuild — Design Spec

**Date:** 2026-03-18
**Status:** Draft
**Author:** Yohanes + Claude

## Overview

Rebuild peakq.tech as a new app inside the velocity-template monorepo, positioning PeakQ as an "AI-Powered Business Operating System." The site itself runs on the platform — serving as living proof that the product works. QA consulting services remain as a secondary offering.

## Goals

1. **Living proof** — peakq.tech is a velocity-template app consuming the same `@velo/` packages as customer sites
2. **Platform-first positioning** — lead with the AI-powered business OS story, not QA services
3. **Revenue machine narrative** — communicate the compounding value stack that scales from $99 to $5K/mo
4. **Template showcase** — let visitors see what their business could look like without revealing exact template count
5. **Conversion funnel** — Hero → Industry Showcase → Value Stack → Pricing → CTA

## Brand & Messaging

| Element | Value |
|---------|-------|
| Company name | PeakQ |
| Domain | peakq.tech |
| Brand positioning | AI-Powered Business Operating System |
| Hero headline | Your Industry. Your AI Team. Your Unfair Advantage. |
| Stack headline | We Don't Just Build Websites. We Build Revenue Machines. |
| Final CTA | Stop Hiring. Start Deploying. |
| Subtle proof | "This site runs on our platform. You're looking at the product." |

## Architecture

### Monorepo Placement

```
velocity-template/
  apps/
    peakq/            ← NEW — PeakQ business site
    dashboard/
    gallery/
    lexis-template/
    serenity-template/
    haven-template/
    nexus-template/
    medica-template/
    forma-template/
    prism-template/
    commerce-template/
    ember-template/
    tropica-template/
  packages/
    @velo/db
    @velo/seo-engine
    @velo/booking-engine
    @velo/integration-analytics
    @velo/integration-cms
    @velo/integration-forms
    @velo/integration-payments
    @velo/integration-whatsapp
    sections/
```

### Tech Stack

- **Framework:** Next.js (same version as other apps in monorepo)
- **Styling:** Tailwind CSS + shared design tokens
- **Components:** Reuse `@velo/` sections (hero, features, pricing, testimonials, FAQ, footer, contact, stats, team)
- **Data:** Prisma via `@velo/db` (for blog, contact form submissions, future client portal)
- **SEO:** `@velo/seo-engine` (meta tags, sitemap, structured data)
- **Forms:** `@velo/integration-forms` (contact form, demo requests)
- **Analytics:** `@velo/integration-analytics` (visitor tracking)
- **CMS:** `@velo/integration-cms` (blog content management)

### Package Dependencies by Phase

**Day 1 (Launch):**
- `sections/` — hero, features, pricing, testimonials, FAQ, footer, contact, stats, team
- `@velo/seo-engine` — meta tags, sitemap
- `@velo/integration-forms` — contact form
- `@velo/integration-analytics` — tracking

**Later Phases:**
- `@velo/db` — client portal, dashboard access
- `@velo/booking-engine` — demo scheduling
- `@velo/integration-payments` — subscription billing
- `@velo/integration-cms` — blog content
- `@velo/integration-whatsapp` — support chat

## Pages & Routes

### Primary Pages (Platform Story)

| Route | Purpose | Key Sections |
|-------|---------|-------------|
| `/` | Homepage | Hero, Industry Showcase, Compounding Stack, Pricing Preview, Services, CTA |
| `/templates` | Industry Solutions Gallery | Filter bar, template cards with live iframe previews, "Request yours" CTA |
| `/features` | Platform Capabilities | Deep dive into each capability: SEO, Lead Capture, Reputation, Ads, BI |
| `/pricing` | Full Pricing Detail | 4-tier comparison table, feature breakdown per tier, FAQ |
| `/get-started` | Onboarding Flow | Template selection → account creation → setup wizard |

### Secondary Pages (Services & Company)

| Route | Purpose | Key Sections |
|-------|---------|-------------|
| `/services` | Services Overview | QA & Testing, Custom Development, Managed Services |
| `/services/[slug]` | Service Detail | Individual service page with scope, process, pricing |
| `/about` | Company Story | Origin, team, mission — "We built the platform, then we proved it works" |
| `/contact` | Contact & Demo | Contact form + book a demo CTA |
| `/blog` | Content Marketing | Powered by `@velo/integration-cms`, industry insights, platform updates |

## Homepage Design (Scroll Order)

### Section 1: Hero
- **Eyebrow:** "AI-Powered Business Operating System"
- **Headline:** "Your Industry. Your AI Team. Your Unfair Advantage."
- **Subtext:** "An intelligent platform that understands how your industry works — from marketing to lead capture to reputation management. Not generic tools. Purpose-built for your business."
- **CTAs:** "See It In Action →" (goes to `/templates`) + "View Pricing"
- **Subtle proof:** "This site runs on our platform. You're looking at the product."

### Section 2: Industry Showcase
- **Headline:** "Purpose-Built for Your Industry"
- **Subtext:** "Each industry gets intelligence trained on its specific patterns, workflows, and growth levers."
- **Grid:** 7 named industries + 1 "More Industries / Growing library / Request yours" card
- **Industries shown:** Restaurants, Real Estate, Wellness, Medical, E-Commerce, Legal, Creative
- **Each card shows:** Industry name + 3 specific capabilities (e.g., "Menu SEO • Reservations • Review management")
- **CTA:** "Explore all industry solutions →" (links to `/templates`)
- **Important:** No exact template count anywhere

### Section 3: Compounding Stack (Key Section)
- **Headline:** "We Don't Just Build Websites. We Build Revenue Machines."
- **Subtext:** "Every layer compounds the one below it. Start simple. Scale when you're ready."
- **Visual:** Stacked layers with "compounds into" arrows between them:
  - **Starter:** Website + Hosting + CMS — "Your industry-optimized online presence — launch-ready in days"
  - **Growth:** SEO + Lead Capture + Reputation — "AI that knows your industry's search patterns, captures leads, and builds your reputation on autopilot"
  - **Scale:** Ads Autopilot + Business Intelligence — "Full-funnel: automated ad spend → lead tracking → ROI dashboard"
  - **Enterprise:** Custom Integrations + Priority Support — "Tailored workflows, dedicated success manager, API access"

### Section 4: Pricing Preview
- **Headline:** "Start Where You Are. Scale When You're Ready."
- **Subtext:** "Every tier compounds the one below it. No wasted spend."
- **Cards:** 4-tier grid
  - Starter: $99/mo — Website, Hosting, CMS
  - Growth: $499/mo — + SEO, Lead Capture, Reputation
  - Scale: $999/mo (marked "POPULAR") — + Ads Autopilot, BI Dashboard, Full Funnel
  - Enterprise: Custom — + Custom Workflows, Priority Support, API Access
- **CTA:** "See full pricing →" (links to `/pricing`)

### Section 5: Services (Secondary)
- **Intro:** "Need hands-on help? Our team built the platform — we know it inside out."
- **Cards:** QA & Testing, Custom Development, Managed Services
- **Tone:** Supportive, not promotional — this is a safety net, not the headline

### Section 6: Final CTA
- **Headline:** "Stop Hiring. Start Deploying."
- **Subtext:** "AI-powered tools that cost less than one employee and outperform an entire team."
- **CTA:** "Get Started →"

## Templates Gallery Page (`/templates`)

### Header
- **Eyebrow:** "Industry Solutions"
- **Headline:** "See What Your Business Could Look Like"
- **Subtext:** "Every template comes with industry-specific intelligence built in. Pick yours and launch in days."

### Filter Bar
- Pill-style category filters: All, Food & Hospitality, Real Estate, Health & Wellness, Professional Services, E-Commerce, Creative

### Template Grid
- **Layout:** 3-column responsive grid
- **Card structure:**
  - Top: Live iframe preview of the deployed template app (with gradient fallback)
  - Bottom: Template name, industry label, 3-4 specific capabilities, "Preview →" and "Use This" CTAs
- **Templates shown:** All templates in the monorepo, organized by industry category
- **Last card:** "Don't See Your Industry?" with dashed border — "We're building new solutions every month." + "Request Yours →" CTA

### Bottom CTA
- "Found Your Industry? Every template includes the full AI-Powered Business Operating System. Start in minutes."

## Pricing Model (The Compounding Stack)

| Tier | What They Get | Monthly Price |
|------|--------------|---------------|
| Starter | Website + Hosting + CMS | $99-199/mo |
| Growth | + SEO + Lead Capture + Reviews | $499-799/mo |
| Scale | + Ads Autopilot + Full BI Dashboard | $999-1,499/mo |
| Enterprise | + Custom integrations + Priority support | $2,000-5,000/mo |

**Key messaging:** Each tier compounds the one below it. The value proposition is not "more features" but "compounding returns."

## Interactive Template Preview

- **Approach:** Hero CTA navigates to `/templates` gallery page
- **Implementation:** Each template card shows a live iframe preview of the deployed template app
- **Click behavior:** "Preview →" expands to full-page iframe preview; "Use This" navigates to `/get-started` with template pre-selected
- **No in-page switching** — clean separation between PeakQ site and template gallery

## Data Flow

```
Visitor lands on peakq.tech
  → Served by apps/peakq (Next.js)
  → Uses @velo/ sections for layout
  → SEO handled by @velo/seo-engine
  → Contact form via @velo/integration-forms
  → Analytics via @velo/integration-analytics

Visitor clicks "See It In Action"
  → Navigates to /templates
  → Gallery shows all templates
  → Each card iframes the deployed template app (e.g., tropica-template.vercel.app)

Visitor clicks "Use This"
  → Navigates to /get-started?template=tropica
  → Onboarding flow: account → customize → launch
```

## Migration from Current PeakQ

The current peakq site (Next.js + MongoDB, atomic design) will be fully replaced. Key differences:

| Aspect | Current | New |
|--------|---------|-----|
| Architecture | Standalone Next.js + MongoDB | Monorepo app consuming `@velo/` packages |
| Positioning | QA consulting company | AI-Powered Business Operating System |
| Content | 6 QA services | Platform + templates + secondary services |
| Backend | MongoDB + Mongoose | Prisma via `@velo/db` |
| Components | Atomic design (custom) | `@velo/` shared sections |
| SEO | Manual | `@velo/seo-engine` |

**QA services preserved as:**
- `/services/qa-testing` — Functional, automation, performance, security testing
- `/services/custom-development` — Custom integrations and builds
- `/services/managed-services` — Ongoing management and support

## Testing Strategy

- **Component tests:** Verify sections render correctly with PeakQ content
- **Integration tests:** Verify `@velo/` package consumption works (SEO, forms, analytics)
- **Visual regression:** Compare template iframe previews load correctly
- **Performance:** Lighthouse scores > 90 on all pages
- **SEO:** Verify sitemap generation, meta tags, structured data

## Success Criteria

1. peakq.tech runs entirely on the velocity-template platform
2. All 10 pages are live and functional
3. Template gallery shows live previews of all template apps
4. Contact form captures and stores submissions
5. SEO engine generates proper meta tags and sitemap
6. Lighthouse performance score > 90
7. The site itself is indistinguishable from a "real" product site — it IS the real product site

## Out of Scope (For Now)

- Client portal / dashboard login on peakq.tech
- Demo scheduling via booking engine
- Payment processing for subscriptions
- WhatsApp support chat widget
- Blog content (requires `@velo/integration-cms` setup)
- Get-started onboarding wizard (requires auth + template provisioning)

These will be added as the platform matures through Phase 4A-4E.
