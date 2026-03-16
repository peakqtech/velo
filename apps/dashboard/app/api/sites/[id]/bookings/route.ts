import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/bookings — list bookings ordered by date desc, limit 50
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
    select: { id: true },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const bookings = await prisma.booking.findMany({
    where: { siteId: id },
    orderBy: { date: "desc" },
    take: 50,
    select: {
      id: true,
      date: true,
      time: true,
      guestName: true,
      guestPhone: true,
      guestEmail: true,
      partySize: true,
      status: true,
      notes: true,
      depositAmount: true,
      depositPaid: true,
      createdAt: true,
    },
  });

  return NextResponse.json(bookings);
}

// PATCH /api/sites/:id/bookings — update a booking's status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { bookingId, status } = await req.json();

  if (!bookingId || !status) {
    return NextResponse.json(
      { error: "bookingId and status are required" },
      { status: 400 }
    );
  }

  const validStatuses = ["CONFIRMED", "CANCELLED", "PENDING", "PENDING_DEPOSIT"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  // Verify site ownership
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
    select: { id: true },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  // Verify booking belongs to site
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, siteId: id },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return NextResponse.json(updated);
}
