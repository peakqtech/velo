import { describe, it, expect } from "vitest";
import { renderTemplate, buildReservationWhatsAppUrl } from "../src/notifications";
import type { BookingRequest } from "../src/types";

const mockBooking: BookingRequest = {
  date: "2026-03-20",
  time: "19:00",
  guestName: "John Doe",
  guestPhone: "+6281234567890",
  partySize: 4,
  notes: "Window seat please",
};

describe("renderTemplate", () => {
  it("replaces all template variables", () => {
    const template = "Reservation: {guestName}, {date} at {time}, {partySize} guests. Notes: {notes}";
    const result = renderTemplate(template, mockBooking);
    expect(result).toBe("Reservation: John Doe, 2026-03-20 at 19:00, 4 guests. Notes: Window seat please");
  });

  it("replaces multiple occurrences of same variable", () => {
    const template = "{guestName} booked for {guestName}";
    expect(renderTemplate(template, mockBooking)).toBe("John Doe booked for John Doe");
  });

  it("handles missing notes gracefully", () => {
    const booking = { ...mockBooking, notes: undefined };
    const result = renderTemplate("Notes: {notes}", booking);
    expect(result).toBe("Notes: ");
  });

  it("replaces guestPhone variable", () => {
    const result = renderTemplate("Phone: {guestPhone}", mockBooking);
    expect(result).toBe("Phone: +6281234567890");
  });
});

describe("buildReservationWhatsAppUrl", () => {
  it("builds correct wa.me URL with encoded message", () => {
    const url = buildReservationWhatsAppUrl(
      "+6281234567890",
      "New reservation: {guestName}, {date} at {time}",
      mockBooking
    );
    expect(url).toContain("https://wa.me/6281234567890");
    expect(url).toContain("text=");
    expect(url).toContain("John%20Doe");
    expect(url).toContain("2026-03-20");
    expect(url).toContain("19%3A00");
  });

  it("strips non-numeric characters from phone", () => {
    const url = buildReservationWhatsAppUrl(
      "+62 812-3456-7890",
      "Hi",
      mockBooking
    );
    expect(url.startsWith("https://wa.me/6281234567890")).toBe(true);
  });
});
