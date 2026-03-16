import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/clients — list all clients with counts
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const includeChanges = url.searchParams.get("includeChanges") === "true";
  const includeInvoices = url.searchParams.get("includeInvoices") === "true";

  const clients = await prisma.client.findMany({
    include: {
      _count: { select: { sites: true, changeRequests: true } },
      changeRequests: includeChanges
        ? {
            include: { site: { select: { id: true, name: true } }, assignedTo: { select: { id: true, name: true } } },
            orderBy: { requestedAt: "desc" },
          }
        : false,
      invoices: includeInvoices
        ? { orderBy: { dueDate: "desc" } }
        : false,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Compute pending changes count and last activity for each client
  const enriched = await Promise.all(
    clients.map(async (client) => {
      const pendingChanges = await prisma.changeRequest.count({
        where: { clientId: client.id, status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] } },
      });

      // Last activity: most recent site update or change request
      const lastSite = await prisma.site.findFirst({
        where: { clientId: client.id },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      });

      const lastChange = await prisma.changeRequest.findFirst({
        where: { clientId: client.id },
        orderBy: { requestedAt: "desc" },
        select: { requestedAt: true },
      });

      const lastActivity = [lastSite?.updatedAt, lastChange?.requestedAt, client.updatedAt]
        .filter(Boolean)
        .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] ?? null;

      return {
        ...client,
        pendingChanges,
        lastActivity: lastActivity ? new Date(lastActivity).toISOString() : null,
      };
    })
  );

  return NextResponse.json(enriched);
}

// POST /api/clients — create a new client
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, contactPerson, email, phone, whatsapp, plan, monthlyPrice, currency, notes } = body;

  if (!name || !contactPerson || !email) {
    return NextResponse.json(
      { error: "Name, contact person, and email are required" },
      { status: 400 }
    );
  }

  const client = await prisma.client.create({
    data: {
      name,
      contactPerson,
      email,
      phone: phone || null,
      whatsapp: whatsapp || null,
      plan: plan || "BASIC",
      monthlyPrice: monthlyPrice || 0,
      currency: currency || "IDR",
      notes: notes || null,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
