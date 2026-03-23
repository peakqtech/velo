import { NextRequest, NextResponse } from "next/server";
import { calculateAvailableSlots, reservationConfigSchema } from "@velo/booking-engine";
import type { ReservationConfig, TimeSlot } from "@velo/booking-engine";
import { prisma } from "@velo/db";

/** Demo slots returned when VELO_SITE_ID is not configured (local dev). */
function getDemoSlots(date: string): TimeSlot[] {
  const times = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  return times.map((time, i) => ({
    time,
    available: i !== 3, // 19:30 is "full" for demo
    currentBookings: i === 3 ? 5 : Math.floor(Math.random() * 3),
    maxBookings: 5,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid or missing 'date' parameter. Expected format: YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const siteId = process.env.VELO_SITE_ID;

    // Dev mode: return demo slots when no site ID configured
    if (!siteId) {
      return NextResponse.json(getDemoSlots(date));
    }

    // Fetch site content to get reservation config
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
        { error: "Reservation config not found for this site" },
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

    // Fetch existing bookings for this date
    const existingBookings = await prisma.booking.findMany({
      where: { siteId, date },
      select: { time: true, status: true },
    });

    const slots = calculateAvailableSlots(config, date, existingBookings);

    return NextResponse.json(slots);
  } catch (error) {
    console.error("[API /api/slots] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
