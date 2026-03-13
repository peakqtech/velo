# Velocity Monorepo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the Velocity template into a Turborepo monorepo with shared `@velocity/*` packages, a CLI scaffolder, and an eject tool.

**Architecture:** Restructure the existing velocity-template in-place. Create `packages/` for shared code (infra + sections), move the app into `apps/velocity-template`, update all imports to use `@velocity/*` workspace packages. Build CLI tools in `tools/`.

**Tech Stack:** Turborepo, pnpm workspaces, Next.js 16, TypeScript, tsx (for CLI tools)

---

## Chunk 1: Monorepo Root & Types Package

### Task 1: Initialize Monorepo Root

**Files:**
- Modify: `velocity-template/package.json` (convert to monorepo root)
- Create: `velocity-template/pnpm-workspace.yaml`
- Create: `velocity-template/turbo.json`

- [ ] **Step 1: Create pnpm-workspace.yaml**

File: `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/sections/*"
  - "packages/infra/*"
  - "tools/*"
```

- [ ] **Step 2: Create turbo.json**

File: `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
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

- [ ] **Step 3: Update root package.json to monorepo root**

Replace the current `package.json` with a monorepo root config. The app-specific deps will move to `apps/velocity-template/package.json` in a later task.

File: `package.json`

```json
{
  "name": "velocity-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "create-app": "tsx tools/create-app/src/index.ts",
    "eject": "tsx tools/eject/src/index.ts"
  },
  "devDependencies": {
    "turbo": "^2",
    "typescript": "^5",
    "tsx": "^4"
  },
  "packageManager": "pnpm@10.12.1"
}
```

- [ ] **Step 4: Create directory structure**

```bash
mkdir -p packages/infra/types/src
mkdir -p packages/infra/scroll-engine/src
mkdir -p packages/infra/animations/src
mkdir -p packages/infra/motion-components/src
mkdir -p packages/infra/i18n/src
mkdir -p packages/infra/ui/src
mkdir -p packages/sections/hero/src
mkdir -p packages/sections/hero/__tests__
mkdir -p packages/sections/product-showcase/src
mkdir -p packages/sections/product-showcase/__tests__
mkdir -p packages/sections/brand-story/src
mkdir -p packages/sections/brand-story/__tests__
mkdir -p packages/sections/product-grid/src
mkdir -p packages/sections/product-grid/__tests__
mkdir -p packages/sections/testimonials/src
mkdir -p packages/sections/testimonials/__tests__
mkdir -p packages/sections/footer/src
mkdir -p packages/sections/footer/__tests__
mkdir -p tools/create-app/src
mkdir -p tools/eject/src
mkdir -p apps
```

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml turbo.json package.json packages/ tools/ apps/
git commit -m "chore: initialize Turborepo monorepo root structure"
```

---

### Task 2: Create @velocity/types Package

**Files:**
- Create: `packages/infra/types/package.json`
- Create: `packages/infra/types/src/content.ts`
- Create: `packages/infra/types/src/theme.ts`
- Create: `packages/infra/types/src/index.ts`

- [ ] **Step 1: Create package.json**

File: `packages/infra/types/package.json`

```json
{
  "name": "@velocity/types",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

- [ ] **Step 2: Create content types (extracted from lib/types.ts)**

File: `packages/infra/types/src/content.ts`

```typescript
export interface HeroContent {
  headline: string;
  tagline: string;
  cta: { label: string; href: string };
  media: { type: "video" | "image"; src: string; poster?: string; alt: string };
  overlay: { opacity: number; gradient?: string };
}

export interface ProductShowcaseContent {
  title: string;
  subtitle: string;
  products: Array<{
    name: string;
    image: string;
    alt: string;
    features: Array<{ label: string; position: { x: number; y: number } }>;
  }>;
}

export interface BrandStoryContent {
  chapters: Array<{
    heading: string;
    body: string;
    media: { type: "video" | "image"; src: string; alt: string };
    layout: "left" | "right" | "full";
  }>;
}

export interface ProductGridContent {
  heading: string;
  categories: string[];
  products: Array<{
    name: string;
    price: { amount: number; currency: string };
    image: string;
    alt: string;
    category: string;
    badge?: string;
  }>;
}

export interface TestimonialsContent {
  heading: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    avatar: string;
    avatarAlt: string;
  }>;
}

export interface FooterContent {
  brand: { name: string; logo: string };
  newsletter: { heading: string; placeholder: string; cta: string };
  socials: Array<{ platform: string; url: string; icon: string }>;
  links: Array<{
    group: string;
    items: Array<{ label: string; href: string }>;
  }>;
  legal: string;
}

export interface VelocityContent {
  hero: HeroContent;
  productShowcase: ProductShowcaseContent;
  brandStory: BrandStoryContent;
  productGrid: ProductGridContent;
  testimonials: TestimonialsContent;
  footer: FooterContent;
  metadata: {
    title: string;
    description: string;
    ogImage: string;
  };
}
```

- [ ] **Step 3: Create theme contract**

File: `packages/infra/types/src/theme.ts`

```typescript
/**
 * Documents the CSS custom properties that section packages expect.
 * This is documentation — the actual contract is CSS.
 * Each app must define these in its globals.css :root block.
 */
export interface ThemeContract {
  "--color-primary": string;
  "--color-primary-light": string;
  "--color-secondary": string;
  "--color-accent": string;
  "--color-background": string;
  "--color-foreground": string;
  "--color-muted": string;
  "--font-display": string;
  "--font-body": string;
  "--max-width-content": string;
  "--spacing-section": string;
}
```

- [ ] **Step 4: Create index**

File: `packages/infra/types/src/index.ts`

```typescript
export type {
  HeroContent,
  ProductShowcaseContent,
  BrandStoryContent,
  ProductGridContent,
  TestimonialsContent,
  FooterContent,
  VelocityContent,
} from "./content";

export type { ThemeContract } from "./theme";
```

- [ ] **Step 5: Commit**

```bash
git add packages/infra/types/
git commit -m "feat: create @velocity/types package with content and theme types"
```

---

### Task 3: Create @velocity/animations Package

**Files:**
- Create: `packages/infra/animations/package.json`
- Create: `packages/infra/animations/src/animations.ts`
- Create: `packages/infra/animations/src/index.ts`

- [ ] **Step 1: Create package.json**

File: `packages/infra/animations/package.json`

```json
{
  "name": "@velocity/animations",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "framer-motion": "^12.0.0"
  }
}
```

- [ ] **Step 2: Create animations (copy verbatim from lib/animations.ts)**

Copy the exact content of `lib/animations.ts` into `packages/infra/animations/src/animations.ts`. The file has no `@/` imports — it only imports from `framer-motion`, so no import rewrites needed.

For reference, the current file content:

```typescript
import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
};
```

- [ ] **Step 3: Create index**

File: `packages/infra/animations/src/index.ts`

```typescript
export {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInFromLeft,
  slideInFromRight,
  springConfig,
} from "./animations";
```

- [ ] **Step 4: Commit**

```bash
git add packages/infra/animations/
git commit -m "feat: create @velocity/animations package with Framer Motion presets"
```

---

### Task 4: Create @velocity/scroll-engine Package

**Files:**
- Create: `packages/infra/scroll-engine/package.json`
- Create: `packages/infra/scroll-engine/src/scroll-engine.ts`
- Create: `packages/infra/scroll-engine/src/index.ts`

- [ ] **Step 1: Create package.json**

File: `packages/infra/scroll-engine/package.json`

```json
{
  "name": "@velocity/scroll-engine",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "gsap": "^3.12.0",
    "lenis": "^1.0.0"
  }
}
```

- [ ] **Step 2: Create scroll engine (extracted from lib/scroll-engine.ts)**

Copy the exact content of the current `lib/scroll-engine.ts` into `packages/infra/scroll-engine/src/scroll-engine.ts`. The file has no `@/` imports — it only imports from `react`, `gsap`, and `lenis`, so no import rewrites needed.

**Important:** Preserve the `"use client"` directive at the top of the file — it uses React hooks (`useEffect`, `useRef`).

Read the current file and copy it verbatim.

- [ ] **Step 3: Create index**

File: `packages/infra/scroll-engine/src/index.ts`

```typescript
export { useScrollEngine } from "./scroll-engine";
export type { ScrollConfig } from "./scroll-engine";
```

- [ ] **Step 4: Commit**

```bash
git add packages/infra/scroll-engine/
git commit -m "feat: create @velocity/scroll-engine package with GSAP + Lenis hook"
```

---

### Task 5: Create @velocity/motion-components Package

**Files:**
- Create: `packages/infra/motion-components/package.json`
- Create: `packages/infra/motion-components/src/motion-section.tsx`
- Create: `packages/infra/motion-components/src/animated-text.tsx`
- Create: `packages/infra/motion-components/src/index.ts`

- [ ] **Step 1: Create package.json**

File: `packages/infra/motion-components/package.json`

```json
{
  "name": "@velocity/motion-components",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "framer-motion": "^12.0.0"
  },
  "dependencies": {
    "@velocity/animations": "workspace:*"
  }
}
```

- [ ] **Step 2: Copy motion-section.tsx**

Copy `components/motion/motion-section.tsx` to `packages/infra/motion-components/src/motion-section.tsx`.

**Important:** Preserve the `"use client"` directive at the top of the file.

**Import rewrite needed:** Change `@/lib/animations` → `@velocity/animations`.

The file currently imports:
```typescript
import { fadeInUp } from "@/lib/animations";
```

Change to:
```typescript
import { fadeInUp } from "@velocity/animations";
```

- [ ] **Step 3: Copy animated-text.tsx**

Copy `components/motion/animated-text.tsx` to `packages/infra/motion-components/src/animated-text.tsx`.

**Important:** Preserve the `"use client"` directive at the top of the file if present.

**Check for `@/` imports.** If it imports from `@/lib/animations`, rewrite to `@velocity/animations`. If it has no `@/` imports, copy verbatim.

- [ ] **Step 4: Create index**

File: `packages/infra/motion-components/src/index.ts`

```typescript
export { MotionSection } from "./motion-section";
export { AnimatedText } from "./animated-text";
```

- [ ] **Step 5: Commit**

```bash
git add packages/infra/motion-components/
git commit -m "feat: create @velocity/motion-components package"
```

---

### Task 6: Create @velocity/i18n and @velocity/ui Packages

**Files:**
- Create: `packages/infra/i18n/package.json`
- Create: `packages/infra/i18n/src/i18n.ts`
- Create: `packages/infra/i18n/src/index.ts`
- Create: `packages/infra/ui/package.json`
- Create: `packages/infra/ui/src/index.ts`

- [ ] **Step 1: Create @velocity/i18n package.json**

File: `packages/infra/i18n/package.json`

```json
{
  "name": "@velocity/i18n",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

- [ ] **Step 2: Create i18n utility**

The current `lib/i18n.ts` loads app-specific content via dynamic imports. The package exports a reusable factory; the app provides the import function.

File: `packages/infra/i18n/src/i18n.ts`

```typescript
export interface I18nConfig {
  defaultLocale: string;
  locales: readonly string[];
}

export function isValidLocale(
  config: I18nConfig,
  locale: string
): boolean {
  return config.locales.includes(locale);
}

export function createContentLoader<T>(
  config: I18nConfig,
  importFn: (locale: string) => Promise<T>
): (locale: string) => Promise<T> {
  return async function getContent(locale: string): Promise<T> {
    const resolved = isValidLocale(config, locale)
      ? locale
      : config.defaultLocale;
    return importFn(resolved);
  };
}
```

- [ ] **Step 3: Create i18n index**

File: `packages/infra/i18n/src/index.ts`

```typescript
export { isValidLocale, createContentLoader } from "./i18n";
export type { I18nConfig } from "./i18n";
```

- [ ] **Step 4: Create @velocity/ui package (empty slot)**

File: `packages/infra/ui/package.json`

```json
{
  "name": "@velocity/ui",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

File: `packages/infra/ui/src/index.ts`

```typescript
// 21st.dev / Magic MCP components will be added here.
// This package is a slot — populated over time as components are installed.
export {};
```

- [ ] **Step 5: Commit**

```bash
git add packages/infra/i18n/ packages/infra/ui/
git commit -m "feat: create @velocity/i18n and @velocity/ui packages"
```

---

## Chunk 2: Section Packages

### Task 7: Create Hero & Product Showcase Section Packages

**Files:**
- Create: `packages/sections/hero/package.json`
- Create: `packages/sections/hero/src/*` (copy from sections/hero/, rewrite imports)
- Create: `packages/sections/product-showcase/package.json`
- Create: `packages/sections/product-showcase/src/*` (copy from sections/product-showcase/, rewrite imports)

- [ ] **Step 1: Create hero package.json**

File: `packages/sections/hero/package.json`

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

- [ ] **Step 2: Copy hero source files with import rewrites**

Copy all files from `sections/hero/` to `packages/sections/hero/src/`. Apply these import rewrites across all files:

| Old import | New import |
|---|---|
| `@/lib/types` | `@velocity/types` |
| `@/lib/scroll-engine` | `@velocity/scroll-engine` |
| `@/lib/animations` | `@velocity/animations` |
| `@/components/motion/animated-text` | `@velocity/motion-components` |
| `@/components/motion/motion-section` | `@velocity/motion-components` |

**Important:** The rewrite applies to BOTH standard `import ... from "@/lib/types"` statements AND inline `import("@/lib/types")` type expressions found in `.types.ts` files. Search for all occurrences of `@/lib/` and `@/components/` patterns, not just `import` statements.

Copy tests from `sections/hero/__tests__/` to `packages/sections/hero/__tests__/` with the same import rewrites. Also update test imports of `../Hero` to `../src/Hero` (since tests are now at `__tests__/` adjacent to `src/`).

- [ ] **Step 3: Create product-showcase package.json**

File: `packages/sections/product-showcase/package.json`

```json
{
  "name": "@velocity/product-showcase",
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

- [ ] **Step 4: Copy product-showcase source files with import rewrites**

Same pattern as hero. Copy `sections/product-showcase/` → `packages/sections/product-showcase/src/`, apply the import rewrite table above. Copy tests to `__tests__/`, update relative imports.

- [ ] **Step 5: Commit**

```bash
git add packages/sections/hero/ packages/sections/product-showcase/
git commit -m "feat: create @velocity/hero and @velocity/product-showcase packages"
```

---

### Task 8: Create Brand Story & Product Grid Section Packages

**Files:**
- Create: `packages/sections/brand-story/package.json`
- Create: `packages/sections/brand-story/src/*`
- Create: `packages/sections/product-grid/package.json`
- Create: `packages/sections/product-grid/src/*`

- [ ] **Step 1: Create brand-story package.json**

File: `packages/sections/brand-story/package.json`

```json
{
  "name": "@velocity/brand-story",
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
    "@velocity/animations": "workspace:*"
  }
}
```

- [ ] **Step 2: Copy brand-story source files with import rewrites**

Copy `sections/brand-story/` → `packages/sections/brand-story/src/`, apply import rewrite table. Copy tests to `__tests__/`, update relative imports.

- [ ] **Step 3: Create product-grid package.json**

File: `packages/sections/product-grid/package.json`

```json
{
  "name": "@velocity/product-grid",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0",
    "framer-motion": "^12.0.0"
  },
  "dependencies": {
    "@velocity/types": "workspace:*",
    "@velocity/scroll-engine": "workspace:*"
  }
}
```

Note: Product Grid uses `@velocity/types` for content types and `@velocity/scroll-engine` for the `ScrollConfig` type import in `product-grid.animation.ts`. Since there is no build step (raw TSX), even type-only imports must be resolvable.

- [ ] **Step 4: Copy product-grid source files with import rewrites**

Copy `sections/product-grid/` → `packages/sections/product-grid/src/`, apply import rewrite table. Copy tests to `__tests__/`, update relative imports.

- [ ] **Step 5: Commit**

```bash
git add packages/sections/brand-story/ packages/sections/product-grid/
git commit -m "feat: create @velocity/brand-story and @velocity/product-grid packages"
```

---

### Task 9: Create Testimonials & Footer Section Packages

**Files:**
- Create: `packages/sections/testimonials/package.json`
- Create: `packages/sections/testimonials/src/*`
- Create: `packages/sections/footer/package.json`
- Create: `packages/sections/footer/src/*`

- [ ] **Step 1: Create testimonials package.json**

File: `packages/sections/testimonials/package.json`

```json
{
  "name": "@velocity/testimonials",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0",
    "framer-motion": "^12.0.0"
  },
  "dependencies": {
    "@velocity/types": "workspace:*",
    "@velocity/scroll-engine": "workspace:*"
  }
}
```

- [ ] **Step 2: Copy testimonials source files with import rewrites**

Copy `sections/testimonials/` → `packages/sections/testimonials/src/`, apply import rewrite table. Copy tests to `__tests__/`, update relative imports.

- [ ] **Step 3: Create footer package.json**

File: `packages/sections/footer/package.json`

```json
{
  "name": "@velocity/footer",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0",
    "framer-motion": "^12.0.0"
  },
  "dependencies": {
    "@velocity/types": "workspace:*",
    "@velocity/scroll-engine": "workspace:*"
  }
}
```

**Important:** The current Footer component imports `LocaleSwitcher` from `@/components/locale-switcher`. Since locale-switcher is app-local, the Footer package must NOT import it. The Footer component must accept a `localeSwitcher` prop (a React node) instead. This is the only component that needs a structural change during extraction.

Updated Footer component signature:
```tsx
interface FooterProps {
  content: FooterContent;
  localeSwitcher?: React.ReactNode;
}
```

The app passes `<LocaleSwitcher />` as a prop when rendering Footer.

- [ ] **Step 4: Copy footer source files with import rewrites + LocaleSwitcher refactor**

Copy `sections/footer/` → `packages/sections/footer/src/`. Apply import rewrite table.

**Additional change in Footer.tsx:** Remove the `import { LocaleSwitcher }` line. Add `localeSwitcher?: React.ReactNode` to FooterProps. Replace `<LocaleSwitcher />` with `{localeSwitcher}` in the JSX.

**Additional change in footer.types.ts:** Add `localeSwitcher?: React.ReactNode` to FooterProps.

Copy tests to `__tests__/`, update relative imports. Update footer test to pass `localeSwitcher` prop as `<span>EN | ID</span>` or similar mock.

- [ ] **Step 5: Commit**

```bash
git add packages/sections/testimonials/ packages/sections/footer/
git commit -m "feat: create @velocity/testimonials and @velocity/footer packages"
```

---

## Chunk 3: App Migration

### Task 10: Move App into apps/velocity-template

**Files:**
- Move: `app/` → `apps/velocity-template/app/`
- Move: `content/` → `apps/velocity-template/content/`
- Move: `public/` → `apps/velocity-template/public/`
- Move: `middleware.ts` → `apps/velocity-template/middleware.ts`
- Create: `apps/velocity-template/package.json`
- Create: `apps/velocity-template/tsconfig.json`
- Create: `apps/velocity-template/next.config.ts`
- Create: `apps/velocity-template/components/locale-switcher.tsx` (copy from current)
- Move: `vitest.config.ts` → `apps/velocity-template/vitest.config.ts`
- Move: `vitest.setup.ts` → `apps/velocity-template/vitest.setup.ts`

- [ ] **Step 1: Move app files**

```bash
# Move app-specific directories and files into apps/velocity-template
mv app apps/velocity-template/app
mv content apps/velocity-template/content
mv public apps/velocity-template/public
mv middleware.ts apps/velocity-template/middleware.ts
mv vitest.config.ts apps/velocity-template/vitest.config.ts
mv vitest.setup.ts apps/velocity-template/vitest.setup.ts

# Copy app-local components
mkdir -p apps/velocity-template/components
cp components/locale-switcher.tsx apps/velocity-template/components/locale-switcher.tsx
```

- [ ] **Step 2: Create app package.json**

File: `apps/velocity-template/package.json`

```json
{
  "name": "velocity-template",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "framer-motion": "^12.36.0",
    "gsap": "^3.14.2",
    "lenis": "^1.3.18",
    "@velocity/types": "workspace:*",
    "@velocity/scroll-engine": "workspace:*",
    "@velocity/animations": "workspace:*",
    "@velocity/motion-components": "workspace:*",
    "@velocity/i18n": "workspace:*",
    "@velocity/hero": "workspace:*",
    "@velocity/product-showcase": "workspace:*",
    "@velocity/brand-story": "workspace:*",
    "@velocity/product-grid": "workspace:*",
    "@velocity/testimonials": "workspace:*",
    "@velocity/footer": "workspace:*"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "jsdom": "^28.1.0",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^4.1.0"
  }
}
```

- [ ] **Step 3: Create app tsconfig.json**

File: `apps/velocity-template/tsconfig.json`

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
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create next.config.ts with transpilePackages**

File: `apps/velocity-template/next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@velocity/types",
    "@velocity/scroll-engine",
    "@velocity/animations",
    "@velocity/motion-components",
    "@velocity/i18n",
    "@velocity/ui",
    "@velocity/hero",
    "@velocity/product-showcase",
    "@velocity/brand-story",
    "@velocity/product-grid",
    "@velocity/testimonials",
    "@velocity/footer",
  ],
};

export default nextConfig;
```

- [ ] **Step 5: Commit move**

```bash
git add apps/velocity-template/
git commit -m "chore: move velocity-template app into apps/ directory"
```

---

### Task 11: Update App Imports to @velocity/* Packages

**Files:**
- Modify: `apps/velocity-template/app/[locale]/page-client.tsx`
- Modify: `apps/velocity-template/app/[locale]/page.tsx`
- Modify: `apps/velocity-template/app/[locale]/layout.tsx`
- Create: `apps/velocity-template/lib/i18n.ts` (new app-local version using @velocity/i18n)

- [ ] **Step 1: Rewrite page-client.tsx imports**

File: `apps/velocity-template/app/[locale]/page-client.tsx`

Replace all `@/sections/*` imports with `@velocity/*` package imports:

```typescript
"use client";

import { Hero, heroScrollConfig } from "@velocity/hero";
import { ProductShowcase, productShowcaseScrollConfig } from "@velocity/product-showcase";
import { BrandStory, brandStoryScrollConfig } from "@velocity/brand-story";
import { ProductGrid, productGridScrollConfig } from "@velocity/product-grid";
import { Testimonials, testimonialsScrollConfig } from "@velocity/testimonials";
import { Footer, footerScrollConfig } from "@velocity/footer";
import { useScrollEngine } from "@velocity/scroll-engine";
import type { VelocityContent } from "@velocity/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  heroScrollConfig,
  productShowcaseScrollConfig,
  brandStoryScrollConfig,
  productGridScrollConfig,
  testimonialsScrollConfig,
  footerScrollConfig,
];

interface PageClientProps {
  content: VelocityContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);

  return (
    <main>
      <Hero content={content.hero} />
      <ProductShowcase content={content.productShowcase} />
      <BrandStory content={content.brandStory} />
      <ProductGrid content={content.productGrid} />
      <Testimonials content={content.testimonials} />
      <Footer content={content.footer} localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
```

- [ ] **Step 2: Create app-local i18n.ts using @velocity/i18n**

File: `apps/velocity-template/lib/i18n.ts`

```typescript
import { createContentLoader } from "@velocity/i18n";
import type { VelocityContent } from "@velocity/types";

export const defaultLocale = "en";
export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export const getContent = createContentLoader<VelocityContent>(
  { defaultLocale, locales },
  (locale) =>
    import(`../content/${locale}/velocity`).then((m) => m.default)
);
```

- [ ] **Step 3: Update page.tsx imports**

The page.tsx imports `getContent` from `@/lib/i18n`. This path still works since i18n.ts is app-local at `lib/i18n.ts`. Verify the import resolves. If page.tsx also imports types, update:

`import type { VelocityContent } from "@/lib/types"` → `import type { VelocityContent } from "@velocity/types"`

- [ ] **Step 4: Update layout.tsx imports**

If layout.tsx imports from `@/lib/i18n` or `@/lib/types`, update type imports to `@velocity/types`. The `getContent` import stays at `@/lib/i18n` (app-local).

- [ ] **Step 5: Update locale-switcher.tsx imports**

The locale-switcher currently imports from `@/content/content.config`. Since `content.config.ts` is still app-local, update the import to use the app-local `@/lib/i18n` instead:

```typescript
import { locales, type Locale } from "@/lib/i18n";
```

- [ ] **Step 6: Commit**

```bash
git add apps/velocity-template/
git commit -m "feat: update app imports to use @velocity/* packages"
```

---

### Task 12: Clean Up Old Files & Verify Build

**Files:**
- Delete: `sections/` (now in packages/)
- Delete: `lib/` (now in packages/ or apps/)
- Delete: `components/` (now in packages/ or apps/)
- Delete: old config files from root

- [ ] **Step 1: Remove old directories**

```bash
rm -rf sections/ lib/ components/
rm -f next.config.ts tsconfig.json
```

Keep at root: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `docs/`, `packages/`, `apps/`, `tools/`

- [ ] **Step 2: Install dependencies**

```bash
pnpm install
```

This should resolve all `workspace:*` dependencies.

- [ ] **Step 3: Run tests**

```bash
cd apps/velocity-template && pnpm test
```

Expected: All tests pass. If tests fail due to import path issues, fix them.

- [ ] **Step 4: Run build**

```bash
cd apps/velocity-template && pnpm build
```

Expected: Next.js build succeeds.

- [ ] **Step 5: Run from root with Turborepo**

```bash
cd /path/to/velocity-template  # monorepo root
pnpm test
pnpm build
```

Expected: Turborepo orchestrates build + test across all packages and apps.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: clean up old directories, verify monorepo build and tests"
```

---

## Chunk 4: CLI Scaffolder

### Task 13: Create Scaffolder Core

**Files:**
- Create: `tools/create-app/package.json`
- Create: `tools/create-app/src/index.ts`
- Create: `tools/create-app/src/discover.ts`
- Create: `tools/create-app/src/prompts.ts`

- [ ] **Step 1: Create package.json**

File: `tools/create-app/package.json`

```json
{
  "name": "@velocity/create-app",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "dependencies": {
    "enquirer": "^2.4.1"
  }
}
```

- [ ] **Step 2: Create discover.ts — finds available apps and section packages**

File: `tools/create-app/src/discover.ts`

```typescript
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

export function getMonorepoRoot(): string {
  return ROOT;
}

export function discoverApps(): string[] {
  const appsDir = join(ROOT, "apps");
  if (!existsSync(appsDir)) return [];
  return readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function discoverSections(): Array<{ name: string; packageName: string }> {
  const sectionsDir = join(ROOT, "packages/sections");
  if (!existsSync(sectionsDir)) return [];
  return readdirSync(sectionsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pkgPath = join(sectionsDir, d.name, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      return { name: d.name, packageName: pkg.name };
    });
}

export function discoverInfraPackages(): Array<{ name: string; packageName: string }> {
  const infraDir = join(ROOT, "packages/infra");
  if (!existsSync(infraDir)) return [];
  return readdirSync(infraDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pkgPath = join(infraDir, d.name, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      return { name: d.name, packageName: pkg.name };
    });
}
```

- [ ] **Step 3: Create prompts.ts — interactive CLI prompts**

File: `tools/create-app/src/prompts.ts`

```typescript
import Enquirer from "enquirer";

const enquirer = new Enquirer();

export async function promptAppName(defaultName?: string): Promise<string> {
  const { name } = await enquirer.prompt<{ name: string }>({
    type: "input",
    name: "name",
    message: "App name (kebab-case):",
    initial: defaultName,
    validate: (v: string) =>
      /^[a-z][a-z0-9-]*$/.test(v) || "Must be kebab-case (e.g., acme-corp)",
  });
  return name;
}

export async function promptSourceApp(apps: string[]): Promise<string> {
  const { source } = await enquirer.prompt<{ source: string }>({
    type: "select",
    name: "source",
    message: "Source app (template):",
    choices: apps,
  });
  return source;
}

export async function promptSections(
  sections: Array<{ name: string; packageName: string }>
): Promise<string[]> {
  const { selected } = await enquirer.prompt<{ selected: string[] }>({
    type: "multiselect",
    name: "selected",
    message: "Select sections to include:",
    choices: sections.map((s) => ({ name: s.packageName, value: s.packageName })),
    initial: sections.map((_, i) => i),
  });
  return selected;
}

export async function promptLocales(): Promise<string[]> {
  const { locales } = await enquirer.prompt<{ locales: string[] }>({
    type: "multiselect",
    name: "locales",
    message: "Select locales:",
    choices: [
      { name: "en", value: "en" },
      { name: "id", value: "id" },
      { name: "ja", value: "ja" },
      { name: "zh", value: "zh" },
    ],
    initial: [0],
  });
  return locales;
}
```

- [ ] **Step 4: Commit**

```bash
git add tools/create-app/
git commit -m "feat: create-app scaffolder core with discovery and prompts"
```

---

### Task 14: Create Scaffolder Generator

**Files:**
- Create: `tools/create-app/src/generate.ts`
- Complete: `tools/create-app/src/index.ts`

- [ ] **Step 1: Create generate.ts — generates the app from source**

File: `tools/create-app/src/generate.ts`

```typescript
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { getMonorepoRoot, discoverInfraPackages } from "./discover";

// Map section package names to their import names and configs
const SECTION_META: Record<
  string,
  { component: string; configExport: string; contentKey: string }
> = {
  "@velocity/hero": { component: "Hero", configExport: "heroScrollConfig", contentKey: "hero" },
  "@velocity/product-showcase": { component: "ProductShowcase", configExport: "productShowcaseScrollConfig", contentKey: "productShowcase" },
  "@velocity/brand-story": { component: "BrandStory", configExport: "brandStoryScrollConfig", contentKey: "brandStory" },
  "@velocity/product-grid": { component: "ProductGrid", configExport: "productGridScrollConfig", contentKey: "productGrid" },
  "@velocity/testimonials": { component: "Testimonials", configExport: "testimonialsScrollConfig", contentKey: "testimonials" },
  "@velocity/footer": { component: "Footer", configExport: "footerScrollConfig", contentKey: "footer" },
};

interface GenerateOptions {
  appName: string;
  sourceApp: string;
  sections: string[];
  locales: string[];
}

export function generate(opts: GenerateOptions): void {
  const root = getMonorepoRoot();
  const sourceDir = join(root, "apps", opts.sourceApp);
  const targetDir = join(root, "apps", opts.appName);

  if (existsSync(targetDir)) {
    throw new Error(`App directory already exists: ${targetDir}`);
  }

  // 1. Copy source app
  cpSync(sourceDir, targetDir, { recursive: true });

  // 2. Remove source .next and node_modules if copied
  const dirsToClean = [".next", "node_modules"];
  for (const dir of dirsToClean) {
    const p = join(targetDir, dir);
    if (existsSync(p)) {
      rmSync(p, { recursive: true });
    }
  }

  // 3. Generate package.json
  const infraPkgs = discoverInfraPackages();
  const sectionDeps: Record<string, string> = {};
  for (const pkg of opts.sections) {
    sectionDeps[pkg] = "workspace:*";
  }
  const infraDeps: Record<string, string> = {};
  for (const pkg of infraPkgs) {
    infraDeps[pkg.packageName] = "workspace:*";
  }

  const sourcePkg = JSON.parse(
    readFileSync(join(sourceDir, "package.json"), "utf-8")
  );

  const appPkg = {
    name: opts.appName,
    version: "0.0.0",
    private: true,
    scripts: sourcePkg.scripts,
    dependencies: {
      ...Object.fromEntries(
        Object.entries(sourcePkg.dependencies as Record<string, string>).filter(
          ([k]) => !k.startsWith("@velocity/")
        )
      ),
      ...infraDeps,
      ...sectionDeps,
    },
    devDependencies: sourcePkg.devDependencies,
  };
  writeFileSync(
    join(targetDir, "package.json"),
    JSON.stringify(appPkg, null, 2) + "\n"
  );

  // 4. Generate next.config.ts with transpilePackages
  const allVelocityPkgs = [
    ...infraPkgs.map((p) => p.packageName),
    ...opts.sections,
  ];
  const nextConfigContent = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ${JSON.stringify(allVelocityPkgs, null, 4)},
};

export default nextConfig;
`;
  writeFileSync(join(targetDir, "next.config.ts"), nextConfigContent);

  // 5. Generate page-client.tsx with selected sections
  generatePageClient(targetDir, opts.sections);

  // 6. Generate content stubs for selected locales
  for (const locale of opts.locales) {
    generateContentStub(targetDir, opts.appName, locale, opts.sections);
  }

  // 7. Generate content.config.ts
  generateContentConfig(targetDir, opts.locales);

  // 8. Generate lib/i18n.ts
  generateI18n(targetDir, opts.appName, opts.locales);

  console.log(`\n✓ Created apps/${opts.appName} with ${opts.sections.length} sections`);
  console.log(`✓ Locales: ${opts.locales.join(", ")}`);
  console.log(`\nNext steps:`);
  console.log(`  cd apps/${opts.appName}`);
  console.log(`  pnpm install (from monorepo root)`);
  console.log(`  pnpm dev`);
}

function generatePageClient(targetDir: string, sections: string[]): void {
  const imports: string[] = [];
  const configs: string[] = [];
  const components: string[] = [];

  for (const pkg of sections) {
    const meta = SECTION_META[pkg];
    if (!meta) continue;
    imports.push(
      `import { ${meta.component}, ${meta.configExport} } from "${pkg}";`
    );
    configs.push(meta.configExport);

    if (pkg === "@velocity/footer") {
      components.push(
        `      <${meta.component} content={content.${meta.contentKey}} localeSwitcher={<LocaleSwitcher />} />`
      );
    } else {
      components.push(
        `      <${meta.component} content={content.${meta.contentKey}} />`
      );
    }
  }

  const hasFooter = sections.includes("@velocity/footer");

  const content = `"use client";

${imports.join("\n")}
import { useScrollEngine } from "@velocity/scroll-engine";
import type { VelocityContent } from "@velocity/types";
${hasFooter ? 'import { LocaleSwitcher } from "@/components/locale-switcher";' : ""}

const scrollConfigs = [
  ${configs.join(",\n  ")},
];

interface PageClientProps {
  content: VelocityContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);

  return (
    <main>
${components.join("\n")}
    </main>
  );
}
`;
  mkdirSync(join(targetDir, "app/[locale]"), { recursive: true });
  writeFileSync(join(targetDir, "app/[locale]/page-client.tsx"), content);
}

function generateContentStub(
  targetDir: string,
  appName: string,
  locale: string,
  sections: string[]
): void {
  const stubs: string[] = [];

  for (const pkg of sections) {
    const meta = SECTION_META[pkg];
    if (!meta) continue;
    stubs.push(`  ${meta.contentKey}: {} as any, // TODO: fill in ${meta.component} content`);
  }

  const content = `import type { VelocityContent } from "@velocity/types";

const content: VelocityContent = {
${stubs.join("\n")}
  metadata: {
    title: "${appName}",
    description: "TODO: add description",
    ogImage: "/images/og-image.jpg",
  },
};

export default content;
`;
  const dir = join(targetDir, "content", locale);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${appName}.ts`), content);
}

function generateContentConfig(targetDir: string, locales: string[]): void {
  const content = `export const defaultLocale = "${locales[0]}";
export const locales = ${JSON.stringify(locales)} as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
`;
  mkdirSync(join(targetDir, "content"), { recursive: true });
  writeFileSync(join(targetDir, "content/content.config.ts"), content);
}

function generateI18n(targetDir: string, appName: string, locales: string[]): void {
  const content = `import { createContentLoader } from "@velocity/i18n";
import type { VelocityContent } from "@velocity/types";

export const defaultLocale = "${locales[0]}";
export const locales = ${JSON.stringify(locales)} as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export const getContent = createContentLoader<VelocityContent>(
  { defaultLocale, locales },
  (locale) =>
    import(\`../content/\${locale}/${appName}\`).then((m) => m.default)
);
`;
  mkdirSync(join(targetDir, "lib"), { recursive: true });
  writeFileSync(join(targetDir, "lib/i18n.ts"), content);
}
```

- [ ] **Step 2: Create index.ts entry point**

File: `tools/create-app/src/index.ts`

```typescript
import { parseArgs } from "node:util";
import { discoverApps, discoverSections } from "./discover";
import { promptAppName, promptSourceApp, promptSections, promptLocales } from "./prompts";
import { generate } from "./generate";

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      from: { type: "string" },
    },
  });

  const apps = discoverApps();
  if (apps.length === 0) {
    console.error("No apps found in apps/ directory.");
    process.exit(1);
  }

  const sections = discoverSections();
  if (sections.length === 0) {
    console.error("No section packages found in packages/sections/.");
    process.exit(1);
  }

  // Get app name from positional arg or prompt
  const appName = positionals[0] || (await promptAppName());

  // Get source app from --from flag or prompt
  const sourceApp = values.from || (await promptSourceApp(apps));

  if (!apps.includes(sourceApp)) {
    console.error(`Source app "${sourceApp}" not found. Available: ${apps.join(", ")}`);
    process.exit(1);
  }

  // Select sections
  const selectedSections = await promptSections(sections);

  // Select locales
  const selectedLocales = await promptLocales();

  // Generate
  generate({
    appName,
    sourceApp,
    sections: selectedSections,
    locales: selectedLocales,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Install enquirer dependency**

```bash
cd tools/create-app && pnpm add enquirer
```

- [ ] **Step 4: Commit**

```bash
git add tools/create-app/
git commit -m "feat: create-app scaffolder with interactive prompts and app generation"
```

---

## Chunk 5: Eject Tool

### Task 15: Create Eject Tool

**Files:**
- Create: `tools/eject/package.json`
- Create: `tools/eject/src/resolve-imports.ts`
- Create: `tools/eject/src/eject.ts`
- Create: `tools/eject/src/index.ts`

- [ ] **Step 1: Create package.json**

File: `tools/eject/package.json`

```json
{
  "name": "@velocity/eject",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts"
}
```

- [ ] **Step 2: Create resolve-imports.ts — resolves @velocity/* imports to local paths**

File: `tools/eject/src/resolve-imports.ts`

```typescript
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";

// Maps @velocity/* package names to their ejected local paths
const PACKAGE_PATH_MAP: Record<string, string> = {
  "@velocity/types": "lib/types",
  "@velocity/scroll-engine": "lib/scroll-engine",
  "@velocity/animations": "lib/animations",
  "@velocity/motion-components": "components/motion",
  "@velocity/i18n": "lib/i18n-utils",
  "@velocity/ui": "components/ui",
  "@velocity/hero": "sections/hero",
  "@velocity/product-showcase": "sections/product-showcase",
  "@velocity/brand-story": "sections/brand-story",
  "@velocity/product-grid": "sections/product-grid",
  "@velocity/testimonials": "sections/testimonials",
  "@velocity/footer": "sections/footer",
};

/**
 * Walk all .ts/.tsx files in a directory and rewrite @velocity/* imports
 * to relative local paths.
 */
export function rewriteImports(dir: string, baseDir: string): void {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      rewriteImports(fullPath, baseDir);
      continue;
    }

    if (!entry.name.match(/\.(ts|tsx)$/)) continue;

    let content = readFileSync(fullPath, "utf-8");
    let changed = false;

    for (const [pkg, localPath] of Object.entries(PACKAGE_PATH_MAP)) {
      // Match: from "@velocity/foo" or from '@velocity/foo'
      const regex = new RegExp(
        `(from\\s+["'])${pkg.replace("/", "\\/")}(["'])`,
        "g"
      );

      const fileDir = relative(baseDir, dirname(fullPath));
      const targetPath = localPath;
      // Compute relative path from current file to target
      let rel = relative(join(baseDir, fileDir), join(baseDir, targetPath));
      if (!rel.startsWith(".")) rel = "./" + rel;
      // Normalize separators
      rel = rel.replace(/\\/g, "/");

      const newContent = content.replace(regex, `$1${rel}$2`);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }

    if (changed) {
      writeFileSync(fullPath, content);
    }
  }
}
```

- [ ] **Step 3: Create eject.ts — main eject pipeline**

File: `tools/eject/src/eject.ts`

```typescript
import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { rewriteImports } from "./resolve-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

export function eject(appName: string): void {
  const appDir = join(ROOT, "apps", appName);
  const outputDir = join(ROOT, "ejected", appName);

  if (!existsSync(appDir)) {
    throw new Error(`App not found: apps/${appName}`);
  }

  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true });
  }

  console.log(`Ejecting ${appName}...`);

  // 1. Copy app
  mkdirSync(outputDir, { recursive: true });
  cpSync(appDir, outputDir, { recursive: true });

  // Clean build artifacts
  for (const dir of [".next", "node_modules"]) {
    const p = join(outputDir, dir);
    if (existsSync(p)) rmSync(p, { recursive: true });
  }

  // 2. Copy @velocity/* package sources into local directories
  copyPackageSource("@velocity/types", "packages/infra/types/src", outputDir, "lib/types");
  copyPackageSource("@velocity/scroll-engine", "packages/infra/scroll-engine/src", outputDir, "lib/scroll-engine");
  copyPackageSource("@velocity/animations", "packages/infra/animations/src", outputDir, "lib/animations");
  copyPackageSource("@velocity/motion-components", "packages/infra/motion-components/src", outputDir, "components/motion");
  copyPackageSource("@velocity/i18n", "packages/infra/i18n/src", outputDir, "lib/i18n-utils");
  copyPackageSource("@velocity/ui", "packages/infra/ui/src", outputDir, "components/ui");

  // Copy section packages used by this app
  const appPkg = JSON.parse(readFileSync(join(appDir, "package.json"), "utf-8"));
  const sectionPkgs = Object.keys(appPkg.dependencies || {}).filter(
    (k) => k.startsWith("@velocity/") && !k.match(/types|scroll-engine|animations|motion-components|i18n|ui/)
  );

  for (const pkg of sectionPkgs) {
    const dirName = pkg.replace("@velocity/", "");
    copyPackageSource(pkg, `packages/sections/${dirName}/src`, outputDir, `sections/${dirName}`);
  }

  // 3. Rewrite all @velocity/* imports to relative paths
  rewriteImports(outputDir, outputDir);

  // 4. Generate standalone package.json
  generateStandalonePackageJson(appDir, outputDir, appName);

  // 5. Generate standalone next.config.ts (no transpilePackages)
  const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`;
  writeFileSync(join(outputDir, "next.config.ts"), nextConfig);

  // 6. Generate standalone tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: { "@/*": ["./*"] },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  };
  writeFileSync(
    join(outputDir, "tsconfig.json"),
    JSON.stringify(tsconfig, null, 2) + "\n"
  );

  // 7. Initialize git repo
  execSync("git init", { cwd: outputDir, stdio: "pipe" });
  execSync("git add -A", { cwd: outputDir, stdio: "pipe" });
  execSync('git commit -m "Initial commit (ejected from velocity-monorepo)"', {
    cwd: outputDir,
    stdio: "pipe",
  });

  // 8. Verify the ejected app works
  console.log("\nVerifying ejected app...");
  try {
    execSync("pnpm install", { cwd: outputDir, stdio: "inherit" });
    execSync("pnpm build", { cwd: outputDir, stdio: "inherit" });
    console.log(`\n✓ Ejected and verified: ejected/${appName}/`);
  } catch {
    console.error(`\n⚠ Ejected to ejected/${appName}/ but build verification failed.`);
    console.error("Check the ejected app for import or dependency issues.");
  }
}

function copyPackageSource(
  _pkgName: string,
  srcRelPath: string,
  outputDir: string,
  targetRelPath: string
): void {
  const srcDir = join(ROOT, srcRelPath);
  const targetDir = join(outputDir, targetRelPath);

  if (!existsSync(srcDir)) return;

  mkdirSync(targetDir, { recursive: true });
  cpSync(srcDir, targetDir, { recursive: true });
}

function generateStandalonePackageJson(
  appDir: string,
  outputDir: string,
  appName: string
): void {
  const appPkg = JSON.parse(readFileSync(join(appDir, "package.json"), "utf-8"));

  // Collect runtime deps from all consumed packages
  const runtimeDeps: Record<string, string> = {};

  // App's own non-velocity deps
  for (const [k, v] of Object.entries(appPkg.dependencies as Record<string, string>)) {
    if (!k.startsWith("@velocity/")) {
      runtimeDeps[k] = v;
    }
  }

  // Collect peer deps from ALL consumed @velocity/* packages
  const velocityDeps = Object.keys(appPkg.dependencies || {}).filter(
    (k) => k.startsWith("@velocity/")
  );
  for (const dep of velocityDeps) {
    // Resolve package location: sections or infra
    const dirName = dep.replace("@velocity/", "");
    const candidates = [
      join(ROOT, "packages/sections", dirName, "package.json"),
      join(ROOT, "packages/infra", dirName, "package.json"),
    ];
    for (const pkgPath of candidates) {
      if (!existsSync(pkgPath)) continue;
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      for (const [k, v] of Object.entries((pkg.peerDependencies || {}) as Record<string, string>)) {
        if (!runtimeDeps[k]) runtimeDeps[k] = v;
      }
      break;
    }
  }

  const standalone = {
    name: appName,
    version: "0.0.0",
    private: true,
    scripts: appPkg.scripts,
    dependencies: runtimeDeps,
    devDependencies: appPkg.devDependencies,
  };

  writeFileSync(
    join(outputDir, "package.json"),
    JSON.stringify(standalone, null, 2) + "\n"
  );
}
```

- [ ] **Step 4: Create index.ts entry point**

File: `tools/eject/src/index.ts`

```typescript
import { parseArgs } from "node:util";
import { eject } from "./eject";

const { positionals } = parseArgs({ allowPositionals: true });

const appName = positionals[0];
if (!appName) {
  console.error("Usage: pnpm eject <app-name>");
  process.exit(1);
}

eject(appName);
```

- [ ] **Step 5: Commit**

```bash
git add tools/eject/
git commit -m "feat: eject tool for extracting apps as standalone repos"
```

---

## Chunk 6: Final Verification

### Task 16: End-to-End Verification

**Files:** None created — verification only.

- [ ] **Step 1: Install all dependencies from root**

```bash
pnpm install
```

- [ ] **Step 2: Run all tests via Turborepo**

```bash
pnpm test
```

Expected: All package and app tests pass.

- [ ] **Step 3: Run build via Turborepo**

```bash
pnpm build
```

Expected: All apps build successfully.

- [ ] **Step 4: Run dev server**

```bash
cd apps/velocity-template && pnpm dev
```

Visit `http://localhost:3000/en` — verify all sections render and animations work.

- [ ] **Step 5: Test scaffolder (manual)**

```bash
pnpm create-app test-client --from velocity-template
# Select: Hero, Product Grid, Footer
# Select: en
```

Verify `apps/test-client/` is created with correct structure.

- [ ] **Step 6: Test eject (manual)**

```bash
pnpm eject velocity-template
```

Verify `ejected/velocity-template/` is created. Then:

```bash
cd ejected/velocity-template
pnpm install
pnpm build
```

Expected: Standalone build succeeds with no `@velocity/*` imports.

- [ ] **Step 7: Clean up test artifacts and commit**

```bash
rm -rf apps/test-client ejected/
git add -A
git commit -m "chore: final monorepo verification — all packages, build, and tools working"
```

---

## Summary

| Chunk | Tasks | What it delivers |
|-------|-------|-----------------|
| 1 | 1–6 | Monorepo root + all infra packages (@velocity/types, animations, scroll-engine, motion-components, i18n, ui) |
| 2 | 7–9 | All 6 section packages (@velocity/hero, product-showcase, brand-story, product-grid, testimonials, footer) |
| 3 | 10–12 | App migration into apps/velocity-template, import rewrites, build verification |
| 4 | 13–14 | CLI scaffolder (create-app) with interactive prompts |
| 5 | 15 | Eject tool for standalone extraction |
| 6 | 16 | End-to-end verification |

**Total: 16 tasks, 6 chunks**

After this plan completes, the Velocity monorepo will support creating new client apps via `pnpm create-app`, customizing via props + theme, and handing off standalone repos via `pnpm eject`.
