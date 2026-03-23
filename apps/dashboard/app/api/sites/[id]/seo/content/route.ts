import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/seo/content?campaign=X&channel=BLOG&status=DRAFT
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign") ?? undefined;
  const channel = searchParams.get("channel") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const contentPieces = await prisma.contentPiece.findMany({
    where: {
      siteId: id,
      ...(campaignId ? { campaignId } : {}),
      ...(channel ? { channel: channel as "BLOG" | "GBP" | "SOCIAL" | "EMAIL" } : {}),
      ...(status ? { status: status as "PLANNED" | "GENERATING" | "DRAFT" | "FAILED" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED" } : {}),
    },
    include: {
      campaign: {
        select: { id: true, name: true },
      },
    },
    orderBy: { scheduledFor: "asc" },
  });

  return NextResponse.json(contentPieces);
}
