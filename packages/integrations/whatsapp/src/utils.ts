/**
 * Generate a WhatsApp click-to-chat URL.
 * Uses wa.me link (no API cost, works globally).
 */
export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  // Strip non-numeric chars except leading +
  const cleaned = phoneNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const base = `https://wa.me/${cleaned}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

/**
 * Check if current time is within business hours.
 */
export function isWithinBusinessHours(
  schedule: Array<{ days: number[]; start: string; end: string }>,
  timezone: string
): boolean {
  if (schedule.length === 0) return true;

  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0");
  const dayName = parts.find((p) => p.type === "weekday")?.value ?? "";

  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dayNum = dayMap[dayName] ?? 0;
  const currentMinutes = hour * 60 + minute;

  return schedule.some((slot) => {
    if (!slot.days.includes(dayNum)) return false;
    const [startH, startM] = slot.start.split(":").map(Number);
    const [endH, endM] = slot.end.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
}
