import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/approvals — pending approvals
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

  const approvals = await prisma.contentOpportunity.findMany({
    where: {
      siteId: id,
      status: "PENDING_APPROVAL",
      approvalStatus: "PENDING",
    },
    orderBy: [{ vetoDeadline: "asc" }, { score: "desc" }],
    include: {
      contentPiece: {
        select: { id: true, title: true, channel: true, status: true },
      },
    },
  });

  return NextResponse.json(approvals);
}
