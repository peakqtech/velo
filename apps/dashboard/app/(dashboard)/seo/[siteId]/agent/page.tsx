import { notFound } from "next/navigation";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Bot, Clock } from "lucide-react";
import { AgentControls } from "./agent-controls";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDuration(start: Date, end: Date | null) {
  if (!end) return "running...";
  const secs = Math.floor((end.getTime() - start.getTime()) / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ siteId: string }>;
}

export default async function AgentControlCenterPage({ params }: PageProps) {
  const { siteId } = await params;

  const [config, site] = await Promise.all([
    prisma.agentConfig.findUnique({
      where: { siteId },
      include: {
        runs: {
          orderBy: { startedAt: "desc" },
          take: 10,
        },
      },
    }),
    prisma.site.findUnique({ where: { id: siteId }, select: { name: true, domain: true } }),
  ]);

  if (!site) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agent Control Center"
        description={`${site.name} (${site.domain})`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SEO", href: "/seo" },
          { label: site.name },
          { label: "Agent" },
        ]}
      />

      {!config ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Agent Configured</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              This site doesn&apos;t have an AI SEO agent configured yet. Create one
              via the API or contact support.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-2">
            <AgentControls
              config={{
                id: config.id,
                siteId: config.siteId,
                tier: config.tier,
                oversightMode: config.oversightMode,
                vetoWindowHours: config.vetoWindowHours,
                channels: config.channels,
                cadence: config.cadence,
                competitors: config.competitors,
                verticalKeywords: config.verticalKeywords,
                geoEnabled: config.geoEnabled,
                geoQueryPrompts: config.geoQueryPrompts,
                aiModel: config.aiModel,
                isActive: config.isActive,
              }}
            />
          </div>

          {/* Right: Recent Runs */}
          <div>
            <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/15">
                    <Clock size={15} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-base font-semibold">Recent Runs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {config.runs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No runs yet. The agent will run based on the configured cadence.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {config.runs.map((run) => (
                      <li key={run.id} className="flex items-start gap-3 text-sm">
                        <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0 ring-4 ring-blue-500/10 dark:ring-blue-500/15" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {run.currentStep ?? "Agent Run"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {run.opportunitiesFound} opps &middot; {run.contentGenerated} content &middot; {run.geoQueriesRun} GEO
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StatusBadge status={run.status} className="text-[10px] px-1.5 py-0" />
                          <span className="text-[10px] text-muted-foreground">
                            {timeAgo(run.startedAt)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDuration(run.startedAt, run.completedAt)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
