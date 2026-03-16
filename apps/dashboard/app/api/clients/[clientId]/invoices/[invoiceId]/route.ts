import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// PATCH /api/clients/[clientId]/invoices/[invoiceId] — update invoice status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string; invoiceId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { invoiceId } = await params;
  const body = await req.json();
  const { status, notes } = body;

  const data: Record<string, unknown> = {};
  if (status !== undefined) data.status = status;
  if (notes !== undefined) data.notes = notes || null;

  // If marking as paid, set paidDate
  if (status === "PAID") {
    data.paidDate = new Date();
  }

  const invoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data,
  });

  // If invoice is marked as paid, update client payment status
  if (status === "PAID") {
    const { clientId } = await params;
    // Check if all invoices for this client are paid
    const unpaidCount = await prisma.invoice.count({
      where: {
        clientId,
        status: { notIn: ["PAID", "CANCELLED"] },
        id: { not: invoiceId },
      },
    });

    if (unpaidCount === 0) {
      await prisma.client.update({
        where: { id: clientId },
        data: {
          paymentStatus: "PAID",
          lastPaymentDate: new Date(),
        },
      });
    }
  }

  return NextResponse.json(invoice);
}
