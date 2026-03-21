import Link from "next/link";
import { Users, AlertTriangle, Globe, BarChart3 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { MetricRow } from "@/components/metric-row";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function timeAgo(date: Date | null): string {
  if (!date) return "No activity";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function ClientsPage() {
  await auth();

  const clients = await prisma.client.findMany({
    include: {
      sites: { select: { id: true } },
      changeRequests: {
        where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const totalClients = clients.length;
  const overdueCount = clients.filter(
    (c) => c.paymentStatus === "OVERDUE"
  ).length;

  const planCounts = clients.reduce<Record<string, number>>((acc, c) => {
    const plan = c.plan as string;
    acc[plan] = (acc[plan] ?? 0) + 1;
    return acc;
  }, {});

  const planBreakdown = Object.entries(planCounts)
    .map(([plan, count]) => `${plan}: ${count}`)
    .join(" · ");

  return (
    <>
      <PageHeader
        title="Clients"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Clients" }]}
        actions={
          <Button asChild>
            <Link href="/clients/new">Add Client</Link>
          </Button>
        }
      />

      <MetricRow className="mt-6">
        <StatCard
          label="Total Clients"
          value={totalClients}
          icon={<Users size={18} />}
          color="violet"
        />
        <StatCard
          label="By Plan"
          value={planBreakdown || "—"}
          detail="plan breakdown"
          icon={<BarChart3 size={18} />}
          color="blue"
        />
        <StatCard
          label="Overdue Payments"
          value={overdueCount}
          detail={overdueCount > 0 ? "Requires attention" : "All good"}
          icon={<AlertTriangle size={18} />}
          color="rose"
        />
        <StatCard
          label="Active Sites"
          value={clients.reduce((sum, c) => sum + c.sites.length, 0)}
          detail="across all clients"
          icon={<Globe size={18} />}
          color="cyan"
        />
      </MetricRow>

      {clients.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center mb-4">
              <Users size={24} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold">No clients yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Add your first client to start managing their sites, change
              requests, and billing.
            </p>
            <Button asChild className="mt-6">
              <Link href="/clients/new">Add First Client</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="h-full hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-5">
                  {/* Name + Plan */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 dark:from-violet-500/20 dark:to-blue-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:from-violet-500/25 group-hover:to-blue-500/25 transition-colors">
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate">
                          {client.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {client.contactPerson}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={client.plan} />
                  </div>

                  {/* Email */}
                  <p className="text-xs text-muted-foreground truncate mb-3">
                    {client.email}
                  </p>

                  {/* Payment status + Price */}
                  <div className="flex items-center justify-between mb-4">
                    <StatusBadge status={client.paymentStatus} />
                    <span className="text-sm font-bold tracking-tight">
                      {formatIDR(client.monthlyPrice)}/mo
                    </span>
                  </div>

                  {/* Footer: sites, activity */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-3">
                    <span className="font-medium">
                      {client.sites.length} site
                      {client.sites.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-border">|</span>
                    <span>
                      {client.changeRequests.length} pending
                    </span>
                    <span className="ml-auto">
                      {timeAgo(client.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
