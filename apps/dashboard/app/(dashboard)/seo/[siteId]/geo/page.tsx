import { notFound } from "next/navigation";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { MetricRow } from "@/components/metric-row";
import { Sparkline } from "@/components/sparkline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Eye, MessageSquare, Brain, Search, Gauge } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function currentPeriod() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7
  );
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

const ENGINE_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: "blue" | "emerald" | "violet" | "amber" | "rose" | "cyan" }
> = {
  CHATGPT: { label: "ChatGPT", icon: <MessageSquare size={18} />, color: "emerald" },
  PERPLEXITY: { label: "Perplexity", icon: <Search size={18} />, color: "blue" },
  GEMINI: { label: "Gemini", icon: <Brain size={18} />, color: "violet" },
  AI_OVERVIEW: { label: "AI Overviews", icon: <Eye size={18} />, color: "amber" },
};

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ siteId: string }>;
}

export default async function GeoVisibilityPage({ params }: PageProps) {
  const { siteId } = await params;

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { name: true, domain: true },
  });

  if (!site) notFound();

  // Get latest scores per engine
  const period = currentPeriod();
  const scores = await prisma.geoScore.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
  });

  // Get latest per engine for current or most recent period
  const latestByEngine = new Map<string, typeof scores[0]>();
  for (const score of scores) {
    if (!latestByEngine.has(score.engine)) {
      latestByEngine.set(score.engine, score);
    }
  }

  // Compute overall visibility (average across engines)
  const engineScores = Array.from(latestByEngine.values());
  const overallVisibility =
    engineScores.length > 0
      ? Math.round(
          engineScores.reduce((sum, s) => sum + s.visibility, 0) / engineScores.length
        )
      : 0;

  // Get historical scores for sparklines (last 8 periods per engine)
  const historicalByEngine = new Map<string, number[]>();
  for (const score of scores) {
    const arr = historicalByEngine.get(score.engine) ?? [];
    if (arr.length < 8) arr.push(score.visibility);
    historicalByEngine.set(score.engine, arr);
  }

  // Citation map from recent snapshots
  const recentSnapshots = await prisma.geoSnapshot.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="GEO Visibility"
        description={`${site.name} — AI engine citation tracking`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SEO", href: "/seo" },
          { label: site.name },
          { label: "GEO" },
        ]}
      />

      {/* Hero Metric */}
      <div className="max-w-sm">
        <StatCard
          label="AI Visibility Score"
          value={overallVisibility}
          detail={`across ${engineScores.length} engines`}
          icon={<Gauge size={18} />}
          color={overallVisibility >= 60 ? "emerald" : overallVisibility >= 30 ? "amber" : "rose"}
          sparklineData={
            engineScores.length > 0
              ? Array.from(historicalByEngine.values())[0]?.reverse()
              : undefined
          }
        />
      </div>

      {/* Engine Breakdown */}
      <MetricRow>
        {(["CHATGPT", "PERPLEXITY", "GEMINI", "AI_OVERVIEW"] as const).map((engine) => {
          const meta = ENGINE_META[engine];
          const score = latestByEngine.get(engine);
          const sparkData = historicalByEngine.get(engine)?.slice().reverse();

          return (
            <StatCard
              key={engine}
              label={meta.label}
              value={score ? Math.round(score.visibility) : "N/A"}
              detail={
                score
                  ? `${score.citedQueries}/${score.totalQueries} cited`
                  : "No data yet"
              }
              icon={meta.icon}
              color={meta.color}
              sparklineData={sparkData}
            />
          );
        })}
      </MetricRow>

      {/* Citation Map */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 dark:bg-violet-500/15">
              <Eye size={15} className="text-violet-600 dark:text-violet-400" />
            </div>
            <CardTitle className="text-base font-semibold">Recent Citations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentSnapshots.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No GEO snapshots recorded yet. Run the agent to start tracking.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Query</th>
                    <th className="pb-2 font-medium text-muted-foreground">Engine</th>
                    <th className="pb-2 font-medium text-muted-foreground">Cited</th>
                    <th className="pb-2 font-medium text-muted-foreground">Type</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSnapshots.map((snap) => (
                    <tr key={snap.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 max-w-[200px] truncate">{snap.query}</td>
                      <td className="py-2 pr-4">
                        <StatusBadge
                          status={snap.engine}
                          className="text-[10px] px-1.5 py-0"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`h-2 w-2 rounded-full inline-block ${
                            snap.cited ? "bg-emerald-500" : "bg-red-400"
                          }`}
                        />
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {snap.citationType ?? "—"}
                      </td>
                      <td className="py-2 text-right font-medium">
                        {snap.position ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trend Chart Placeholder */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Visibility Trends</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Gauge className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground max-w-md">
            Interactive trend charts will be available once enough weekly data has been
            collected. Check back after a few agent runs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
