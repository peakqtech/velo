import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/seo/content/:pid
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; pid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, pid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const piece = await prisma.contentPiece.findFirst({
    where: { id: pid, siteId: id },
    include: {
      campaign: true,
      contentTemplate: true,
    },
  });
  if (!piece) {
    return NextResponse.json({ error: "Content piece not found" }, { status: 404 });
  }

  return NextResponse.json(piece);
}

// PUT /api/sites/:id/seo/content/:pid
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; pid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, pid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const piece = await prisma.contentPiece.findFirst({
    where: { id: pid, siteId: id },
  });
  if (!piece) {
    return NextResponse.json({ error: "Content piece not found" }, { status: 404 });
  }

  const body = await request.json();
  const {
    title,
    slug,
    targetKeyword,
    outline,
    content,
    metaData,
    status,
    reviewNote,
    scheduledFor,
    channel,
  } = body;

  const updated = await prisma.contentPiece.update({
    where: { id: pid },
    data: {
      title: title !== undefined ? title : piece.title,
      slug: slug !== undefined ? slug : piece.slug,
      targetKeyword: targetKeyword !== undefined ? targetKeyword : piece.targetKeyword,
      outline: outline !== undefined ? outline : piece.outline,
      content: content !== undefined ? content : piece.content,
      metaData: metaData !== undefined ? metaData : piece.metaData,
      status: status !== undefined ? status : piece.status,
      reviewNote: reviewNote !== undefined ? reviewNote : piece.reviewNote,
      scheduledFor: scheduledFor !== undefined ? (scheduledFor ? new Date(scheduledFor) : null) : piece.scheduledFor,
      channel: channel !== undefined ? channel : piece.channel,
    },
    include: {
      campaign: true,
      contentTemplate: true,
    },
  });

  return NextResponse.json(updated);
}
