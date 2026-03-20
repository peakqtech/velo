import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import type { Prisma } from "@prisma/client";

// GET /api/sites/:id/opportunities — filterable list
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

  const url = new URL(request.url);
  const signal = url.searchParams.get("signal");
  const channel = url.searchParams.get("channel");
  const status = url.searchParams.get("status");
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
  const offset = Number(url.searchParams.get("offset")) || 0;

  const where: Prisma.ContentOpportunityWhereInput = { siteId: id };
  if (signal) where.signal = signal as Prisma.ContentOpportunityWhereInput["signal"];
  if (channel) where.channel = channel as Prisma.ContentOpportunityWhereInput["channel"];
  if (status) where.status = status as Prisma.ContentOpportunityWhereInput["status"];

  const [opportunities, total] = await Promise.all([
    prisma.contentOpportunity.findMany({
      where,
      orderBy: { score: "desc" },
      take: limit,
      skip: offset,
      include: {
        contentPiece: { select: { id: true, title: true, status: true } },
      },
    }),
    prisma.contentOpportunity.count({ where }),
  ]);

  return NextResponse.json({ data: opportunities, total, limit, offset });
}
