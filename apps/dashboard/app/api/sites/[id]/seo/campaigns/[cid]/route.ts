import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/seo/campaigns/:cid
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; cid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, cid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: cid, siteId: id },
    include: { _count: { select: { contentPieces: true } } },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

// PUT /api/sites/:id/seo/campaigns/:cid
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; cid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, cid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: cid, siteId: id },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const body = await request.json();
  const { name, goal, channels, status, totalPieces, publishedCount, schedule, keywordTargets } = body;

  const updated = await prisma.campaign.update({
    where: { id: cid },
    data: {
      name: name !== undefined ? name : campaign.name,
      goal: goal !== undefined ? goal : campaign.goal,
      channels: channels !== undefined ? channels : campaign.channels,
      status: status !== undefined ? status : campaign.status,
      totalPieces: totalPieces !== undefined ? totalPieces : campaign.totalPieces,
      publishedCount: publishedCount !== undefined ? publishedCount : campaign.publishedCount,
      schedule: schedule !== undefined ? schedule : campaign.schedule,
      keywordTargets: keywordTargets !== undefined ? keywordTargets : campaign.keywordTargets,
    },
    include: { _count: { select: { contentPieces: true } } },
  });

  return NextResponse.json(updated);
}

// DELETE /api/sites/:id/seo/campaigns/:cid
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; cid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, cid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: cid, siteId: id },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  // ContentPieces are cascade deleted via onDelete: Cascade in the schema
  await prisma.campaign.delete({ where: { id: cid } });

  return NextResponse.json({ success: true });
}
