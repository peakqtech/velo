import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/clients/[clientId] — single client with sites, changes, invoices
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      sites: {
        include: {
          qaReports: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { healthScore: true },
          },
        },
      },
      changeRequests: {
        include: {
          assignedTo: { select: { id: true, name: true } },
          site: { select: { id: true, name: true } },
        },
        orderBy: { requestedAt: "desc" },
      },
      invoices: {
        orderBy: { dueDate: "desc" },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json(client);
}

// PUT /api/clients/[clientId] — update client info
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;
  const body = await req.json();
  const { name, contactPerson, email, phone, whatsapp, plan, monthlyPrice, currency, paymentStatus, notes } = body;

  const client = await prisma.client.update({
    where: { id: clientId },
    data: {
      ...(name !== undefined && { name }),
      ...(contactPerson !== undefined && { contactPerson }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(whatsapp !== undefined && { whatsapp: whatsapp || null }),
      ...(plan !== undefined && { plan }),
      ...(monthlyPrice !== undefined && { monthlyPrice }),
      ...(currency !== undefined && { currency }),
      ...(paymentStatus !== undefined && { paymentStatus }),
      ...(notes !== undefined && { notes: notes || null }),
    },
  });

  return NextResponse.json(client);
}

// DELETE /api/clients/[clientId] — delete client
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  await prisma.client.delete({ where: { id: clientId } });

  return NextResponse.json({ success: true });
}
