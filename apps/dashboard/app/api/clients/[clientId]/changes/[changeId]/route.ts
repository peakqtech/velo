import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// PATCH /api/clients/[clientId]/changes/[changeId] — update change request
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string; changeId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { changeId } = await params;
  const body = await req.json();
  const { status, assignedToId, notes } = body;

  const data: Record<string, unknown> = {};
  if (status !== undefined) data.status = status;
  if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
  if (notes !== undefined) data.notes = notes || null;

  // If status is DONE, set completedAt
  if (status === "DONE") {
    data.completedAt = new Date();
  }

  const change = await prisma.changeRequest.update({
    where: { id: changeId },
    data,
    include: {
      assignedTo: { select: { id: true, name: true } },
      site: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(change);
}
