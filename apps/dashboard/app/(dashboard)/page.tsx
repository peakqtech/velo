import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { MetricRow } from "@/components/metric-row";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function currentMonthYear() {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-36" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-24" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Server Loaders ───────────────────────────────────────────────────────────

async function MetricsLoader() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [clientCount, revenueAgg, siteCount, pendingCount] = await Promise.all([
    prisma.client.count(),
    prisma.client.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { monthlyPrice: true },
    }),
    prisma.site.count({ where: { ownerId: session.user.id } }),
    prisma.changeRequest.count({
      where: { status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] } },
    }),
  ]);

  const revenue = revenueAgg._sum.monthlyPrice ?? 0;

  return (
    <MetricRow>
      <StatCard label="Total Clients" value={clientCount} detail="active retainers" />
      <StatCard label="Monthly Revenue" value={formatIDR(revenue)} detail="from paid clients" />
      <StatCard label="Active Sites" value={siteCount} detail="across all clients" />
      <StatCard label="Pending Changes" value={pendingCount} detail="open requests" />
    </MetricRow>
  );
}

async function ContentLoader() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [recentChanges, clients] = await Promise.all([
    prisma.changeRequest.findMany({
      where: { requestedAt: { gte: sevenDaysAgo } },
      include: { client: true, site: true },
      orderBy: { requestedAt: "desc" },
      take: 10,
    }),
    prisma.client.findMany({
      include: { _count: { select: { sites: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No activity in the last 7 days.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentChanges.map((change) => (
                <li key={change.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{change.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {change.client.name}
                      {change.site ? ` · ${change.site.name}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={change.status} className="text-[10px] px-1.5 py-0" />
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(change.requestedAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Clients Quick-Access Grid */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Clients</CardTitle>
            <Link
              href="/clients"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No clients yet.{" "}
              <Link href="/clients/new" className="text-blue-400 hover:underline">
                Add one
              </Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {clients.map((client) => (
                <li key={client.id}>
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-foreground">
                        {client.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {client._count.sites} site{client._count.sites !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <StatusBadge status={client.paymentStatus} className="text-[10px] px-1.5 py-0 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`CEO overview · ${currentMonthYear()}`}
      />

      {/* Fast: KPI metrics */}
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsLoader />
      </Suspense>

      {/* Slower: Activity feed + Clients grid */}
      <Suspense fallback={<ContentSkeleton />}>
        <ContentLoader />
      </Suspense>
    </div>
  );
}
