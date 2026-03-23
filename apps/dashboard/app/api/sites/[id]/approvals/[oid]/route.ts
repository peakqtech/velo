import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { z } from "zod";

const approvalSchema = z.object({
  action: z.enum(["approve", "reject", "veto"]),
  note: z.string().optional(),
});

const ACTION_MAP = {
  approve: { approvalStatus: "APPROVED" as const, status: "APPROVED" as const },
  reject: { approvalStatus: "REJECTED" as const, status: "SKIPPED" as const },
  veto: { approvalStatus: "VETOED" as const, status: "SKIPPED" as const },
};

// POST /api/sites/:id/approvals/:oid — approve/reject/veto
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; oid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, oid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const opportunity = await prisma.contentOpportunity.findFirst({
    where: { id: oid, siteId: id },
  });
  if (!opportunity) {
    return NextResponse.json(
      { error: "Opportunity not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const parsed = approvalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, note } = parsed.data;
  const mapping = ACTION_MAP[action];

  const updated = await prisma.contentOpportunity.update({
    where: { id: oid },
    data: {
      approvalStatus: mapping.approvalStatus,
      status: mapping.status,
      approvalNote: note ?? null,
    },
  });

  return NextResponse.json(updated);
}
