import { notFound } from "next/navigation";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { MetricRow } from "@/components/metric-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Lightbulb, Eye, Bot } from "lucide-react";

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ siteId: string }>;
}

export default async function ReportsPage({ params }: PageProps) {
  const { siteId } = await params;

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { name: true, domain: true },
  });

  if (!site) notFound();

  // Gather summary metrics
  const [
    totalOpportunities,
    publishedCount,
    geoScoreCount,
    runCount,
  ] = await Promise.all([
    prisma.contentOpportunity.count({ where: { siteId } }),
    prisma.contentOpportunity.count({ where: { siteId, status: "PUBLISHED" } }),
    prisma.geoScore.count({ where: { siteId } }),
    prisma.agentRun.count({ where: { siteId, status: "COMPLETED" } }),
  ]);

  // Latest GEO scores for overall visibility
  const latestScores = await prisma.geoScore.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
    take: 4,
    distinct: ["engine"],
  });

  const avgVisibility =
    latestScores.length > 0
      ? Math.round(
          latestScores.reduce((sum, s) => sum + s.visibility, 0) / latestScores.length
        )
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description={`${site.name} — SEO + GEO performance summary`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SEO", href: "/seo" },
          { label: site.name },
          { label: "Reports" },
        ]}
      />

      {/* Summary Metrics */}
      <MetricRow>
        <StatCard
          label="Total Opportunities"
          value={totalOpportunities}
          detail="all-time discovered"
          icon={<Lightbulb size={18} />}
          color="amber"
        />
        <StatCard
          label="Published"
          value={publishedCount}
          detail="content pieces live"
          icon={<FileText size={18} />}
          color="emerald"
        />
        <StatCard
          label="AI Visibility"
          value={avgVisibility > 0 ? `${avgVisibility}/100` : "N/A"}
          detail={`${latestScores.length} engines tracked`}
          icon={<Eye size={18} />}
          color="violet"
        />
        <StatCard
          label="Agent Runs"
          value={runCount}
          detail="completed successfully"
          icon={<Bot size={18} />}
          color="blue"
        />
      </MetricRow>

      {/* Detailed Report Placeholder */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Detailed Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground max-w-md">
            Detailed SEO and GEO reports with exportable PDFs, weekly trend analysis,
            and competitor comparisons are coming soon. Current summary metrics are
            shown above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
