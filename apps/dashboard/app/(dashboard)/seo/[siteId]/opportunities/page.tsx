import { notFound } from "next/navigation";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { OpportunityBoard } from "./opportunity-board";

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ siteId: string }>;
}

export default async function OpportunitiesPipelinePage({ params }: PageProps) {
  const { siteId } = await params;

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { name: true, domain: true },
  });

  if (!site) notFound();

  const opportunities = await prisma.contentOpportunity.findMany({
    where: { siteId },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  const serialized = opportunities.map((o) => ({
    id: o.id,
    signal: o.signal,
    keyword: o.keyword,
    title: o.title,
    score: o.score,
    channel: o.channel,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Opportunities Pipeline"
        description={`${site.name} — ${opportunities.length} opportunities tracked`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SEO", href: "/seo" },
          { label: site.name },
          { label: "Opportunities" },
        ]}
      />

      {opportunities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Opportunities Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              The AI agent will discover content opportunities based on keyword gaps,
              competitor analysis, and AI answer monitoring.
            </p>
          </CardContent>
        </Card>
      ) : (
        <OpportunityBoard opportunities={serialized} />
      )}
    </div>
  );
}
