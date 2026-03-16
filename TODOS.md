# TODOS — Velo Platform

> Generated from CEO Plan Review (2026-03-15). Mode: SCOPE EXPANSION.
> Refined by Eng Plan Review (2026-03-15). Mode: BIG CHANGE.

## Phase 1: Foundation (Weeks 1-6)

### ~~P1 — Theme System (`@velo/theme`)~~ ✅ DONE
- **What:** Create theme package. CSS variables only (NOT React Context). Each template has a theme.json config. Package generates a theme.css per template that includes:
  - CSS custom properties (colors, fonts, spacing, border-radius)
  - Tailwind v4 `@theme inline` mappings
  - `@source` directives for the template's sections
  - CSS variable completeness validation (section required vars ⊆ theme vars)
- **Why:** Foundation for hybrid sections. Sections already consume CSS vars via Tailwind utilities (bg-primary, text-foreground). This formalizes the existing pattern.
- **Design decisions:** CSS variables chosen over React Context because all 6 templates already use CSS vars in globals.css. React Context would require rewriting every section for zero benefit.
- **Effort:** L (1-2 weeks)
- **Depends on:** Nothing. Everything else depends on this.
- **Status:** DONE — `@velo/theme` package with Zod schema, CSS generator, completeness validator. 50 tests. theme.json files for all 6 templates. Remaining: wire generated theme.css into apps' globals.css (optional, apps work as-is).

### ~~P1 — Zod Validation for template.json~~ ✅ DONE
- **What:** Add Zod schema for template.json. Validate in `loadTemplateManifest()`. Clear error messages for missing/invalid fields. Include `extraProps` field in section schema (replaces hardcoded footer check in generate.ts:124).
- **Why:** template.json is single source of truth. Invalid manifests silently produce broken output.
- **Effort:** S (2-3 hours)
- **Depends on:** Nothing.
- **Status:** DONE — `tools/create-app/src/template-schema.ts`, 13 tests. `extraProps` in schema; generate.ts:124 hardcode removal is separate (see P2 — Add `extraProps` to template.json).

### ~~P1 — Namespace Rename @velocity/ → @velo/~~ ✅ DONE
- **What:** Rename all packages from `@velocity/` to `@velo/`. Update all imports, package.json names, template.json references. Also add `"velo": { "type": "infra" | "section" }` field to every package.json (replaces regex exclusion in eject.ts:53).
- **Why:** Clean namespace + declarative package classification. Eject tool's regex breaks silently when new infra packages are added.
- **Effort:** M (1 day, scriptable)
- **Depends on:** Nothing. Do BEFORE adding more packages.
- **Status:** DONE — 226 files changed, all 47 packages renamed, "velo" metadata field added.

### P1 — Full Test Suite for Tools 🔶 IN PROGRESS
- **What:** Unit + integration + E2E tests for create-app and eject. Cover discover, generate, eject, resolve-imports. Priority order: tool tests + Zod validation first (highest-risk codepaths), then component tests for hybrid sections.
- **Why:** Zero test coverage for core IP. QA company with untested code = credibility risk.
- **Test diagram:** See eng review for 30-codepath test coverage map (groups A-F).
- **Effort:** L (1-2 weeks)
- **Depends on:** Nothing. Parallelize with theme system.
- **Status:** IN PROGRESS — 26 tests for create-app + 14 tests for eject = 40 total. Core codepaths covered (schema, generate, discover, eject, resolve-imports). Remaining: E2E integration tests.

### ~~P1 — Build Smoke Test Script~~ ✅ DONE
- **What:** Add `"test:build": "turbo build"` to root package.json. Local safety net for section consolidation — verifies all 6 apps still build.
- **Why:** No CI yet, and section consolidation is the riskiest change.
- **Effort:** XS (5 min)
- **Depends on:** Nothing. Need before consolidation starts.
- **Status:** DONE — added to root package.json.

### P1 — Section Consolidation (41 → ~10 hybrid sections) 🔶 PARTIALLY DONE
- **What:** Incrementally consolidate template-specific sections into hybrid sections with theme variants. Start with footer, then testimonials, then hero.
- **Design decisions:**
  - Variant prop + conditional rendering for structural differences (~10% of code)
  - CSS differences handled entirely by theme system CSS variables (~90%)
  - Dynamic imports for variant code to avoid bundle bloat
  - Mandate MotionSection component (replaces 74 inline reveal pattern occurrences)
  - Extract BackToTop from Footer into @velo/ui (page-level concern)
- **Why:** 41 packages is unmaintainable. Bug fixes replicated 6x. New template = 7 new packages.
- **Effort:** XL (4-6 weeks, phased)
- **Depends on:** Theme system, Build smoke test script.
- **Status:** PARTIALLY DONE — 41 → 33 sections.
  - ✅ Footer: 6 → 1 hybrid with variant prop (-5 packages)
  - ✅ Testimonials: 4 → 1 hybrid with carousel/grid modes (-3 packages)
  - ✅ BackToTop extracted to @velo/ui
  - ⏭️ Hero: NOT consolidatable — each hero is architecturally distinct (video, 3D physics, SVG filters, custom scroll). Forcing into one component would create worse code than separate packages.
  - ⏭️ Remaining sections: Template-specific by definition (ember-menu, ember-chef, haven-properties, etc.) — cannot be consolidated.

### ~~P1 — CI/CD Pipeline~~ ✅ DONE
- **What:** GitHub Actions: lint, type-check, unit tests, integration tests, build all apps. Configure Turborepo remote caching. Deploy pipeline for managed-tier clients.
- **Why:** No CI = no safety net. Required for managed client deploys.
- **Effort:** M (3-5 days)
- **Depends on:** Tests for meaningful CI.
- **Status:** DONE — `.github/workflows/ci.yml` with 5 jobs: lint, typecheck (soft-fail, pre-existing errors), test:ci (123 tests), build, codegen drift check. Turborepo remote caching ready (TURBO_TOKEN/TURBO_TEAM secrets).

### ~~P2 — Type Generation from template.json~~ ✅ DONE
- **What:** Create `tools/codegen` that reads template.json and generates composite content types from section-level type declarations.
- **Why:** Keeps types in sync with template.json. Eliminates manual type maintenance.
- **Effort:** M (3-5 days)
- **Depends on:** Zod validation, Theme system.
- **Status:** DONE — `pnpm codegen` generates content types for all 6 templates to `packages/infra/types/src/generated/`. 8 tests. Auto-maps consolidated sections (Footer, Testimonials) to base types.

### ~~P2 — Extract BackToTop to @velo/ui~~ ✅ DONE
- **What:** Extract the back-to-top floating button from Footer into `@velo/ui` as a standalone `<BackToTop />` component. Render at page level (layout.tsx or page-client.tsx).
- **Why:** Footer shouldn't own page-level scroll behavior. Removing Footer removes back-to-top.
- **Effort:** S (30 min)
- **Depends on:** Nothing. Do during Footer consolidation.
- **Status:** DONE — `@velo/ui` now exports `<BackToTop className={...} />`, used by hybrid Footer.

### ~~P2 — Add `extraProps` to template.json~~ ✅ DONE
- **What:** Add `extraProps` field to template.json section schema. Update generate.ts to read this instead of hardcoding footer-specific logic (generate.ts:124).
- **Why:** generate.ts shouldn't have section-specific knowledge. Generic mechanism for sections needing special props.
- **Effort:** S (1-2 hours)
- **Depends on:** Zod validation (same schema).
- **Status:** DONE — All 6 template.json files updated with `extraProps` on footer. generate.ts now reads extraProps generically.

## Phase 2: Product (Weeks 7-16)

### ~~P1 — QA Pipeline Tool~~ ✅ DONE
- **What:** Create `tools/qa` — Lighthouse CI, visual regression (Playwright), a11y audit, broken link checker. JSON + PDF reports.
- **Why:** This IS the consulting company's product. Without it, you're a web dev shop.
- **Effort:** XL (2-3 weeks)
- **Depends on:** CI/CD, at least one deployed site.
- **Status:** DONE — `pnpm qa <url>` with modular audit pipeline: Lighthouse, accessibility (pa11y), link checker, meta tag audit. JSON + text reports. 21 tests.

### ~~P2 — AI Content Writer~~ ✅ DONE
- **What:** After create-app generates stubs, offer AI pass to fill realistic content based on business type and locale.
- **Why:** Transforms "scaffolding tool" into "site builder." Core to AI+templating thesis.
- **Effort:** L (1 week)
- **Depends on:** Zod validation (content schemas).
- **Status:** DONE — `pnpm ai-content <app> --business <name>` calls Claude API to generate section content matching TypeScript types. Supports `--dry-run` to preview prompt. 10 tests.

### ~~P2 — Template Gallery / Showroom Site~~ ✅ DONE
- **What:** `apps/gallery/` that displays all templates side-by-side with live previews. Client-facing demo tool.
- **Why:** The gallery IS your sales tool.
- **Effort:** M (2-4 hours)
- **Depends on:** At least 3 templates working.
- **Status:** DONE — `apps/gallery/` with server-rendered Next.js page. Auto-discovers 6 templates from sibling dirs. Shows name, description, color palette, fonts, section count. Dark theme card grid on port 3100.

### ~~P3 — Live Preview During Create-App~~ ✅ DONE
- **What:** After section selection, auto-launch `pnpm dev` and open browser.
- **Why:** Transforms CLI from "generate files" to "wow, working site."
- **Effort:** S (30 min)
- **Depends on:** Nothing.
- **Status:** DONE — `pnpm create-app --preview` flag spawns dev server after generation.

### ~~P3 — Auto-Generated OG Images~~ ✅ DONE
- **What:** Generate branded OG images per template using @vercel/og or satori.
- **Why:** Professional social previews. Small effort, polish touch.
- **Effort:** S (1 hour)
- **Depends on:** Nothing.
- **Status:** DONE — `generate()` now creates `app/api/og/route.tsx` using Next.js `ImageResponse`. Dynamic OG images with template name.

## Phase 3: Vertical SaaS Platform (Weeks 17+)

> Vision: Transform Velo from "generates websites" into "generates businesses online."
> Each template becomes a vertical business solution. Integrations ARE the product.
> Business owners get a running business online in 30 minutes for $50-200/mo.
>
> Architecture decisions (from CEO review 2026-03-16):
> - Vertical SaaS platform (not just website builder)
> - All 6 verticals simultaneously via generic integration layer
> - Monorepo integration packages (packages/integrations/*)
> - Full-featured dashboard (apps/dashboard/)
> - Supabase (Postgres) + Prisma ORM
> - Vercel deployment
> - Universal 5 integrations first: Stripe, Forms, Analytics, CMS, WhatsApp

### Phase 3.0 — Platform Foundation

#### P0 — Database + Auth Setup
- **What:** Add Supabase + Prisma to the monorepo. Create base schema (User, Site, SiteIntegration, QAReport). Set up NextAuth with Supabase adapter in apps/dashboard. Environment variable management.
- **Why:** Every other Phase 3 feature depends on persistent data and authentication.
- **Schema:** See architecture doc for Prisma models (User, Site, SiteIntegration, QAReport, Role enum).
- **Effort:** M (3-5 days)
- **Depends on:** Nothing. Do first.
- **Status:** TODO

#### P0 — Integration Registry System
- **What:** Create `packages/infra/integrations/` — a registry that discovers integration packages, validates their configs (Zod), and provides a `getIntegration(name)` API. Add `"integrations"` field to template.json schema. Each integration package exports: config, routes, components, dashboard module, and Prisma schema fragment.
- **Why:** The plugin system that makes all integrations composable. Without this, every integration is bespoke.
- **Integration package contract:**
  ```
  export interface VeloIntegration {
    name: string;                    // "@velo/integration-stripe"
    displayName: string;             // "Stripe Payments"
    description: string;
    icon: string;                    // Icon component or URL
    configSchema: ZodSchema;         // Validates SiteIntegration.config
    routes: Record<string, Handler>; // API route handlers
    components: Record<string, ComponentType>; // Embeddable UI
    dashboardModule?: ComponentType; // Settings panel in dashboard
  }
  ```
- **Effort:** L (1-2 weeks)
- **Depends on:** Database setup.
- **Status:** TODO

#### P0 — Dashboard Shell
- **What:** Create `apps/dashboard/` — Next.js app with NextAuth login, sidebar layout, and empty module slots for: Overview, Content, Integrations, QA Reports, Settings, Billing. Dark theme consistent with gallery. Mobile-responsive sidebar.
- **Why:** The dashboard is the product surface. Everything else plugs into it.
- **Effort:** L (1-2 weeks)
- **Depends on:** Database + Auth.
- **Status:** TODO

### Phase 3.1 — Universal 5 Integrations

#### P1 — Payment Integration (`@velo/integration-payments`)
- **What:** Multi-provider payment system with a unified interface. Supports 4 providers:
  - **Stripe** — Global, best for international/SaaS (cards, subscriptions, billing portal)
  - **Xendit** — Indonesia/SE Asia, best DX (VA, e-wallets: GoPay/OVO/Dana, QRIS, cards)
  - **Durianpay** — Indonesia, best infra flexibility (aggregator, multi-acquirer routing)
  - **Midtrans** — Indonesia, best ecosystem (Tokopedia/GoTo group, widest payment methods)
- **Architecture:** Provider adapter pattern — a `PaymentProvider` interface with provider-specific adapters. Site owner picks their provider in dashboard settings. Unified API for the rest of the system.
  ```
  interface PaymentProvider {
    name: string;
    createCheckout(params: CheckoutParams): Promise<CheckoutSession>;
    handleWebhook(payload: unknown, signature: string): Promise<PaymentEvent>;
    getPaymentStatus(id: string): Promise<PaymentStatus>;
    createBillingPortal?(customerId: string): Promise<string>; // Stripe-only
    supportedMethods: PaymentMethod[]; // card, va, ewallet, qris, etc.
  }
  ```
- **Why:** Payments = revenue for business owners. Indonesian businesses NEED local payment methods (70%+ of Indonesian e-commerce uses e-wallets/VA, not cards). Supporting Xendit/Midtrans/Durianpay alongside Stripe makes Velo viable for SE Asian market.
- **Components:** `<CheckoutButton>`, `<PricingTable>`, `<PaymentStatus>`, `<PaymentMethodSelector>` (shows available methods per provider)
- **Routes:** POST /checkout, POST /webhook/:provider, GET /status/:id, GET /portal
- **Dashboard:** Revenue chart, recent transactions, provider selection dropdown, API key config per provider, supported payment methods display
- **Provider comparison (for docs):**
  | Feature | Stripe | Xendit | Durianpay | Midtrans |
  |---------|--------|--------|-----------|----------|
  | Cards | ✅ | ✅ | ✅ | ✅ |
  | E-wallets (GoPay/OVO/Dana) | ❌ | ✅ | ✅ | ✅ |
  | Virtual Account (bank transfer) | ❌ | ✅ | ✅ | ✅ |
  | QRIS | ❌ | ✅ | ✅ | ✅ |
  | Subscriptions | ✅ | ✅ | ❌ | ❌ |
  | Billing Portal | ✅ | ❌ | ❌ | ❌ |
  | Global coverage | ✅ | SE Asia | Indonesia | Indonesia |
- **Effort:** XL (2-3 weeks — 1 week for abstraction + Stripe, then 2-3 days per additional provider)
- **Depends on:** Integration registry, Dashboard shell.
- **Status:** TODO

#### P1 — Forms Integration (`@velo/integration-forms`)
- **What:** Contact forms, lead capture forms, newsletter signup. Form submissions stored in Supabase + email notification via Resend/SendGrid. Dashboard module: form submissions list, export to CSV, email notification settings.
- **Why:** Every business needs contact forms. Lead capture is the simplest integration that adds immediate value.
- **Components:** `<ContactForm>`, `<LeadCaptureForm>`, `<NewsletterForm>`
- **Routes:** POST /submit, GET /submissions
- **Effort:** M (3-5 days)
- **Depends on:** Integration registry.
- **Status:** TODO

#### P1 — Analytics Integration (`@velo/integration-analytics`)
- **What:** Plausible Analytics (privacy-friendly, no cookie banner needed) or Google Analytics 4. Auto-inject tracking script. Dashboard module: visitor chart, top pages, referrers, real-time visitors.
- **Why:** Business owners need to see if their site is working. Analytics is the proof.
- **Components:** `<AnalyticsScript>` (head injection), `<AnalyticsDashboard>` (embed)
- **Effort:** S (2-3 days)
- **Depends on:** Integration registry.
- **Status:** TODO

#### P1 — CMS Integration (`@velo/integration-cms`)
- **What:** Content editing via dashboard forms. Maps to the existing content type system. Edit content.json fields through a generated form UI (derived from TypeScript types/Zod schemas). Media upload to Supabase Storage. Preview changes before publish.
- **Why:** Business owners can't edit .ts files. Visual content editing is table stakes.
- **Components:** `<ContentEditor>`, `<MediaLibrary>`, `<PreviewFrame>`
- **Routes:** GET/PUT /content/:siteId, POST /media/upload
- **Effort:** XL (2-3 weeks) — this is the most complex integration
- **Depends on:** Integration registry, content type codegen.
- **Status:** TODO

#### P2 — WhatsApp Integration (`@velo/integration-whatsapp`)
- **What:** WhatsApp Business chat widget embedded on site. Click-to-chat with pre-filled message. Business hours awareness (show/hide based on operating hours). Dashboard module: WhatsApp number config, default message, business hours.
- **Why:** WhatsApp is the #1 business communication channel in SE Asia, LATAM, and parts of Europe. Zero API cost (uses wa.me links).
- **Components:** `<WhatsAppWidget>`, `<WhatsAppButton>`
- **Effort:** S (1-2 days)
- **Depends on:** Integration registry.
- **Status:** TODO

### Phase 3.2 — Dashboard Modules

#### P1 — Site Overview Module
- **What:** Dashboard landing page showing: site health score (from QA pipeline), visitor analytics (from analytics integration), recent form submissions, active integrations status, deployment status. Card-based layout.
- **Why:** The first thing a business owner sees. Must answer: "Is my site working?"
- **Effort:** M (3-5 days)
- **Depends on:** Analytics + Forms + QA integrations.
- **Status:** TODO

#### P1 — Content Editor Module
- **What:** Visual form-based editor for site content. Auto-generates form fields from content types (text inputs, image uploaders, array editors for lists). Live preview in iframe. Publish button triggers rebuild + deploy.
- **Why:** THE core feature that makes this a product vs a CLI tool.
- **Effort:** XL (2-3 weeks) — shares work with CMS integration
- **Depends on:** CMS integration.
- **Status:** TODO

#### P1 — Integration Manager Module
- **What:** Grid of available integrations with enable/disable toggles. Configuration panel per integration (rendered from integration's dashboardModule export). Status indicators (connected/error/pending).
- **Why:** The control center for business functionality. Where integrations become tangible.
- **Effort:** M (3-5 days)
- **Depends on:** Integration registry, at least 2 integrations built.
- **Status:** TODO

#### P2 — QA Reports Module
- **What:** Scheduled QA runs (weekly/monthly) using existing `@velo/qa` pipeline. Report history with health score trend. Detail view for each audit (Lighthouse, a11y, links, meta). Email notifications when health drops below threshold.
- **Why:** Your QA consulting background becomes a product feature. Automated quality monitoring as a service.
- **Effort:** M (3-5 days)
- **Depends on:** QA pipeline (already built), Dashboard shell.
- **Status:** TODO

#### P2 — Billing Module
- **What:** Subscription management for Velo itself (not client's customers). Uses Stripe for global billing or Xendit for Indonesian billing (IDR pricing). Plan tiers: Free (1 site, 3 integrations), Pro ($49/mo or Rp 499k/mo, unlimited sites + integrations), Agency ($199/mo or Rp 1.99M/mo, white-label + client management). Usage dashboard, invoice history, plan upgrade/downgrade.
- **Why:** This is how Velo makes money. Indonesian pricing makes it accessible to local market.
- **Effort:** L (1-2 weeks)
- **Depends on:** Payment integration.
- **Status:** TODO

#### P2 — Settings Module
- **What:** Site settings: name, domain, template, theme overrides. Team management: invite members, assign roles (Owner/Admin/Editor). Danger zone: delete site, export data. Profile: account settings, password change.
- **Why:** Standard SaaS settings. Required for multi-user access.
- **Effort:** M (3-5 days)
- **Depends on:** Auth + Database.
- **Status:** TODO

### Phase 3.3 — Deployment Pipeline

#### P1 — Vercel Deployment API
- **What:** Programmatic site deployment via Vercel REST API. Create project, deploy from monorepo, assign custom domain, manage environment variables. Triggered from dashboard "Deploy" button or auto-deploy on content change.
- **Why:** Business owners can't use CLI. One-click deploy from dashboard is the experience.
- **Effort:** L (1-2 weeks)
- **Depends on:** Dashboard shell, at least one integration working end-to-end.
- **Status:** TODO

#### P2 — Custom Domain Management
- **What:** Dashboard UI for adding custom domains. DNS verification flow. Auto-SSL via Vercel. Domain status monitoring (propagation, SSL certificate health).
- **Why:** Every business wants their own domain. "yourbusiness.com" not "yourbusiness.velo.app"
- **Effort:** M (3-5 days)
- **Depends on:** Vercel deployment API.
- **Status:** TODO

#### P2 — Auto-Deploy on Content Change
- **What:** When content is edited via CMS/dashboard, automatically trigger a rebuild + deploy to Vercel. Incremental Static Regeneration (ISR) for near-instant updates without full rebuild. Deploy status shown in dashboard.
- **Why:** "Edit → See it live in 10 seconds" is the experience that sells.
- **Effort:** M (3-5 days)
- **Depends on:** CMS integration, Vercel deployment API.
- **Status:** TODO

### Phase 3.4 — Vertical Deepening (per template)

#### P2 — Restaurant Vertical (Ember)
- **What:** Online ordering system (menu → cart → Stripe checkout → order confirmation), menu management CMS (categories, items, prices, dietary tags, photos), reservation/booking system (date/time/party size → Google Calendar), Google Reviews widget (display aggregated reviews).
- **Why:** Restaurant owners pay $100-300/mo for these individually. Bundled = massive value.
- **Effort:** XL (3-4 weeks)
- **Depends on:** Stripe, CMS, Google Calendar integrations.
- **Status:** TODO

#### P2 — Wellness Vertical (Serenity)
- **What:** Appointment booking (service → practitioner → time slot → payment), practitioner profile management, service catalog CMS, client intake forms, automated appointment reminders (email/WhatsApp).
- **Why:** Wellness businesses revolve around appointments. Booking system = core infrastructure.
- **Effort:** XL (3-4 weeks)
- **Depends on:** Stripe, Forms, Google Calendar integrations.
- **Status:** TODO

#### P2 — Real Estate Vertical (Haven)
- **What:** Property listing management (CRUD + photos + details), lead capture per listing, virtual tour embed (Matterport/YouTube), neighborhood data display, agent profile management.
- **Why:** Real estate agents pay $200-500/mo for IDX sites. Velo can undercut with better design.
- **Effort:** L (2-3 weeks)
- **Depends on:** CMS, Forms integrations.
- **Status:** TODO

#### P2 — SaaS Vertical (Prism)
- **What:** Stripe billing portal for SaaS subscriptions, feature comparison table (dynamic from config), signup flow with Stripe checkout, customer dashboard embed, usage tracking display.
- **Why:** SaaS founders need billing + landing page. This is a Stripe Atlas competitor for the frontend.
- **Effort:** L (2-3 weeks)
- **Depends on:** Stripe integration.
- **Status:** TODO

#### P3 — Agency Vertical (Nexus)
- **What:** Project portfolio CMS (case studies with metrics), lead capture with CRM integration (HubSpot/Pipedrive), team member management, service page builder, proposal/quote request form.
- **Why:** Agencies need lead generation + portfolio. The irony: agencies are also Velo's distribution channel.
- **Effort:** L (2-3 weeks)
- **Depends on:** CMS, Forms integrations.
- **Status:** TODO

#### P3 — Sportswear/E-commerce Vertical (Velocity)
- **What:** Product catalog with category filtering, shopping cart, Stripe checkout, order management dashboard, inventory tracking (basic), size/color variants.
- **Why:** E-commerce is the largest vertical by revenue. Even basic capability here is valuable.
- **Effort:** XL (3-4 weeks)
- **Depends on:** Stripe, CMS integrations.
- **Status:** TODO

### Phase 3.5 — Growth & Monetization

#### P2 — Template Marketplace
- **What:** Public marketplace where third-party designers can list templates. Submission flow, review process, revenue sharing. Built on existing gallery architecture.
- **Why:** Network effects. More templates = more verticals = more customers = more template designers.
- **Effort:** XL (3-4 weeks)
- **Depends on:** Dashboard, billing, at least 3 verticals live.
- **Status:** TODO

#### P3 — White-label / Agency Mode
- **What:** Agencies can reskin the dashboard with their branding. Client management (agency manages multiple clients' sites). Bulk operations, white-label QA reports, custom domain for dashboard (agency.clientportal.com).
- **Why:** Agencies become distribution partners. They bring clients, you provide infrastructure.
- **Effort:** XL (4-6 weeks)
- **Depends on:** Full dashboard + billing.
- **Status:** TODO

#### P3 — A/B Testing Infrastructure
- **What:** Split testing for content variants (headlines, CTAs, images). Traffic splitting via edge middleware. Conversion tracking via analytics integration. Dashboard module showing variant performance.
- **Why:** Data-driven optimization. "Your variant B headline converts 23% better." Advanced feature for power users.
- **Effort:** XL (3-4 weeks)
- **Depends on:** Analytics integration, CMS, deployment pipeline.
- **Status:** TODO

#### P3 — AI Features (Phase 2 expansion)
- **What:** AI receptionist chatbot (trained on business content), AI-powered SEO suggestions, AI content refresh ("rewrite this section for summer promotion"), AI-generated social media posts from site content.
- **Why:** AI is the differentiator. This is what makes Velo 10x better than Squarespace.
- **Effort:** XL (4-6 weeks)
- **Depends on:** CMS, content system, AI content writer (already built).
- **Status:** TODO

## Security Fixes (do alongside Phase 1)

- [x] Re-validate appName in generate() and eject() (not just prompts) ✅
- [x] Add .env* to eject exclusion list ✅
- [x] Add CSP headers to generated next.config.ts ✅
- [ ] Register @velo/ npm org to prevent namespace squatting

## Bug Fixes (do alongside Phase 1)

- [x] locales=[] causes "undefined" defaultLocale — validate before generateI18n() ✅
- [x] sections=[] generates empty app — warn or reject ✅
- [x] discoverSections() crashes on malformed package.json — catch + skip with warning ✅
- [x] eject silently copies .env files — exclude sensitive files ✅
- [x] eject rmSync on existing output dir — add confirmation prompt ✅ (now throws error instead of silently deleting)
- [x] .next/ and node_modules/ in generated apps should be in .gitignore ✅
