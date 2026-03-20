import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/geo/scores — visibility scores over time
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
  const engine = url.searchParams.get("engine");
  const limit = Math.min(Number(url.searchParams.get("limit")) || 12, 52);

  const where: Record<string, unknown> = { siteId: id };
  if (engine) where.engine = engine;

  const scores = await prisma.geoScore.findMany({
    where,
    orderBy: { period: "desc" },
    take: limit,
  });

  return NextResponse.json(scores);
}
