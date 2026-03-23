# Design Spec Review: PeakQ Website Rebuild

**Spec:** `2026-03-18-peakq-website-rebuild-design.md`
**Reviewer:** Claude (Senior Code Reviewer)
**Date:** 2026-03-18

---

## Summary

The spec is well-structured with clear messaging, a logical conversion funnel, and sound monorepo integration strategy. The architecture decision to consume `@velo/` packages is validated by the existing codebase. However, there are several gaps between what the spec assumes exists and what actually exists in the monorepo, plus internal contradictions that would block or confuse implementation.

---

## BLOCKER Issues

### B1. Missing Generic Sections — Most Required Sections Do Not Exist

**Spec claims (line 67):** Reuse `@velo/` sections: hero, features, pricing, testimonials, FAQ, footer, contact, stats, team.

**Reality:** The `packages/sections/` directory contains mostly template-specific sections. The only generic sections are `hero`, `footer`, `testimonials`, and `blog`. The rest are namespaced to specific templates:

- `features` -- does not exist (only `prism-features`)
- `pricing` -- does not exist (only `prism-pricing`)
- `FAQ` -- does not exist (only `prism-faq`)
- `contact` -- does not exist (only `nexus-contact`)
- `stats` -- does not exist (only `nexus-stats`)
- `team` -- does not exist (only `nexus-team`)

**Impact:** Either the PeakQ app must depend on Prism/Nexus-specific sections (leaking template branding), or generic versions of these 6 sections must be created first.

**Recommendation:** Add a prerequisite task: "Extract generic versions of features, pricing, FAQ, contact, stats, and team sections from existing template-specific implementations." This should be scoped and estimated before PeakQ work begins.

### B2. `/get-started` Page Is Listed But Explicitly Out of Scope

**Spec contradiction:** Line 99 lists `/get-started` as a primary page with "Template selection -> account creation -> setup wizard." Line 260 states "Get-started onboarding wizard (requires auth + template provisioning)" is out of scope.

**Impact:** An implementer would not know whether to build this page or skip it. If skipped, the conversion funnel is broken (multiple CTAs point to `/get-started`).

**Recommendation:** Either (a) remove `/get-started` from the primary pages table and change all CTAs to point to `/contact` instead, or (b) define a minimal v1 of `/get-started` that captures intent without requiring auth (e.g., a form that collects template preference + contact info, effectively a specialized contact form).

### B3. `/blog` Page Is Listed But CMS Integration Is Out of Scope

**Spec contradiction:** Line 109 lists `/blog` powered by `@velo/integration-cms`. Line 259 states "Blog content (requires @velo/integration-cms setup)" is out of scope.

**Impact:** Same ambiguity as B2. Page is in the route table but explicitly deferred.

**Recommendation:** Remove `/blog` from the primary route table for v1, or define a placeholder page that says "Coming soon" with an email capture.

---

## WARNING Issues

### W1. Page Count Mismatch

**Spec claims (line 246):** "All 10 pages are live and functional."

**Actual route count:** `/` + `/templates` + `/features` + `/pricing` + `/get-started` + `/services` + `/services/[slug]` + `/about` + `/contact` + `/blog` = 10 routes, but `/services/[slug]` is a dynamic route representing 3 pages (QA testing, custom dev, managed services), making the real count 12. If `/get-started` and `/blog` are out of scope (per B2/B3), the count drops to 8.

**Recommendation:** Clarify the exact page count for v1 launch after resolving B2 and B3.

### W2. Package Namespace Inconsistency in Spec

**Spec lists (lines 53-59):** `@velo/integration-analytics`, `@velo/integration-cms`, `@velo/integration-forms`, `@velo/integration-payments`, `@velo/integration-whatsapp`.

**Actual package names:** The integrations packages live under `packages/integrations/{analytics,cms,forms,payments,whatsapp}` and are named `@velo/integration-analytics`, `@velo/integration-cms`, etc. in their package.json files. This is consistent.

However, the spec also references `sections/` at line 60 as if it is a single package. In reality, `packages/sections/` is a directory of individual section packages (e.g., `@velo/hero`, `@velo/footer`). The spec should list specific section packages that will be consumed.

**Recommendation:** Replace the generic `sections/` reference with the specific section package names that PeakQ will consume.

### W3. Pricing Ranges Inconsistent Between Sections

**Homepage Section 4 (line 142-145):** Fixed prices -- Starter $99, Growth $499, Scale $999, Enterprise Custom.

**Pricing Model table (lines 183-186):** Ranges -- Starter $99-199, Growth $499-799, Scale $999-1,499, Enterprise $2,000-5,000.

**Impact:** An implementer would not know which to display. The homepage shows fixed prices; the pricing page table shows ranges.

**Recommendation:** This may be intentional (simplified on homepage, detailed on pricing page), but it should be explicitly called out. Add a note: "Homepage pricing cards show the low end of each range. The /pricing page shows the full range."

### W4. Template App Names Do Not Match Spec Listing

**Spec lists (line 43-51):** `lexis-template`, `serenity-template`, etc.

**Actual directory:** `velocity-template` also exists in the apps directory (likely the base/demo template), but is not listed in the spec's architecture diagram.

**Impact:** Minor -- the template gallery might miss one app or include an unexpected one.

**Recommendation:** Add `velocity-template` to the architecture diagram or note that it is excluded from the gallery.

### W5. Live Iframe Previews Require Deployed Template URLs

**Spec assumes (line 210):** Template cards iframe deployed apps (e.g., `tropica-template.vercel.app`).

**Gap:** The spec does not define where these deployment URLs are stored or how they are resolved. There is no configuration file or database schema referenced for mapping template names to their deployed URLs.

**Recommendation:** Define a data source for template metadata (name, category, deployed URL, capabilities). This could be a simple JSON/TS config file in `apps/peakq/` or a database table via `@velo/db`.

---

## SUGGESTION Issues

### S1. Industry-to-Template Mapping Not Defined

The Industry Showcase (Section 2) lists 7 industries: Restaurants, Real Estate, Wellness, Medical, E-Commerce, Legal, Creative. The templates gallery maps templates to industry categories. But there is no explicit mapping of which template belongs to which industry.

**Recommendation:** Add a mapping table, e.g.:
- Restaurants: tropica, ember
- Real Estate: haven
- Wellness: serenity
- Medical: medica
- E-Commerce: commerce
- Legal: lexis, nexus
- Creative: prism, forma

### S2. No Mobile/Responsive Design Notes

The spec defines desktop layouts (3-column grid, stacked sections) but says nothing about mobile breakpoints, mobile navigation, or responsive behavior.

**Recommendation:** Add a brief responsive strategy section, even if it is just "Follow Tailwind responsive defaults with mobile-first approach."

### S3. No Error/Loading States Defined

The spec does not describe what happens when iframe previews fail to load, when form submissions fail, or when pages are loading.

**Recommendation:** Add a brief UX states section covering loading, error, and empty states for key interactions.

### S4. No Accessibility Requirements

No mention of WCAG compliance, keyboard navigation, screen reader support, or color contrast requirements.

**Recommendation:** Add a brief accessibility section, even if minimal (e.g., "Target WCAG 2.1 AA compliance").

### S5. Consider a Shared Template Metadata Config

Multiple pages need template metadata (gallery, get-started, industry showcase). Rather than hardcoding in each page, consider a single `templates.config.ts` that exports the canonical list with industry, capabilities, and preview URLs.

---

## What Was Done Well

1. **Living proof narrative** is compelling -- the site consuming its own platform packages is an excellent trust signal.
2. **Conversion funnel** (Hero -> Showcase -> Stack -> Pricing -> CTA) is well-designed and follows proven SaaS patterns.
3. **Phased package dependencies** (Day 1 vs Later) show pragmatic scoping.
4. **"No exact template count" rule** is smart -- avoids the number going stale as templates are added.
5. **Migration comparison table** clearly communicates what changes from the current site.
6. **Architecture alignment** with the existing monorepo is correct -- package names, structure, and tech stack all match.

---

## Verdict

**Not ready for implementation.** The 3 BLOCKER issues must be resolved first:
- B1 requires either creating 6 generic sections or explicitly planning to adapt template-specific ones
- B2 and B3 require deciding what to do with pages that are both listed and out-of-scope

After resolving blockers, the 5 warnings should be addressed to prevent implementation ambiguity. The suggestions are quality improvements that can be addressed during implementation.
