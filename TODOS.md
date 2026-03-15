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

### P2 — AI Content Writer
- **What:** After create-app generates stubs, offer AI pass to fill realistic content based on business type and locale.
- **Why:** Transforms "scaffolding tool" into "site builder." Core to AI+templating thesis.
- **Effort:** L (1 week)
- **Depends on:** Zod validation (content schemas).
- **Status:** TODO

### P2 — Template Gallery / Showroom Site
- **What:** `apps/gallery/` that displays all templates side-by-side with live previews. Client-facing demo tool.
- **Why:** The gallery IS your sales tool.
- **Effort:** M (2-4 hours)
- **Depends on:** At least 3 templates working.
- **Status:** TODO

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

## Phase 3: Platform (Weeks 17+)

### Client Dashboard / Admin UI
### Template Marketplace
### A/B Testing Infrastructure
### White-label / Multi-tenant SaaS

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
