import Link from "next/link";
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
        <StatCard label="Total Clients" value={totalClients} />
        <StatCard
          label="By Plan"
          value={planBreakdown || "—"}
          detail="plan breakdown"
        />
        <StatCard
          label="Overdue Payments"
          value={overdueCount}
          detail={overdueCount > 0 ? "Requires attention" : "All good"}
        />
        <StatCard
          label="Active Sites"
          value={clients.reduce((sum, c) => sum + c.sites.length, 0)}
          detail="across all clients"
        />
      </MetricRow>

      {clients.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
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
              <Card className="h-full hover:border-border/80 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  {/* Name + Plan */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold truncate">
                        {client.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {client.contactPerson}
                      </p>
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
                    <span className="text-sm font-medium">
                      {formatIDR(client.monthlyPrice)}/mo
                    </span>
                  </div>

                  {/* Footer: sites, activity */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-3">
                    <span>
                      {client.sites.length} site
                      {client.sites.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-border">|</span>
                    <span>
                      {client.changeRequests.length} pending change
                      {client.changeRequests.length !== 1 ? "s" : ""}
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
