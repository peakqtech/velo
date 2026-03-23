import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/clients/[clientId]/changes — list change requests for client
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  const changes = await prisma.changeRequest.findMany({
    where: { clientId },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      site: { select: { id: true, name: true } },
    },
    orderBy: { requestedAt: "desc" },
  });

  return NextResponse.json(changes);
}

// POST /api/clients/[clientId]/changes — create a new change request
export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;
  const body = await req.json();
  const { title, description, priority, siteId, assignedToId } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 }
    );
  }

  const change = await prisma.changeRequest.create({
    data: {
      clientId,
      title,
      description,
      priority: priority || "normal",
      siteId: siteId || null,
      assignedToId: assignedToId || null,
    },
    include: {
      assignedTo: { select: { id: true, name: true } },
      site: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(change, { status: 201 });
}
