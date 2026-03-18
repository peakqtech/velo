import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { MetricRow } from "@/components/metric-row";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SitesPage() {
  const session = await auth();

  const sites = await prisma.site.findMany({
    where: { ownerId: session!.user!.id },
    include: { client: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  const totalSites = sites.length;
  const deployedCount = sites.filter(
    (s) => s.deployStatus === "DEPLOYED"
  ).length;

  const templateCounts = sites.reduce<Record<string, number>>((acc, s) => {
    acc[s.template] = (acc[s.template] ?? 0) + 1;
    return acc;
  }, {});

  const templateBreakdown =
    Object.entries(templateCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tmpl, count]) => `${tmpl}: ${count}`)
      .join(" · ") || "—";

  return (
    <>
      <PageHeader
        title="Sites"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Sites" }]}
      />

      <MetricRow className="mt-6">
        <StatCard label="Total Sites" value={totalSites} />
        <StatCard
          label="Deployed"
          value={deployedCount}
          detail={`${totalSites - deployedCount} not yet deployed`}
        />
        <StatCard
          label="Templates"
          value={templateBreakdown}
          detail="distribution"
        />
        <StatCard
          label="With Domain"
          value={sites.filter((s) => !!s.domain).length}
          detail="custom domains"
        />
      </MetricRow>

      {sites.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-semibold">No sites yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Create sites from client detail pages using one of our templates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Link
              key={site.id}
              href={
                site.client
                  ? `/clients/${site.clientId}/sites/${site.id}`
                  : `/sites/${site.id}`
              }
            >
              <Card className="h-full hover:border-border/80 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  {/* Site name + template badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold truncate">
                        {site.name}
                      </h3>
                      {site.domain && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {site.domain}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0 capitalize">
                      {site.template}
                    </Badge>
                  </div>

                  {/* Deploy status */}
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={site.deployStatus} />
                    {site.siteUrl && (
                      <a
                        href={site.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline truncate max-w-[140px]"
                      >
                        {site.siteUrl.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>

                  {/* Client name */}
                  {site.client && (
                    <p className="text-xs text-muted-foreground border-t pt-3 truncate">
                      Client: {site.client.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
