import type { ReservationConfig, TimeSlot } from "./types";

interface ExistingBooking {
  time: string;
  status: string;
}

/**
 * Generate all possible time slots for a given date based on the config.
 * Then mark which are available based on existing bookings.
 */
export function calculateAvailableSlots(
  config: ReservationConfig,
  date: string,
  existingBookings: ExistingBooking[]
): TimeSlot[] {
  // Check if date is blocked
  if (config.blockedDates.includes(date)) {
    return [];
  }

  // Determine day of week (0=Sun, 6=Sat)
  const dayOfWeek = new Date(date + "T00:00:00").getDay();

  // Find schedule for this day
  const daySchedule = config.schedule.find((s) => s.day === dayOfWeek);
  if (!daySchedule || daySchedule.slots.length === 0) {
    return []; // Restaurant closed this day
  }

  // Generate time slots from schedule ranges
  const allSlots: string[] = [];
  for (const range of daySchedule.slots) {
    const times = generateTimeSlots(range.start, range.end, config.slotIntervalMinutes);
    allSlots.push(...times);
  }

  // Count active bookings per slot (exclude cancelled/no-show)
  const activeStatuses = new Set(["PENDING", "CONFIRMED", "PENDING_DEPOSIT"]);
  const bookingCounts = new Map<string, number>();
  for (const booking of existingBookings) {
    if (activeStatuses.has(booking.status)) {
      bookingCounts.set(booking.time, (bookingCounts.get(booking.time) ?? 0) + 1);
    }
  }

  // Build slot availability
  return allSlots.map((time) => {
    const currentBookings = bookingCounts.get(time) ?? 0;
    return {
      time,
      available: currentBookings < config.slotsPerTimeBlock,
      currentBookings,
      maxBookings: config.slotsPerTimeBlock,
    };
  });
}

/**
 * Generate time strings at regular intervals between start and end.
 * E.g., generateTimeSlots("18:00", "22:00", 60) → ["18:00", "19:00", "20:00", "21:00"]
 */
export function generateTimeSlots(start: string, end: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  let current = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  while (current < endMinutes) {
    slots.push(minutesToTime(current));
    current += intervalMinutes;
  }

  return slots;
}

/**
 * Check if a specific slot is available for booking.
 */
export function isSlotAvailable(
  config: ReservationConfig,
  date: string,
  time: string,
  existingBookings: ExistingBooking[]
): boolean {
  const slots = calculateAvailableSlots(config, date, existingBookings);
  const slot = slots.find((s) => s.time === time);
  return slot?.available ?? false;
}

/**
 * Check if a date is in the past.
 */
export function isPastDate(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date + "T00:00:00");
  return target < today;
}

/**
 * Calculate deposit amount based on config and party size.
 */
export function calculateDeposit(config: ReservationConfig, partySize: number): number {
  if (!config.deposit.required) return 0;
  if (config.deposit.perPerson) {
    return config.deposit.amount * partySize;
  }
  return config.deposit.amount;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
