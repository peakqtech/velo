# Velocity Monorepo — Design Spec

**Date:** 2026-03-13
**Sub-project:** 2 of 2 (Monorepo extraction from Velocity template)
**Status:** Design approved

## Overview

Extract the Velocity cinematic website template into a Turborepo monorepo with shared packages. Each section becomes an installable package (`@velocity/hero`, `@velocity/product-grid`, etc.) and shared infrastructure (scroll engine, animations, i18n) becomes its own package. A CLI scaffolder creates new client apps by selecting sections. An eject tool extracts any app as a standalone git repo.

The existing `velocity-template` becomes the reference app inside `apps/`. Any app can serve as a template for scaffolding new clients, enabling vertical-specific starting points (athletic, restaurant, fashion, etc.) over time.

## Tech Stack

- **Monorepo tool:** Turborepo (task orchestration, caching)
- **Package manager:** pnpm (workspace protocol for linking)
- **Framework:** Next.js (App Router) — each app is a Next.js project
- **Package build:** No build step — raw TSX source, transpiled by consuming apps via `transpilePackages`
- **CLI tools:** Node.js scripts run with `tsx`

## Directory Structure

```
velocity-monorepo/
├── apps/
│   ├── velocity-template/        # Reference app (migrated from current template)
│   ├── acme-corp/                # Example client app (scaffolded)
│   └── ...                       # More client apps
│
├── packages/
│   ├── sections/                 # Section packages (the product)
│   │   ├── hero/                 # @velocity/hero
│   │   ├── product-showcase/     # @velocity/product-showcase
│   │   ├── brand-story/          # @velocity/brand-story
│   │   ├── product-grid/         # @velocity/product-grid
│   │   ├── testimonials/         # @velocity/testimonials
│   │   └── footer/               # @velocity/footer
│   │
│   └── infra/                    # Shared infrastructure packages
│       ├── scroll-engine/        # @velocity/scroll-engine
│       ├── animations/           # @velocity/animations
│       ├── motion-components/    # @velocity/motion-components
│       ├── i18n/                 # @velocity/i18n
│       ├── types/                # @velocity/types
│       └── ui/                   # @velocity/ui (21st.dev components)
│
├── tools/
│   ├── create-app/               # CLI scaffolder
│   └── eject/                    # Standalone extraction tool
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Dependency Rules

Three layers with strict dependency direction:

1. **Apps** import section packages + infra packages
2. **Section packages** import infra packages only
3. **Infra packages** import `@velocity/types` only (or nothing)

No circular dependencies. No cross-section imports. Apps are the composition layer.

## Package Design

### Section Package Structure

Every section package follows an identical internal layout:

```
packages/sections/hero/
├── package.json          # name: @velocity/hero
├── src/
│   ├── Hero.tsx          # Component (accepts content + variant props)
│   ├── hero.animation.ts # ScrollConfig export
│   ├── hero.types.ts     # Props, content schema, variant types
│   └── index.ts          # Public API
└── __tests__/
    └── hero.test.tsx
```

Each package exports:
- The component (e.g., `Hero`)
- The scroll animation config (e.g., `heroScrollConfig`)
- TypeScript types (content interface, props interface)

### Section Package `package.json`

```json
{
  "name": "@velocity/hero",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0",
    "gsap": "^3.12.0",
    "framer-motion": "^12.0.0"
  },
  "dependencies": {
    "@velocity/types": "workspace:*",
    "@velocity/scroll-engine": "workspace:*",
    "@velocity/animations": "workspace:*",
    "@velocity/motion-components": "workspace:*"
  }
}
```

No build step. Raw TSX source exported via `main` and `types` pointing to `src/index.ts`. Consuming Next.js apps transpile the package.

### Infra Package Structure

Infra packages follow the same pattern but without animation configs:

```
packages/infra/scroll-engine/
├── package.json          # name: @velocity/scroll-engine
├── src/
│   ├── scroll-engine.ts  # useScrollEngine hook + ScrollConfig interface
│   └── index.ts          # Public API
└── __tests__/
    └── scroll-engine.test.ts
```

### `@velocity/types` Package

Central type definitions shared across all packages:

```
packages/infra/types/
├── package.json          # name: @velocity/types
└── src/
    ├── content.ts        # HeroContent, ProductGridContent, etc.
    ├── theme.ts          # ThemeContract — documents required CSS variables
    └── index.ts          # Re-exports all types
```

The `ThemeContract` interface documents the CSS custom properties that section packages expect apps to define (e.g., `--color-primary`, `--font-display`, `--spacing-section`). This is documentation, not enforcement — the actual contract is CSS.

### `locale-switcher.tsx` Placement

The existing `components/locale-switcher.tsx` is app-local — it stays in each app's `components/` directory. It's not a shared package because it uses `next/navigation` hooks that are app-specific. The scaffolder copies it from the source app.

### `content.config.ts` Placement

The existing `content/content.config.ts` (locale registry) stays app-local. Each app defines its own supported locales. The scaffolder generates this file based on the selected locales during scaffolding.

### `@velocity/ui` Package

Initially empty. This is a slot for 21st.dev / Magic MCP components to be installed into as the component library grows. No extraction work needed during migration — the package is created with a bare `index.ts` and populated over time.

## Customization Model

Three tiers of customization, from simple to deep:

### Tier 1: Theme (CSS Custom Properties)

Each app defines brand colors, fonts, and spacing in its `globals.css`:

```css
:root {
  --color-primary: #ff4500;
  --color-secondary: #1a1a2e;
  --color-foreground: #ffffff;
  --font-display: "Oswald";
  --font-body: "Inter";
  --spacing-section: 120px;
}
```

Section packages consume these via Tailwind utility classes (`text-foreground`, `bg-primary`, `font-display`). Tailwind v4's CSS-first `@theme inline {}` block in each app maps these variables to Tailwind tokens. No shared Tailwind config package needed.

### Tier 2: Variant Props

Section components accept variant props for layout and behavior differences:

```tsx
<Hero
  content={heroContent}
  layout="split"           // "centered" | "split" | "minimal"
  textAlign="left"
  overlayStyle="gradient"
  className="custom-hero"  // escape hatch for CSS overrides
/>

<ProductGrid
  content={gridContent}
  columns={4}              // default: 3
  showFilters={false}
/>
```

Each section defines its own variant types. Variants are additive — the default behavior works without any variant props.

### Tier 3: Custom Section (Escape Hatch)

When props + theme aren't enough, the client app writes its own section using shared infra:

```tsx
// apps/acme-corp/sections/hero/CustomHero.tsx
import { heroScrollConfig } from "@velocity/hero";
import { AnimatedText } from "@velocity/motion-components";
import { useScrollEngine } from "@velocity/scroll-engine";

export function CustomHero({ content }) {
  // Reuse scroll animation, build completely custom UI
  return <section className="hero-section">...</section>;
}
```

The app's `page-client.tsx` swaps in the custom section. Scroll configs are still reusable even when the component is custom.

## CLI Scaffolder (`create-app`)

### Usage

```bash
# Scaffold from default template (velocity-template)
pnpm create-app new-client

# Scaffold from a specific app as template
pnpm create-app new-client --from acme-corp
```

### Interactive Flow

1. Prompt for app name (kebab-case, validated)
2. Select source app (`--from` flag or pick from list of apps)
3. Select sections to include (checkbox list of available `@velocity/*` section packages)
4. Select locales (checkbox list, default: `en`)
5. Generate the app:
   - Copy source app structure
   - Wire selected sections into `page-client.tsx`
   - Register selected section scroll configs
   - Stub content files for selected locales
   - Update `package.json` with only selected `@velocity/*` dependencies
   - Add app to workspace

### What the Scaffolder Generates

```
apps/new-client/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Server component (metadata, fonts)
│   │   ├── page.tsx            # Server component (content loading)
│   │   └── page-client.tsx     # Client component (sections + scroll engine)
│   ├── globals.css             # Tailwind v4 theme + CSS vars (from source app)
│   └── middleware.ts           # Locale routing
├── content/
│   └── en/
│       └── new-client.ts       # Stubbed content matching selected sections
├── package.json                # Only selected @velocity/* deps
└── next.config.ts              # transpilePackages for @velocity/*
```

## Eject Tool

### Usage

```bash
pnpm eject acme-corp
# Output: ./ejected/acme-corp/ (standalone Next.js project)
```

### What Eject Does

1. Copies the app directory to `./ejected/<app-name>/`
2. Resolves all `@velocity/*` imports — copies package `src/` into local directories
3. Rewrites import paths (`@velocity/hero` → `./sections/hero`)
4. Merges `package.json` dependencies from all consumed packages (dedupes)
5. Copies the app's `globals.css` and Tailwind config as-is
6. Removes `turbo.json`, workspace references, and monorepo-specific config
7. Generates a standalone `tsconfig.json` with `@/*` path alias
8. Initializes a fresh git repo with an initial commit
9. Runs `pnpm install && pnpm build` to verify the ejected app works

### Output Structure

```
ejected/acme-corp/
├── app/                    # Unchanged from monorepo
├── sections/               # Inlined from @velocity/sections/*
│   ├── hero/
│   ├── product-grid/
│   └── footer/
├── lib/                    # Inlined from @velocity/infra/*
│   ├── scroll-engine.ts
│   ├── animations.ts
│   ├── i18n.ts
│   └── types.ts
├── components/
│   └── motion/             # Inlined from @velocity/motion-components
├── content/
├── package.json            # Standalone deps, no workspace: references
├── tsconfig.json
└── next.config.ts          # No transpilePackages needed (all local)
```

The ejected app has zero `@velocity/*` dependencies. It's a clean Next.js project that any developer can maintain.

## Turborepo Configuration

### `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/sections/*"
  - "packages/infra/*"
  - "tools/*"
```

## App `next.config.ts`

Each app configures `transpilePackages` to compile workspace packages:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@velocity/hero",
    "@velocity/product-showcase",
    "@velocity/brand-story",
    "@velocity/product-grid",
    "@velocity/testimonials",
    "@velocity/footer",
    "@velocity/scroll-engine",
    "@velocity/animations",
    "@velocity/motion-components",
    "@velocity/i18n",
    "@velocity/types",
    "@velocity/ui",
  ],
};

export default nextConfig;
```

The scaffolder generates this list based on selected sections and their transitive dependencies.

## Migration Path

The existing `velocity-template` at `~/Personal/monorepo/velocity-template` becomes the reference app. Migration steps:

1. Initialize monorepo root (Turborepo, pnpm workspace, root `package.json`)
2. Create `packages/infra/*` by extracting from `velocity-template/lib/` and `velocity-template/components/`
3. Create `packages/sections/*` by extracting from `velocity-template/sections/`
4. Migrate `velocity-template` into `apps/velocity-template` — update imports from `@/lib/*` to `@velocity/*` packages
5. Verify: `turbo build` and `turbo test` pass
6. Build `tools/create-app` scaffolder
7. Build `tools/eject` extraction tool
8. Test end-to-end: scaffold a new app, customize it, eject it

## Testing Strategy

| Layer | Tool | What it covers |
|-------|------|---------------|
| Package unit tests | Vitest | Each `@velocity/*` package tested in isolation |
| App integration tests | Vitest + RTL | Apps test section composition and content rendering |
| Visual regression | Playwright | Screenshot comparisons across apps |
| Scaffolder tests | Vitest | Verify generated app structure, imports, content stubs |
| Eject tests | Vitest | Verify ejected app builds and runs standalone |
| Cross-app build | Turborepo | `turbo build` validates all apps and packages compile |

## Dependencies

### Root `package.json` (devDependencies only)

- `turbo`
- `typescript`
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `eslint`
- `prettier`
- `tsx` (for running CLI tools)

### Peer Dependencies (provided by apps)

- `next`, `react`, `react-dom`
- `gsap` (with ScrollTrigger)
- `framer-motion`
- `lenis`
- `tailwindcss`

These are peer dependencies of section and infra packages, installed once per app.

## Future Considerations

- **New section types:** Add to `packages/sections/` following the same structure. The scaffolder auto-discovers available sections.
- **21st.dev / Magic MCP components:** Installed into `@velocity/ui` as shared primitives. Sections import from `@velocity/ui` rather than directly from 21st.dev packages.
- **Private npm registry:** If the eject-based handoff model isn't sufficient for a client who wants ongoing updates, packages can be published to a private registry (npm, GitHub Packages). This is not needed initially.
- **CI/CD:** Turborepo's `--filter` flag enables building/testing only affected packages on PR. Pairs well with GitHub Actions.
