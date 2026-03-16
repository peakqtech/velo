import { NextRequest, NextResponse } from "next/server";
import {
  bookingRequestSchema,
  reservationConfigSchema,
  isSlotAvailable,
  isPastDate,
  calculateDeposit,
  sendOwnerNotifications,
} from "@velo/booking-engine";
import type { ReservationConfig, BookingRequest } from "@velo/booking-engine";
import { prisma } from "@velo/db";

/** Mock success response for local dev without DB. */
function getMockResponse(body: BookingRequest) {
  return NextResponse.json({
    success: true,
    booking: {
      id: "demo_" + Date.now(),
      ...body,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    },
    confirmationMessage:
      "Your reservation has been confirmed! (Demo mode — no database connected)",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const parsed = bookingRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid reservation data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const booking = parsed.data;

    // Check for past date
    if (isPastDate(booking.date)) {
      return NextResponse.json(
        { error: "Cannot book a date in the past" },
        { status: 400 }
      );
    }

    const siteId = process.env.VELO_SITE_ID;

    // Dev mode: return mock success
    if (!siteId) {
      return getMockResponse(booking);
    }

    // Fetch site to get reservation config
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: { content: true },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const siteContent = site.content as Record<string, unknown>;
    const rawReservationConfig = (siteContent?.reservation as Record<string, unknown>)?.config;

    if (!rawReservationConfig) {
      return NextResponse.json(
        { error: "Reservation config not found" },
        { status: 404 }
      );
    }

    const config: ReservationConfig = reservationConfigSchema.parse(rawReservationConfig);

    if (!config.enabled) {
      return NextResponse.json(
        { error: "Reservations are currently disabled" },
        { status: 403 }
      );
    }

    if (booking.partySize > config.maxPartySize) {
      return NextResponse.json(
        { error: `Party size cannot exceed ${config.maxPartySize}` },
        { status: 400 }
      );
    }

    // Use a transaction to prevent race conditions:
    // 1. Check availability
    // 2. Create booking atomically
    const result = await prisma.$transaction(async (tx) => {
      // Fetch current bookings for this date+time within transaction
      const existingBookings = await tx.booking.findMany({
        where: { siteId, date: booking.date },
        select: { time: true, status: true },
      });

      // Check slot availability
      if (!isSlotAvailable(config, booking.date, booking.time, existingBookings)) {
        return { error: "This time slot is no longer available", status: 409 };
      }

      // Calculate deposit
      const depositAmount = calculateDeposit(config, booking.partySize);
      const initialStatus = depositAmount > 0 ? "PENDING_DEPOSIT" : "PENDING";

      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          siteId,
          date: booking.date,
          time: booking.time,
          guestName: booking.guestName,
          guestPhone: booking.guestPhone,
          guestEmail: booking.guestEmail,
          partySize: booking.partySize,
          notes: booking.notes,
          depositAmount: depositAmount > 0 ? depositAmount : null,
          status: initialStatus as "PENDING" | "PENDING_DEPOSIT",
        },
      });

      return { booking: newBooking, depositAmount };
    });

    // Check if the transaction returned an error
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    // Send owner notifications (best-effort, do not fail the request)
    sendOwnerNotifications(config, booking).catch((err) => {
      console.error("[API /api/reservations] Notification error:", err);
    });

    const confirmationMessage =
      result.depositAmount > 0
        ? `${config.confirmationMessage} A deposit of ${config.deposit.currency} ${result.depositAmount.toLocaleString()} is required to secure your reservation.`
        : config.confirmationMessage;

    return NextResponse.json({
      success: true,
      booking: {
        id: result.booking.id,
        date: result.booking.date,
        time: result.booking.time,
        guestName: result.booking.guestName,
        partySize: result.booking.partySize,
        status: result.booking.status,
        depositAmount: result.depositAmount,
        createdAt: result.booking.createdAt,
      },
      confirmationMessage,
    });
  } catch (error) {
    console.error("[API /api/reservations] Error:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}
