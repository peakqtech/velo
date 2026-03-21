# Plan Review: PeakQ Website Rebuild

**Reviewed:** 2026-03-18
**Verdict:** Mostly solid. 2 blockers, 5 warnings, 4 suggestions.

---

## BLOCKER

### B1. Phantom `@velo/types` package dependency
The plan lists `"@velo/types": "workspace:*"` in `package.json` (Task 1, Step 1). No such package exists in the monorepo — `packages/` contains `infra/`, `sections/`, and `integrations/` but no `types` package. The build will fail at `pnpm install`.

**Fix:** Remove `@velo/types` from the dependency list. If specific types are needed later, import them from the packages that define them (e.g., `@velo/integration-forms` exports its own types).

### B2. `@velo/seo-engine` pulls in `@velo/db` and `@anthropic-ai/sdk`
The plan's tech stack says "consume `@velo/seo-engine`" but never lists `@velo/db` or Prisma setup. The `@velo/seo-engine` package depends on `@velo/db` which requires a database connection. Adding it as a dependency without DB configuration will cause runtime failures.

**Fix:** Either (a) defer `@velo/seo-engine` integration to a later phase and handle metadata manually in Task 10, or (b) add a task between Task 1 and Task 2 to set up the DB connection and Prisma client. Option (a) is recommended for a Day 1 launch since the plan already hardcodes metadata in `layout.tsx` and each page.

---

## WARNING

### W1. `package.json` diverges from monorepo conventions
The reference app `tropica-template` uses pinned versions (`"next": "16.1.6"`, `"react": "19.2.3"`) with no `--turbopack` flag in `dev`. The plan uses caret ranges (`"next": "^16.0.0"`) and adds `--turbopack`. This will cause version drift across apps.

**Fix:** Match `tropica-template` exactly: pinned versions for `next`, `react`, `react-dom`. Keep `--turbopack` if intentional, but document the decision.

### W2. `tsconfig.json` has wrong `jsx` setting
The plan specifies `"jsx": "preserve"` but `tropica-template` uses `"jsx": "react-jsx"`. The plan also omits `.next/dev/types/**/*.ts` from the `include` array.

**Fix:** Copy `tropica-template/tsconfig.json` exactly and only modify `paths` if needed.

### W3. `tailwind.config.ts` file may be unnecessary
The reference app `tropica-template` has no `tailwind.config.ts` — it uses Tailwind v4's CSS-based config via `@import "tailwindcss"` in `globals.css` plus a `postcss.config.mjs`. The plan lists `tailwind.config.ts` in the file structure and as Task 1 Step 5, but Step 5's text correctly says "check what other apps use." The file tree and the instruction conflict.

**Fix:** Remove `tailwind.config.ts` from the file structure. Add `postcss.config.mjs` instead (copy from `tropica-template`). Step 5 text is fine — just update the file tree to match.

### W4. `templates/page.tsx` is a client component but exports `metadata`
Task 5 makes `/templates` a `"use client"` component. Task 10 then says to add `export const metadata` to all pages including templates. You cannot export `metadata` from a client component — Next.js requires it in server components.

**Fix:** Split the templates page: server component for the page shell + metadata, client component wrapper for the filter/grid portion. The plan's Task 5 Step 4 even acknowledges this ("use a client wrapper") but the code example makes the entire page a client component.

### W5. No `postcss.config.mjs` in file structure or Task 1
`tropica-template` has a `postcss.config.mjs` that Tailwind v4 requires. The plan omits it entirely.

**Fix:** Add creation of `postcss.config.mjs` to Task 1. Copy from `tropica-template`.

---

## SUGGESTION

### S1. Missing `@types/react-dom` in devDependencies
`tropica-template` includes `"@types/react-dom": "^19"`. The plan's `package.json` omits it.

### S2. Task 9 is too large (5 pages + 1 component)
Task 9 bundles about, contact, blog, get-started, and lead-capture-form into one task. Each page has distinct concerns (form validation, search params, server actions). Consider splitting into two tasks: (a) about + blog (simple static pages), (b) contact + get-started + lead-capture-form (form-heavy, need validation logic).

### S3. Template gallery should note iframe CORS limitations
The spec mentions "live iframe previews" for template cards, but the plan uses gradient placeholders with icons. This is fine for Day 1, but the plan should explicitly note this is a deliberate simplification so a future implementer does not try to add iframes without checking CORS/X-Frame-Options on deployed template apps.

### S4. No `framer-motion` or `lucide-react` in tropica-template
The reference app has neither of these dependencies. The plan adds both as Day 1 deps. This is fine architecturally (PeakQ is a different type of site), but the implementing engineer should know these are new additions to the monorepo app pattern, not established conventions.

---

## What the plan does well

- Clear task ordering with correct dependency chain (scaffold -> data -> shell -> sections -> pages -> polish)
- Every spec route is accounted for with a corresponding task
- Code examples are concrete and copy-pastable
- Each task ends with a verification step and a commit
- `generateStaticParams` usage for services/[slug] is correct for Next.js 16
- The `params: Promise<{ slug: string }>` pattern matches Next.js 16's async params API
- Sensible use of `"use client"` only where needed (filter, forms)
