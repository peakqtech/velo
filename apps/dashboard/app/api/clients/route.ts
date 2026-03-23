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
  const includeStats = url.searchParams.get("includeStats") === "true";

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

  // Only compute expensive stats when explicitly requested
  if (!includeStats) {
    return NextResponse.json(clients);
  }

  // Batch-fetch pending counts and last activity in 2 queries instead of 3N
  const [pendingCounts, lastSites, lastChanges] = await Promise.all([
    prisma.changeRequest.groupBy({
      by: ["clientId"],
      where: { status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] } },
      _count: { id: true },
    }),
    prisma.site.groupBy({
      by: ["clientId"],
      _max: { updatedAt: true },
    }),
    prisma.changeRequest.groupBy({
      by: ["clientId"],
      _max: { requestedAt: true },
    }),
  ]);

  const pendingMap = new Map(pendingCounts.map((r) => [r.clientId, r._count.id]));
  const lastSiteMap = new Map(lastSites.map((r) => [r.clientId, r._max.updatedAt]));
  const lastChangeMap = new Map(lastChanges.map((r) => [r.clientId, r._max.requestedAt]));

  const enriched = clients.map((client) => {
    const dates = [lastSiteMap.get(client.id), lastChangeMap.get(client.id), client.updatedAt]
      .filter(Boolean)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime());

    return {
      ...client,
      pendingChanges: pendingMap.get(client.id) ?? 0,
      lastActivity: dates[0] ? new Date(dates[0]).toISOString() : null,
    };
  });

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
