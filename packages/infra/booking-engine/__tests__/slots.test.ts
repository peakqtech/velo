import { describe, it, expect } from "vitest";
import {
  calculateAvailableSlots,
  generateTimeSlots,
  isSlotAvailable,
  isPastDate,
  calculateDeposit,
} from "../src/slots";
import type { ReservationConfig } from "../src/types";

const baseConfig: ReservationConfig = {
  enabled: true,
  schedule: [
    { day: 1, slots: [{ start: "11:00", end: "14:00" }, { start: "18:00", end: "22:00" }] }, // Monday
    { day: 2, slots: [{ start: "11:00", end: "14:00" }, { start: "18:00", end: "22:00" }] }, // Tuesday
    { day: 5, slots: [{ start: "18:00", end: "23:00" }] }, // Friday (dinner only)
  ],
  slotIntervalMinutes: 60,
  maxPartySize: 10,
  slotsPerTimeBlock: 5,
  blockedDates: ["2026-12-25"],
  deposit: { required: false, amount: 0, currency: "IDR", perPerson: false },
  notifications: {
    ownerWhatsApp: "+6281234567890",
    ownerEmail: "owner@restaurant.com",
    customerWhatsApp: true,
    messageTemplate: "New reservation: {guestName}, {date} at {time}, {partySize} guests",
  },
  confirmationMessage: "Your reservation has been confirmed!",
};

describe("generateTimeSlots", () => {
  it("generates hourly slots between start and end", () => {
    const slots = generateTimeSlots("18:00", "22:00", 60);
    expect(slots).toEqual(["18:00", "19:00", "20:00", "21:00"]);
  });

  it("generates 30-minute slots", () => {
    const slots = generateTimeSlots("18:00", "20:00", 30);
    expect(slots).toEqual(["18:00", "18:30", "19:00", "19:30"]);
  });

  it("generates 15-minute slots", () => {
    const slots = generateTimeSlots("09:00", "10:00", 15);
    expect(slots).toEqual(["09:00", "09:15", "09:30", "09:45"]);
  });

  it("returns empty for same start and end", () => {
    expect(generateTimeSlots("18:00", "18:00", 60)).toEqual([]);
  });
});

describe("calculateAvailableSlots", () => {
  it("returns slots for a scheduled day", () => {
    // Monday (day 1) — 2026-03-16 is a Monday
    const slots = calculateAvailableSlots(baseConfig, "2026-03-16", []);
    // Lunch: 11:00, 12:00, 13:00 + Dinner: 18:00, 19:00, 20:00, 21:00
    expect(slots).toHaveLength(7);
    expect(slots[0].time).toBe("11:00");
    expect(slots[6].time).toBe("21:00");
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it("returns empty for unscheduled day", () => {
    // Sunday (day 0) — not in schedule
    const slots = calculateAvailableSlots(baseConfig, "2026-03-22", []);
    expect(slots).toHaveLength(0);
  });

  it("returns empty for blocked date", () => {
    const slots = calculateAvailableSlots(baseConfig, "2026-12-25", []);
    expect(slots).toHaveLength(0);
  });

  it("marks slots as unavailable when at capacity", () => {
    const bookings = [
      { time: "19:00", status: "CONFIRMED" },
      { time: "19:00", status: "CONFIRMED" },
      { time: "19:00", status: "CONFIRMED" },
      { time: "19:00", status: "CONFIRMED" },
      { time: "19:00", status: "CONFIRMED" }, // 5 bookings = at capacity
    ];
    const slots = calculateAvailableSlots(baseConfig, "2026-03-16", bookings);
    const slot19 = slots.find((s) => s.time === "19:00");
    expect(slot19?.available).toBe(false);
    expect(slot19?.currentBookings).toBe(5);
  });

  it("ignores cancelled bookings when counting", () => {
    const bookings = [
      { time: "19:00", status: "CONFIRMED" },
      { time: "19:00", status: "CANCELLED" },
      { time: "19:00", status: "CANCELLED" },
    ];
    const slots = calculateAvailableSlots(baseConfig, "2026-03-16", bookings);
    const slot19 = slots.find((s) => s.time === "19:00");
    expect(slot19?.available).toBe(true);
    expect(slot19?.currentBookings).toBe(1);
  });

  it("counts PENDING_DEPOSIT as active booking", () => {
    const bookings = Array.from({ length: 5 }, () => ({
      time: "20:00",
      status: "PENDING_DEPOSIT",
    }));
    const slots = calculateAvailableSlots(baseConfig, "2026-03-16", bookings);
    const slot20 = slots.find((s) => s.time === "20:00");
    expect(slot20?.available).toBe(false);
  });

  it("handles multiple time ranges in one day", () => {
    // Monday has lunch (11-14) + dinner (18-22)
    const slots = calculateAvailableSlots(baseConfig, "2026-03-16", []);
    const times = slots.map((s) => s.time);
    expect(times).toContain("11:00");
    expect(times).toContain("13:00");
    expect(times).not.toContain("15:00"); // Gap between lunch and dinner
    expect(times).toContain("18:00");
  });
});

describe("isSlotAvailable", () => {
  it("returns true for available slot", () => {
    expect(isSlotAvailable(baseConfig, "2026-03-16", "19:00", [])).toBe(true);
  });

  it("returns false for full slot", () => {
    const bookings = Array.from({ length: 5 }, () => ({ time: "19:00", status: "CONFIRMED" }));
    expect(isSlotAvailable(baseConfig, "2026-03-16", "19:00", bookings)).toBe(false);
  });

  it("returns false for non-existent slot", () => {
    expect(isSlotAvailable(baseConfig, "2026-03-16", "15:00", [])).toBe(false);
  });

  it("returns false for blocked date", () => {
    expect(isSlotAvailable(baseConfig, "2026-12-25", "19:00", [])).toBe(false);
  });
});

describe("isPastDate", () => {
  it("returns true for past date", () => {
    expect(isPastDate("2020-01-01")).toBe(true);
  });

  it("returns false for future date", () => {
    expect(isPastDate("2030-12-31")).toBe(false);
  });
});

describe("calculateDeposit", () => {
  it("returns 0 when deposit not required", () => {
    expect(calculateDeposit(baseConfig, 4)).toBe(0);
  });

  it("returns fixed amount when required", () => {
    const config = {
      ...baseConfig,
      deposit: { required: true, amount: 100000, currency: "IDR", perPerson: false },
    };
    expect(calculateDeposit(config, 4)).toBe(100000);
  });

  it("returns per-person amount when configured", () => {
    const config = {
      ...baseConfig,
      deposit: { required: true, amount: 50000, currency: "IDR", perPerson: true },
    };
    expect(calculateDeposit(config, 4)).toBe(200000); // 50k × 4
  });
});
