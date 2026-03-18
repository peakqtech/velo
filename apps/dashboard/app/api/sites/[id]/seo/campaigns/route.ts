import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/seo/campaigns
export async function GET(
  _request: Request,
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

  const campaigns = await prisma.campaign.findMany({
    where: { siteId: id },
    include: {
      _count: { select: { contentPieces: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(campaigns);
}

// POST /api/sites/:id/seo/campaigns
export async function POST(
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

  const body = await request.json();
  const { name, goal, channels, totalPieces, schedule, keywordTargets, approvedPlan } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      siteId: id,
      name,
      goal: goal ?? null,
      channels: channels ?? [],
      totalPieces: totalPieces ?? 0,
      schedule: schedule ?? {},
      keywordTargets: keywordTargets ?? [],
    },
  });

  // Optionally bulk-create content pieces from an approved plan
  if (approvedPlan?.pieces && Array.isArray(approvedPlan.pieces) && approvedPlan.pieces.length > 0) {
    const pieces = approvedPlan.pieces as Array<{
      title: string;
      channel: string;
      targetKeyword: string;
      scheduledFor: string;
      outline: string;
    }>;

    await prisma.contentPiece.createMany({
      data: pieces.map((piece) => ({
        campaignId: campaign.id,
        siteId: id,
        title: piece.title,
        channel: piece.channel as "BLOG" | "GBP" | "SOCIAL" | "EMAIL",
        targetKeyword: piece.targetKeyword,
        scheduledFor: piece.scheduledFor ? new Date(piece.scheduledFor) : null,
        outline: piece.outline,
        status: "PLANNED",
      })),
    });

    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { totalPieces: pieces.length },
    });
  }

  const created = await prisma.campaign.findUnique({
    where: { id: campaign.id },
    include: { _count: { select: { contentPieces: true } } },
  });

  return NextResponse.json(created, { status: 201 });
}
