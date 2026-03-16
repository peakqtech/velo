import { z } from "zod";

/** Days of week: 0=Sun, 1=Mon, ..., 6=Sat */
export const dayScheduleSchema = z.object({
  day: z.number().min(0).max(6),
  slots: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/), // "09:00"
    end: z.string().regex(/^\d{2}:\d{2}$/),   // "14:00"
  })),
});

export const reservationConfigSchema = z.object({
  enabled: z.boolean().default(true),
  schedule: z.array(dayScheduleSchema), // Which days/hours are available
  slotIntervalMinutes: z.number().min(15).max(120).default(60),
  maxPartySize: z.number().min(1).max(50).default(10),
  slotsPerTimeBlock: z.number().min(1).max(100).default(5), // Max concurrent reservations per slot
  blockedDates: z.array(z.string()).default([]), // ["2026-12-25", "2026-01-01"]
  deposit: z.object({
    required: z.boolean().default(false),
    amount: z.number().min(0).default(0), // In smallest currency unit
    currency: z.string().default("IDR"),
    perPerson: z.boolean().default(false), // If true, amount × partySize
  }).default({}),
  notifications: z.object({
    ownerWhatsApp: z.string().optional(), // Phone number
    ownerEmail: z.string().email().optional(),
    customerWhatsApp: z.boolean().default(true), // Send confirmation to customer
    messageTemplate: z.string().default(
      "New reservation: {guestName}, {date} at {time}, {partySize} guests"
    ),
  }).default({}),
  confirmationMessage: z.string().default("Your reservation has been confirmed!"),
});

export type ReservationConfig = z.infer<typeof reservationConfigSchema>;
export type DaySchedule = z.infer<typeof dayScheduleSchema>;

export interface TimeSlot {
  time: string;       // "19:00"
  available: boolean;
  currentBookings: number;
  maxBookings: number;
}

export interface BookingRequest {
  date: string;       // "2026-03-20"
  time: string;       // "19:00"
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  partySize: number;
  notes?: string;
}

export const bookingRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guestName: z.string().min(1).max(200),
  guestPhone: z.string().min(8).max(20),
  guestEmail: z.string().email().optional(),
  partySize: z.number().min(1).max(50),
  notes: z.string().max(500).optional(),
});
