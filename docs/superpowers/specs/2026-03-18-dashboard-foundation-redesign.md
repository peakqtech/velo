# Dashboard Foundation Redesign — Design Spec

**Date:** 2026-03-18
**Status:** Draft
**Author:** Yohanes + Claude
**Scope:** Sub-project 1 of 3 — Foundation (component library + performance + navigation shell)

## Overview

Redesign the Velo Dashboard from a CRUD admin scaffold into a CEO command center. This sub-project establishes the foundation: shadcn/ui component library, server-component performance layer, collapsible grouped sidebar, and a dense home overview page. Sub-projects 2 (core page redesign) and 3 (SEO module polish) build on this.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Design direction | Stripe-inspired | Rich data viz, clear hierarchy, professional — fits CEO decision-making |
| Home page | Dense overview | Revenue + operations + growth KPIs in one view |
| Navigation | Collapsible sidebar with grouped sections | Organized, scalable, keeps context |
| Performance | Hybrid shell + streaming | Instant shell, critical data first, secondary streams in |
| Data viz (day 1) | KPI cards + CSS sparklines | Lightweight, chart library added in Sub-project 2 |
| Component library | shadcn/ui | Industry standard, Tailwind-based, dark mode, copy-paste |

## 1. shadcn/ui Integration

### Setup

Install shadcn/ui in the dashboard app following the Next.js setup:
- `pnpm dlx shadcn@latest init` in `apps/dashboard/`
- Configure for dark mode (class strategy), zinc color palette, CSS variables
- This creates `components/ui/` directory and `lib/utils.ts` (cn helper)

### Components to Install

Day-1 components needed for the foundation:

| Component | Purpose |
|-----------|---------|
| `button` | Primary/secondary/ghost actions |
| `card` | KPI cards, content cards, stat blocks |
| `badge` | Status badges (plan, payment, campaign status) |
| `separator` | Section dividers |
| `tooltip` | Hover context on KPIs and icons |
| `skeleton` | Loading placeholders |
| `scroll-area` | Sidebar scrolling |
| `collapsible` | Sidebar section groups |
| `dropdown-menu` | User menu, action menus |
| `dialog` | Confirmation dialogs |
| `tabs` | Page-level tab navigation |
| `table` | Data tables |
| `input` | Form inputs (replaces custom inputs) |
| `textarea` | Form textareas |
| `select` | Dropdowns |
| `avatar` | User avatars |
| `breadcrumb` | Navigation breadcrumbs |
| `sheet` | Slide-over panels (replaces custom config-panel) |
| `sidebar` | shadcn sidebar component for grouped collapsible nav |

### Custom Dashboard Components

Built on top of shadcn/ui primitives, placed in `apps/dashboard/components/`:

| Component | Purpose |
|-----------|---------|
| `stat-card.tsx` | KPI card with label, value, trend indicator (up/down arrow + percentage), optional sparkline |
| `sparkline.tsx` | CSS-only mini chart (7 data points as bar heights) — no chart library |
| `status-badge.tsx` | Colored badge mapping status enums to colors (reusable across all pages) |
| `page-header.tsx` | Page title + breadcrumb + optional actions slot |
| `data-table.tsx` | Wrapper around shadcn table with sorting, filtering, empty state |
| `metric-row.tsx` | Horizontal row of stat-cards (responsive: 2-col mobile, 4-col desktop) |
| `loading-shell.tsx` | Full-page skeleton matching the layout shell |
| `nav-breadcrumb.tsx` | Auto-generated breadcrumbs from URL segments with human-readable labels |

## 2. Performance Layer

### Current Problem

Every page is `"use client"` with `useEffect` → `fetch` chains:
```
Navigate → blank page → spinner → fetch API → render data
```
Multiple sequential fetches per page create waterfalls. Each navigation feels like a full page load.

### Solution: Server Components + Parallel Fetching

```
Navigate → instant shell (sidebar+header+skeleton) → server fetches data in parallel → streams HTML
```

**Pattern for every page:**

```typescript
// page.tsx (Server Component — NO "use client")
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { ClientsGrid } from "./clients-grid"; // client component
import { StatCards } from "./stat-cards"; // client component for interactivity
import { ClientsGridSkeleton, StatCardsSkeleton } from "./skeletons";

export default async function ClientsPage() {
  return (
    <>
      <PageHeader title="Clients" />
      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCardsLoader />
      </Suspense>
      <Suspense fallback={<ClientsGridSkeleton />}>
        <ClientsGridLoader />
      </Suspense>
    </>
  );
}

// Loader components fetch data server-side
async function StatCardsLoader() {
  const session = await auth();
  const stats = await prisma.client.aggregate({ ... });
  return <StatCards data={stats} />;
}

async function ClientsGridLoader() {
  const session = await auth();
  const clients = await prisma.client.findMany({ ... });
  return <ClientsGrid clients={clients} />;
}
```

**Key principles:**
- Pages are server components by default — direct Prisma queries, no API round-trips
- `Suspense` boundaries around data-dependent sections — shell renders instantly
- Critical data (KPIs, counts) in first Suspense boundary — loads fast
- Secondary data (tables, lists) in second Suspense boundary — streams in after
- Interactive parts (filters, sort, actions) are small client components receiving pre-fetched data as props
- API routes remain for client-side mutations (POST/PUT/DELETE) only — not for reads

### Layout Shell Performance

The dashboard layout itself should be a server component:

```typescript
// app/(dashboard)/layout.tsx (Server Component)
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
```

The sidebar renders immediately with the page content streaming in. No layout flash.

### What Changes

| Before | After |
|--------|-------|
| `"use client"` on every page | Server components by default |
| `useEffect` → `fetch("/api/...")` | Direct `prisma.___` queries in server components |
| Sequential API waterfalls | Parallel `Suspense` boundaries |
| Full page spinner on navigation | Instant shell + streaming data |
| API routes for everything | API routes for mutations only |

### What Stays

- All existing API routes remain (needed for client-side mutations and SEO async generation)
- `lib/hooks.ts` stays for interactive features (content editor, integration toggles)
- `lib/api.ts` stays for client-side mutation helpers

## 3. Navigation — Collapsible Grouped Sidebar

### Structure

```
┌─────────────────────┐
│ ◆ Velo Agency       │  ← Logo/brand
│                     │
│ OVERVIEW            │  ← Section label (collapsible)
│   ◎ Dashboard       │  ← Home overview
│   ◎ Revenue         │
│                     │
│ MANAGE              │
│   ◎ Clients         │
│   ◎ Sites           │  ← NEW: first-class sites list
│   ◎ Changes         │
│                     │
│ GROWTH              │
│   ◎ SEO             │  ← NEW: cross-client SEO overview
│   ◎ Content         │
│                     │
│ SYSTEM              │
│   ◎ Settings        │
│                     │
│ ─────────────────── │
│ 👤 Yohanes          │  ← User profile + dropdown
│    Agency Owner     │
└─────────────────────┘
```

### New Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard home — dense KPI overview |
| `/sites` | All sites across clients (new first-class page) |
| `/seo` | Cross-client SEO overview (new aggregate page) |

### Breadcrumb Navigation

Every page gets auto-breadcrumbs from the URL:

```
Dashboard > Clients > Sushi Masa > Sites > velocity-demo > SEO > Q2 Campaign
```

Segments map to human-readable labels via a lookup (clientId → client name from DB, siteId → site name, etc.).

### URL Structure (unchanged)

The URL structure stays the same — we're changing navigation chrome, not routes:
- `/` — dashboard home (was clients list, now becomes overview)
- `/clients` — clients list (moved from /)
- `/clients/[clientId]` — client detail
- `/clients/[clientId]/sites/[siteId]/seo` — site SEO
- etc.

## 4. Dashboard Home Page

The `/` route becomes a dense CEO overview instead of a clients list.

### Layout

```
┌────────────────────────────────────────────────┐
│ Dashboard                          March 2026  │
├────────┬────────┬────────┬────────────────────┤
│Revenue │Clients │ Sites  │ Pending Changes    │
│Rp 8.5M│   3    │   4    │       3            │
│↑ 12%  │        │2 deploy│ 1 urgent           │
├────────┴────────┴────────┴────────────────────┤
│                                                │
│ Revenue Trend          │ Payment Status        │
│ ▁▂▃▅▆▇█ (sparkline)   │ ● 2 Paid  ● 1 Overdue│
│                        │                       │
├────────────────────────┴───────────────────────┤
│                                                │
│ Recent Activity                                │
│ • Sushi Masa: Invoice paid (2h ago)            │
│ • Bali Zen Spa: Change request created (1d)    │
│ • Rumah Impian: Payment overdue (3d)           │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│ Clients Overview                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │Sushi Masa│ │Bali Zen  │ │Rumah Imp.│       │
│ │PREMIUM   │ │BASIC     │ │ENTERPRISE│       │
│ │2M IDR/mo │ │1.5M/mo   │ │5M/mo ⚠  │       │
│ │2 sites   │ │0 sites   │ │1 site    │       │
│ └──────────┘ └──────────┘ └──────────┘       │
│                                                │
└────────────────────────────────────────────────┘
```

### Data Sources

All fetched server-side via Prisma (no API calls):

| KPI | Query |
|-----|-------|
| Revenue | `prisma.invoice.aggregate({ where: { period: currentMonth, status: "PAID" }, _sum: { amount: true } })` |
| Clients | `prisma.client.count()` |
| Sites | `prisma.site.count({ where: { ownerId } })` + deployed count |
| Pending Changes | `prisma.changeRequest.count({ where: { status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] } } })` |
| Revenue trend | Last 6 months of invoice totals (sparkline data) |
| Payment status | `prisma.client.groupBy({ by: ["paymentStatus"], _count: true })` |
| Recent activity | Union of recent changes, invoices, deployments (last 7 days) |

## 5. Clients List Page

Moves from `/` to `/clients`. Gets the same performance treatment:

- Server component with Suspense
- Stats row at top: total clients, by plan distribution, overdue count
- Client cards grid (existing design, polished with shadcn Card component)
- Search/filter bar (client component)

## 6. Migration Strategy

### Phase 1: Install shadcn/ui + build component library
- Run shadcn init
- Install all day-1 components
- Build custom dashboard components (stat-card, sparkline, status-badge, etc.)
- No page changes yet — just adding components

### Phase 2: New layout shell + sidebar
- Replace current layout.tsx with server component layout
- Build new collapsible sidebar with shadcn Sidebar
- Add breadcrumb system
- Existing pages continue to work inside new shell (progressive migration)

### Phase 3: Dashboard home page
- Create new `/` route as dense overview (server component)
- Move clients list to `/clients`
- Add redirect from old patterns if needed

### Phase 4: Performance migration of existing pages
- Convert existing pages from client components to server components one by one
- Start with most-visited: clients overview, client detail, site detail
- Each page: remove "use client", convert useEffect/fetch to server-side Prisma, wrap interactive parts in Suspense

### What NOT to change (scope boundary)
- API routes stay as-is (mutations still need them)
- Auth flow unchanged
- SEO module pages untouched (Sub-project 3)
- Content editor untouched (complex client interactivity, needs its own redesign)
- Reservation system untouched (vertical-specific)

## 7. Files Created/Modified

| Location | Change |
|----------|--------|
| `apps/dashboard/components.json` | **New** — shadcn/ui config |
| `apps/dashboard/lib/utils.ts` | **New** — cn() helper |
| `apps/dashboard/components/ui/*.tsx` | **New** — shadcn/ui components (~18 files) |
| `apps/dashboard/components/stat-card.tsx` | **New** — KPI card component |
| `apps/dashboard/components/sparkline.tsx` | **New** — CSS-only mini chart |
| `apps/dashboard/components/status-badge.tsx` | **New** — Colored status badges |
| `apps/dashboard/components/page-header.tsx` | **New** — Title + breadcrumb + actions |
| `apps/dashboard/components/data-table.tsx` | **New** — Table wrapper |
| `apps/dashboard/components/metric-row.tsx` | **New** — Responsive stat cards row |
| `apps/dashboard/components/loading-shell.tsx` | **New** — Full-page skeleton |
| `apps/dashboard/components/nav-breadcrumb.tsx` | **New** — Auto breadcrumbs |
| `apps/dashboard/components/sidebar.tsx` | **New** — Collapsible grouped sidebar |
| `apps/dashboard/app/(dashboard)/layout.tsx` | **Rewrite** — Server component layout + new sidebar |
| `apps/dashboard/app/(dashboard)/page.tsx` | **Rewrite** — Dense CEO overview (was clients list) |
| `apps/dashboard/app/(dashboard)/clients/page.tsx` | **New** — Clients list (moved from /) |
| `apps/dashboard/app/(dashboard)/sites/page.tsx` | **New** — All sites list |
| `apps/dashboard/app/(dashboard)/seo/page.tsx` | **New** — Cross-client SEO overview |
| `apps/dashboard/app/globals.css` | **Modified** — shadcn/ui CSS variables + Tailwind config |
| `apps/dashboard/tailwind.config.ts` | **New/Modified** — shadcn/ui theme configuration |
| `apps/dashboard/package.json` | **Modified** — shadcn/ui dependencies |
| Existing page files | **Modified** — Progressive migration to server components |
