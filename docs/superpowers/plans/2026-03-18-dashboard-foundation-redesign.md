# Dashboard Foundation Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Velo Dashboard from a CRUD admin into a CEO command center with shadcn/ui components, server-component performance, collapsible grouped sidebar, and dense home overview.

**Architecture:** Install shadcn/ui on Tailwind v4 (CSS-only config). Convert pages from client components with useEffect/fetch to server components with direct Prisma queries + Suspense streaming. New collapsible sidebar with grouped sections replaces flat 4-item nav. New home page shows revenue + operations + growth KPIs.

**Tech Stack:** Next.js 16, React 19, shadcn/ui (new-york style), Tailwind v4, Prisma 6.9, lucide-react, class-variance-authority, clsx, tailwind-merge

**Spec:** `docs/superpowers/specs/2026-03-18-dashboard-foundation-redesign.md`

---

## File Structure

### shadcn/ui Generated Files

| File | Responsibility |
|------|---------------|
| `apps/dashboard/components.json` | shadcn/ui configuration |
| `apps/dashboard/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |
| `apps/dashboard/components/ui/*.tsx` | ~18 shadcn components (button, card, badge, etc.) |

### Custom Dashboard Components

| File | Responsibility |
|------|---------------|
| `apps/dashboard/components/stat-card.tsx` | KPI card: label, value, trend arrow, optional sparkline |
| `apps/dashboard/components/sparkline.tsx` | CSS-only mini bar chart (no chart library) |
| `apps/dashboard/components/status-badge.tsx` | Colored badge mapping status enums to semantic colors |
| `apps/dashboard/components/page-header.tsx` | Title + breadcrumbs + action buttons slot |
| `apps/dashboard/components/metric-row.tsx` | Responsive row of stat-cards (2-col mobile → 4-col desktop) |
| `apps/dashboard/components/sidebar.tsx` | Collapsible grouped sidebar with sections |

### Pages (New/Rewritten)

| File | Responsibility |
|------|---------------|
| `apps/dashboard/app/(dashboard)/layout.tsx` | **Rewrite** — Server component, new sidebar |
| `apps/dashboard/app/(dashboard)/error.tsx` | **New** — Error boundary |
| `apps/dashboard/app/(dashboard)/page.tsx` | **Rewrite** — Dense CEO overview (was clients list) |
| `apps/dashboard/app/(dashboard)/clients/page.tsx` | **New** — Clients list (moved from /) |
| `apps/dashboard/app/(dashboard)/sites/page.tsx` | **New** — All sites list |
| `apps/dashboard/app/(dashboard)/seo/page.tsx` | **New** — Placeholder "Coming soon" |

### Modified

| File | Change |
|------|--------|
| `apps/dashboard/app/globals.css` | Add shadcn CSS variables via `@theme` blocks |
| `apps/dashboard/package.json` | Add shadcn deps, lucide-react |

---

## Task 1: shadcn/ui Setup + Dependencies

**Files:**
- Modify: `apps/dashboard/package.json`
- Modify: `apps/dashboard/app/globals.css`
- Create: `apps/dashboard/components.json`
- Create: `apps/dashboard/lib/utils.ts`

- [ ] **Step 1: Install shadcn/ui dependencies manually**

Since `shadcn init` may not detect Tailwind v4 perfectly, install deps directly:

```bash
cd apps/dashboard
pnpm add class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-slot @radix-ui/react-collapsible @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-scroll-area @radix-ui/react-separator @radix-ui/react-avatar @radix-ui/react-select
```

- [ ] **Step 2: Create `lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Create `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 4: Update `globals.css` with shadcn CSS variables for Tailwind v4**

Add shadcn/ui CSS variables to the existing `globals.css`. Keep the existing `@import "tailwindcss"` at the top. Add dark theme variables using the zinc palette:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: oklch(0.145 0 0);
  --color-foreground: oklch(0.985 0 0);
  --color-card: oklch(0.145 0 0);
  --color-card-foreground: oklch(0.985 0 0);
  --color-popover: oklch(0.145 0 0);
  --color-popover-foreground: oklch(0.985 0 0);
  --color-primary: oklch(0.985 0 0);
  --color-primary-foreground: oklch(0.205 0 0);
  --color-secondary: oklch(0.269 0 0);
  --color-secondary-foreground: oklch(0.985 0 0);
  --color-muted: oklch(0.269 0 0);
  --color-muted-foreground: oklch(0.708 0 0);
  --color-accent: oklch(0.269 0 0);
  --color-accent-foreground: oklch(0.985 0 0);
  --color-destructive: oklch(0.396 0.141 25.723);
  --color-destructive-foreground: oklch(0.637 0.237 25.331);
  --color-border: oklch(0.269 0 0);
  --color-input: oklch(0.269 0 0);
  --color-ring: oklch(0.556 0 0);
  --color-sidebar: oklch(0.145 0 0);
  --color-sidebar-foreground: oklch(0.985 0 0);
  --color-sidebar-primary: oklch(0.488 0.243 264.376);
  --color-sidebar-primary-foreground: oklch(0.985 0 0);
  --color-sidebar-accent: oklch(0.269 0 0);
  --color-sidebar-accent-foreground: oklch(0.985 0 0);
  --color-sidebar-border: oklch(0.269 0 0);
  --color-sidebar-ring: oklch(0.556 0 0);
  --radius: 0.625rem;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
}
```

- [ ] **Step 5: Install shadcn components via CLI**

```bash
cd apps/dashboard
pnpm dlx shadcn@latest add button card badge separator tooltip skeleton scroll-area collapsible dropdown-menu dialog tabs table input textarea select avatar breadcrumb sheet
```

**Do NOT add `sidebar` via the CLI** — the shadcn sidebar component is a 400+ line compound component with SidebarProvider that would conflict with our custom sidebar. We build the sidebar from Collapsible + ScrollArea + custom code in Task 3 instead.

If the CLI has issues with Tailwind v4 detection, manually copy components from shadcn/ui GitHub and adjust imports to use `@/lib/utils` and `@/components/ui/`.

- [ ] **Step 6: Verify setup**

Run: `pnpm --filter dashboard dev`
Expected: Dashboard starts without errors at localhost:4000.

- [ ] **Step 7: Commit**

```bash
git add apps/dashboard/
git commit -m "feat(dashboard): setup shadcn/ui with Tailwind v4 — components, CSS variables, utilities"
```

---

## Task 2: Custom Dashboard Components

**Files:**
- Create: `apps/dashboard/components/stat-card.tsx`
- Create: `apps/dashboard/components/sparkline.tsx`
- Create: `apps/dashboard/components/status-badge.tsx`
- Create: `apps/dashboard/components/page-header.tsx`
- Create: `apps/dashboard/components/metric-row.tsx`

- [ ] **Step 1: Create stat-card component**

```tsx
// apps/dashboard/components/stat-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; label?: string }; // percentage, positive = up
  detail?: string; // small text under value
  sparklineData?: number[]; // 7 data points for mini chart
  className?: string;
}

export function StatCard({ label, value, trend, detail, sparklineData, className }: StatCardProps) {
  const TrendIcon = trend ? (trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus) : null;
  const trendColor = trend ? (trend.value > 0 ? "text-emerald-400" : trend.value < 0 ? "text-red-400" : "text-muted-foreground") : "";

  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <span className={cn("flex items-center gap-0.5 text-xs font-medium", trendColor)}>
              {TrendIcon && <TrendIcon className="h-3 w-3" />}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {detail && <p className="text-xs text-muted-foreground mt-1">{detail}</p>}
        {sparklineData && (
          <div className="mt-3">
            <Sparkline data={sparklineData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create sparkline component**

```tsx
// apps/dashboard/components/sparkline.tsx
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string; // tailwind bg class
}

export function Sparkline({ data, className, color = "bg-blue-500" }: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className={cn("flex items-end gap-[2px] h-8", className)}>
      {data.map((value, i) => {
        const height = ((value - min) / range) * 100;
        return (
          <div
            key={i}
            className={cn("flex-1 rounded-sm min-h-[2px]", color, i === data.length - 1 ? "opacity-100" : "opacity-60")}
            style={{ height: `${Math.max(height, 8)}%` }}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create status-badge component**

```tsx
// apps/dashboard/components/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  // Payment
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  OVERDUE: "bg-red-500/15 text-red-400 border-red-500/20",
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  GRACE: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  // Plans
  BASIC: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  PREMIUM: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  ENTERPRISE: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  CUSTOM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  // Campaign
  DRAFT: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  PAUSED: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  COMPLETED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  // Content
  PLANNED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  GENERATING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20 animate-pulse",
  FAILED: "bg-red-500/15 text-red-400 border-red-500/20",
  IN_REVIEW: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  APPROVED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  PUBLISHED: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  REJECTED: "bg-red-500/15 text-red-400 border-red-500/20",
  // Deploy
  DEPLOYED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  BUILDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20 animate-pulse",
  // Change request
  IN_PROGRESS: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  REVIEW: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  DONE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT;
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium uppercase tracking-wider", style, className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
```

- [ ] **Step 4: Create page-header component**

```tsx
// apps/dashboard/components/page-header.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Fragment } from "react";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbSegment[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            {breadcrumbs.map((segment, i) => (
              <Fragment key={i}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {segment.href ? (
                    <BreadcrumbLink href={segment.href}>{segment.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
```

**Note:** The spec also lists `data-table.tsx`, `loading-shell.tsx`, and `nav-breadcrumb.tsx` as custom components. These are deferred to Sub-project 2 — they require the chart library and full page migrations to be useful. For Sub-project 1, pages use inline skeletons and the shadcn Table directly.

- [ ] **Step 5: Create metric-row component**

```tsx
// apps/dashboard/components/metric-row.tsx
import { cn } from "@/lib/utils";

interface MetricRowProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricRow({ children, className }: MetricRowProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 6: Verify components render**

Import and render a StatCard in the existing home page to verify shadcn/ui is working:

```bash
pnpm --filter dashboard dev
```

Check localhost:4000 — no errors.

- [ ] **Step 7: Commit**

```bash
git add apps/dashboard/components/
git commit -m "feat(dashboard): add custom dashboard components — stat-card, sparkline, status-badge, page-header, metric-row"
```

---

## Task 3: Collapsible Grouped Sidebar

**Files:**
- Create: `apps/dashboard/components/sidebar.tsx`
- Rewrite: `apps/dashboard/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create sidebar component**

**IMPORTANT:** This file must have `"use client"` at the top because it uses `usePathname()` from `next/navigation`. The server component layout passes `user` as a prop — this is valid (server → client prop passing works in RSC).

Build a collapsible grouped sidebar using shadcn/ui Collapsible + ScrollArea + lucide-react icons. Groups: OVERVIEW (Dashboard, Revenue), MANAGE (Clients, Sites, Changes), GROWTH (SEO, Content), SYSTEM (Integrations, QA Reports, Settings). Each group is collapsible. Active link highlighted with accent color. User profile at bottom with dropdown menu.

The sidebar component should:
- Start with `"use client";`
- Accept `user` prop (name, email, avatar) — passed from server layout
- Use `usePathname()` from `next/navigation` for active link detection
- Use Collapsible from shadcn for section groups (default open)
- Use ScrollArea for sidebar body
- Use DropdownMenu for user menu (profile, logout)
- Icons from lucide-react: LayoutDashboard, DollarSign, Users, Globe, ListChecks, Search, FileText, Puzzle, Shield, Settings, LogOut
- **Do NOT use the shadcn `sidebar` primitive** — build from Collapsible + ScrollArea + custom code

- [ ] **Step 2: Rewrite dashboard layout as server component**

Replace `apps/dashboard/app/(dashboard)/layout.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth protection handled by middleware.ts — this reads session data only
  const session = await auth();

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={session?.user ?? null} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify sidebar renders**

Run dev server, check sidebar renders with all groups, links work, active state highlights correctly.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/components/sidebar.tsx apps/dashboard/app/(dashboard)/layout.tsx
git commit -m "feat(dashboard): collapsible grouped sidebar with server component layout"
```

---

## Task 4: Error Boundary

**Files:**
- Create: `apps/dashboard/app/(dashboard)/error.tsx`

- [ ] **Step 1: Create error boundary**

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/(dashboard)/error.tsx
git commit -m "feat(dashboard): add error boundary for dashboard routes"
```

---

## Task 5: Dashboard Home Page — Dense CEO Overview

**Files:**
- Rewrite: `apps/dashboard/app/(dashboard)/page.tsx`

- [ ] **Step 1: Rewrite as server component with Suspense**

The home page becomes a dense CEO overview with:
- MetricRow of 4 StatCards: Revenue, Clients, Sites, Pending Changes
- Revenue sparkline (last 6 months)
- Payment status breakdown
- Recent activity feed (last 7 days: changes, invoices, deployments)
- Clients quick-access grid

All data fetched server-side via Prisma. Wrapped in Suspense boundaries:
- First boundary: KPI stat cards (fast — simple aggregates)
- Second boundary: Activity feed + client cards (slower — more complex queries)

```tsx
// apps/dashboard/app/(dashboard)/page.tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { MetricRow } from "@/components/metric-row";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Agency overview" />
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsLoader />
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>
        <ContentLoader />
      </Suspense>
    </>
  );
}
```

Implement `MetricsLoader` (server async component): queries client count, revenue sum (`prisma.client.aggregate` on `monthlyPrice` where `paymentStatus: "PAID"`), site count, pending changes count. Returns `<MetricRow>` with 4 `<StatCard>` components.

Implement `ContentLoader` (server async component): queries recent activity (changes + invoices from last 7 days) and client list. Returns activity feed card + clients quick-access grid.

**Note on `auth()` calls:** Each async loader component calls `await auth()` independently. This is intentional — Next.js deduplicates `auth()` calls across concurrent Suspense boundaries within the same request. Keep loaders self-contained; do NOT lift `auth()` to the page level as that would break the streaming pattern.

**Prisma schema reference:** `packages/infra/db/prisma/schema.prisma` — Client model has `monthlyPrice` (Int), `paymentStatus` (PaymentStatus enum: PAID/PENDING/OVERDUE/GRACE). ChangeRequest has `status` (String: PENDING/IN_PROGRESS/REVIEW/DONE/CANCELLED).

Implement skeleton components matching the layout.

- [ ] **Step 2: Verify**

Run dev server, navigate to `/`. Should see KPI cards load first, then activity feed + clients stream in.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/(dashboard)/page.tsx
git commit -m "feat(dashboard): dense CEO overview home page with server-side data + Suspense streaming"
```

---

## Task 6: Clients List Page

**Files:**
- Create: `apps/dashboard/app/(dashboard)/clients/page.tsx`

- [ ] **Step 1: Create clients list page (server component)**

Moved from old `/` route. Server component with:
- PageHeader with breadcrumbs: Dashboard > Clients
- Stats row: total clients, by plan, overdue count
- Client cards grid using shadcn Card component
- Each card: client name, plan badge (StatusBadge), contact, revenue, site count, payment status, last activity
- Link to client detail: `/clients/${clientId}`
- "Add Client" button in page header actions

All data fetched via Prisma server-side. Same auth pattern (middleware protects, page reads session for ownership filter).

- [ ] **Step 2: Verify**

Navigate to `/clients` — should show client list with polished cards.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/(dashboard)/clients/
git commit -m "feat(dashboard): server-component clients list page with shadcn cards"
```

---

## Task 7: Sites List Page + SEO Placeholder

**Files:**
- Create: `apps/dashboard/app/(dashboard)/sites/page.tsx`
- Create: `apps/dashboard/app/(dashboard)/seo/page.tsx`

- [ ] **Step 1: Create sites list page (server component)**

New first-class sites page:
- PageHeader: Dashboard > Sites
- Stats: total sites, deployed count, template distribution
- Site cards grid: name, template badge, domain, deploy status (StatusBadge), client name, health score from latest QA report
- Link to site detail

- [ ] **Step 2: Create SEO placeholder page**

```tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function SEOOverviewPage() {
  return (
    <>
      <PageHeader
        title="SEO"
        description="Cross-client SEO performance"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "SEO" }]}
      />
      <Card className="mt-8">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Cross-client SEO analytics will be available here. For now, manage SEO campaigns per-site from the client detail pages.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/(dashboard)/sites/ apps/dashboard/app/(dashboard)/seo/
git commit -m "feat(dashboard): add sites list page and SEO placeholder"
```

---

## Task 8: Migrate Existing Client Detail Page

**Files:**
- Modify: `apps/dashboard/app/(dashboard)/clients/[clientId]/page.tsx`

- [ ] **Step 1: Convert client detail page from client to server component**

The existing client detail page uses `"use client"` with `useParams()` + `useEffect` → `fetch("/api/clients/${clientId}")`. Convert it to:

**Server component migration pattern:**
- Remove `"use client"` directive
- Replace `useParams()` with server component `params` prop: `{ params }: { params: Promise<{ clientId: string }> }` then `const { clientId } = await params;`
- Replace `useEffect` → `fetch("/api/clients/${clientId}")` with direct `prisma.client.findUnique({ where: { id: clientId }, include: { sites: true, changeRequests: true, invoices: true } })`
- Replace `useState` for data with server-rendered JSX
- Use PageHeader with breadcrumbs: Dashboard > Clients > {clientName}
- Use StatusBadge for payment status, plan badges
- Use Card components for site cards
- Keep interactive elements (edit button, delete button, action links) as small `"use client"` sub-components that receive data as props
- Wrap data sections in Suspense boundaries

**Key:** Read the existing page first (`apps/dashboard/app/(dashboard)/clients/[clientId]/page.tsx`), preserve ALL functionality (site cards with SEO links, change requests list, invoice table, edit/delete buttons), just change the data fetching pattern and component library.

- [ ] **Step 2: Verify**

Navigate to `/clients/client-sushi-masa` — all data loads, site cards show, change requests show, navigation works.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/(dashboard)/clients/[clientId]/
git commit -m "feat(dashboard): migrate client detail to server component with shadcn UI"
```

---

## Task 9: Integration Verification

- [ ] **Step 1: Verify all pages load**

Navigate through all pages in order:
1. `/` — Dashboard overview with KPIs
2. `/clients` — Clients list
3. `/clients/client-sushi-masa` — Client detail
4. `/sites` — All sites
5. `/seo` — Placeholder
6. `/changes` — Changes kanban (existing, should still work)
7. `/billing` — Revenue (existing, should still work)
8. `/settings` — Settings (existing, should still work)

- [ ] **Step 2: Verify sidebar navigation**

All sidebar links work. Active state highlights correctly. Groups collapse/expand. User menu shows at bottom.

- [ ] **Step 3: Audit existing pages for double-padding**

The new layout puts `p-8` on `<main>`. Check that existing pages (`/changes`, `/billing`, `/settings`, `/integrations`, `/qa-reports`) don't add their own top-level padding. If they do, remove the page-level padding to prevent doubled spacing.

- [ ] **Step 4: Verify performance**

Navigation between pages should feel instant (no full-page spinner). KPI cards load first, tables/lists stream in after.

- [ ] **Step 4: Run existing tests**

```bash
pnpm test:ci
```

Expected: All existing tests pass.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(dashboard): foundation redesign complete — shadcn/ui, server components, grouped sidebar, CEO overview"
```

---

## Dependency Graph

```
Task 1 (shadcn setup) → Task 2 (custom components) → Task 3 (sidebar + layout)
                                                    → Task 4 (error boundary)
                                                    → Task 5 (home page)
                                                    → Task 6 (clients list)
                                                    → Task 7 (sites + SEO placeholder)
                                                    → Task 8 (client detail migration)
All → Task 9 (verification)
```

Tasks 4-8 can be parallelized after Tasks 1-3 are complete.
