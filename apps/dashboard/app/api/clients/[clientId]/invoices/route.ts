import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/clients/[clientId]/invoices — list invoices for client
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  const invoices = await prisma.invoice.findMany({
    where: { clientId },
    orderBy: { dueDate: "desc" },
  });

  return NextResponse.json(invoices);
}

// POST /api/clients/[clientId]/invoices — create invoice
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
  const { amount, currency, period, dueDate, notes, status } = body;

  if (!amount || !period || !dueDate) {
    return NextResponse.json(
      { error: "Amount, period, and due date are required" },
      { status: 400 }
    );
  }

  const invoice = await prisma.invoice.create({
    data: {
      clientId,
      amount,
      currency: currency || "IDR",
      period,
      dueDate: new Date(dueDate),
      status: status || "SENT",
      notes: notes || null,
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
