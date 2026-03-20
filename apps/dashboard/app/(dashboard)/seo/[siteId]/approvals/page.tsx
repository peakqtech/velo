import { notFound } from "next/navigation";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { ApprovalActions } from "./approval-actions";

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ siteId: string }>;
}

export default async function ApprovalQueuePage({ params }: PageProps) {
  const { siteId } = await params;

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { name: true, domain: true },
  });

  if (!site) notFound();

  const pendingOpps = await prisma.contentOpportunity.findMany({
    where: {
      siteId,
      OR: [
        { status: "PENDING_APPROVAL" },
        { approvalStatus: "PENDING" },
      ],
    },
    orderBy: [{ vetoDeadline: "asc" }, { score: "desc" }],
    take: 50,
  });

  const serialized = pendingOpps.map((o) => ({
    id: o.id,
    keyword: o.keyword,
    title: o.title,
    signal: o.signal,
    score: o.score,
    channel: o.channel,
    status: o.status,
    approvalStatus: o.approvalStatus,
    vetoDeadline: o.vetoDeadline?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Approval Queue"
        description={`${site.name} — ${pendingOpps.length} pending review`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SEO", href: "/seo" },
          { label: site.name },
          { label: "Approvals" },
        ]}
      />

      {pendingOpps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold">All Clear</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              No content is waiting for approval. New items will appear here when the
              agent generates content under Approval Required or Veto Window oversight modes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ApprovalActions siteId={siteId} opportunities={serialized} />
      )}
    </div>
  );
}
