import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Globe,
  ListChecks,
  ArrowRight,
  Activity,
} from "lucide-react";
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
        <div key={i} className="rounded-2xl border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-36" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-24" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
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
      <StatCard
        label="Total Clients"
        value={clientCount}
        detail="active retainers"
        icon={<Users size={18} />}
        color="violet"
      />
      <StatCard
        label="Monthly Revenue"
        value={formatIDR(revenue)}
        detail="from paid clients"
        icon={<DollarSign size={18} />}
        color="emerald"
      />
      <StatCard
        label="Active Sites"
        value={siteCount}
        detail="across all clients"
        icon={<Globe size={18} />}
        color="cyan"
      />
      <StatCard
        label="Pending Changes"
        value={pendingCount}
        detail="open requests"
        icon={<ListChecks size={18} />}
        color="amber"
      />
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
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/15">
              <Activity size={15} className="text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No activity in the last 7 days.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentChanges.map((change) => (
                <li key={change.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0 ring-4 ring-blue-500/10 dark:ring-blue-500/15" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{change.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
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
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 dark:bg-violet-500/15">
                <Users size={15} className="text-violet-600 dark:text-violet-400" />
              </div>
              <CardTitle className="text-base font-semibold">Clients</CardTitle>
            </div>
            <Link
              href="/clients"
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              View all
              <ArrowRight size={12} />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No clients yet.{" "}
              <Link href="/clients/new" className="text-primary hover:underline font-medium">
                Add one
              </Link>
            </p>
          ) : (
            <ul className="space-y-1">
              {clients.map((client) => (
                <li key={client.id}>
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-accent/80 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 dark:from-violet-500/20 dark:to-blue-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:from-violet-500/25 group-hover:to-blue-500/25 transition-colors">
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
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
