import Link from "next/link";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import {
  Search,
  Bot,
  Globe,
  ArrowRight,
  Lightbulb,
  Eye,
  CheckCircle2,
  FileText,
} from "lucide-react";

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SEOOverviewPage() {
  const sites = await prisma.site.findMany({
    include: {
      agentConfig: {
        select: {
          isActive: true,
          tier: true,
          oversightMode: true,
          channels: true,
        },
      },
      _count: {
        select: {
          contentOpportunities: true,
          geoSnapshots: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="SEO"
        description="Cross-client SEO performance and AI agent status"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "SEO" }]}
      />

      {sites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Sites Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Add sites to your clients to start tracking SEO performance and
              configure AI agents.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => {
            const agent = site.agentConfig;
            const hasAgent = !!agent;

            return (
              <Card
                key={site.id}
                className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Site Icon */}
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 dark:from-blue-500/20 dark:to-violet-500/20 flex items-center justify-center shrink-0">
                      <Globe size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>

                    {/* Site Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {site.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">{site.domain}</span>
                      </div>

                      {/* Agent Status */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {hasAgent ? (
                          <>
                            <StatusBadge
                              status={agent.isActive ? "ACTIVE" : "PAUSED"}
                              className="text-[10px] px-1.5 py-0"
                            />
                            <StatusBadge
                              status={agent.tier}
                              className="text-[10px] px-1.5 py-0"
                            />
                            <span className="text-[10px] text-muted-foreground">
                              {agent.oversightMode.replace(/_/g, " ")}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {agent.channels.length} channel{agent.channels.length !== 1 ? "s" : ""}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">No agent configured</span>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Lightbulb size={12} />
                          {site._count.contentOpportunities} opportunities
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {site._count.geoSnapshots} GEO snapshots
                        </span>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-1 shrink-0">
                      {[
                        { href: `/seo/${site.id}/agent`, icon: Bot, label: "Agent" },
                        { href: `/seo/${site.id}/opportunities`, icon: Lightbulb, label: "Pipeline" },
                        { href: `/seo/${site.id}/geo`, icon: Eye, label: "GEO" },
                        { href: `/seo/${site.id}/approvals`, icon: CheckCircle2, label: "Approvals" },
                        { href: `/seo/${site.id}/reports`, icon: FileText, label: "Reports" },
                      ].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-accent/80 transition-colors"
                        >
                          <link.icon size={12} />
                          {link.label}
                          <ArrowRight size={10} className="ml-auto" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
