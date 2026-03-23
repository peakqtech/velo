import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/geo/snapshots — query results
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
  const query = url.searchParams.get("query");
  const cited = url.searchParams.get("cited");
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
  const offset = Number(url.searchParams.get("offset")) || 0;

  const where: Record<string, unknown> = { siteId: id };
  if (engine) where.engine = engine;
  if (query) where.query = { contains: query, mode: "insensitive" };
  if (cited !== null && cited !== undefined && cited !== "")
    where.cited = cited === "true";

  const [snapshots, total] = await Promise.all([
    prisma.geoSnapshot.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.geoSnapshot.count({ where }),
  ]);

  return NextResponse.json({ data: snapshots, total, limit, offset });
}
