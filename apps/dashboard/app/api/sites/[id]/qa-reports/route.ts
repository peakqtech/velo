import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const site = await prisma.site.findFirst({ where: { id, ownerId: session.user.id } });
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const reports = await prisma.qAReport.findMany({
    where: { siteId: id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json(reports);
}
