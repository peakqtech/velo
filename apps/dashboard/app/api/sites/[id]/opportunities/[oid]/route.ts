import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { z } from "zod";

const patchSchema = z.object({
  status: z
    .enum([
      "DISCOVERED",
      "PLANNED",
      "PENDING_APPROVAL",
      "APPROVED",
      "GENERATING",
      "PUBLISHED",
      "FAILED",
      "SKIPPED",
    ])
    .optional(),
  title: z.string().optional(),
  channel: z.enum(["BLOG", "GBP", "SOCIAL", "EMAIL"]).optional(),
  metadata: z.record(z.any()).optional(),
});

// PATCH /api/sites/:id/opportunities/:oid — update opportunity
export async function PATCH(
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
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await prisma.contentOpportunity.update({
    where: { id: oid },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}
