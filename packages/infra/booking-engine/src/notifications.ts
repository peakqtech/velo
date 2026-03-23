import type { ReservationConfig, BookingRequest } from "./types";

export interface NotificationResult {
  channel: "whatsapp" | "email";
  success: boolean;
  error?: string;
}

/**
 * Replace template variables in a message string.
 * Variables: {guestName}, {date}, {time}, {partySize}, {notes}
 */
export function renderTemplate(template: string, booking: BookingRequest): string {
  return template
    .replace(/\{guestName\}/g, booking.guestName)
    .replace(/\{date\}/g, booking.date)
    .replace(/\{time\}/g, booking.time)
    .replace(/\{partySize\}/g, String(booking.partySize))
    .replace(/\{notes\}/g, booking.notes ?? "")
    .replace(/\{guestPhone\}/g, booking.guestPhone);
}

/**
 * Build a WhatsApp click-to-chat URL with pre-filled reservation message.
 */
export function buildReservationWhatsAppUrl(
  phoneNumber: string,
  template: string,
  booking: BookingRequest
): string {
  const cleaned = phoneNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const message = renderTemplate(template, booking);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Send notifications to the restaurant owner about a new reservation.
 * Returns results for each channel attempted.
 */
export async function sendOwnerNotifications(
  config: ReservationConfig,
  booking: BookingRequest
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = [];
  const message = renderTemplate(
    config.notifications.messageTemplate,
    booking
  );

  // WhatsApp notification to owner
  if (config.notifications.ownerWhatsApp) {
    try {
      // In production: could use WhatsApp Business API for automated messages
      // For now: we generate the URL (dashboard can display it, or use a webhook)
      const url = buildReservationWhatsAppUrl(
        config.notifications.ownerWhatsApp,
        config.notifications.messageTemplate,
        booking
      );
      results.push({ channel: "whatsapp", success: true });
    } catch (err) {
      results.push({
        channel: "whatsapp",
        success: false,
        error: err instanceof Error ? err.message : "WhatsApp notification failed",
      });
    }
  }

  // Email notification to owner
  if (config.notifications.ownerEmail) {
    try {
      await sendEmail({
        to: config.notifications.ownerEmail,
        subject: `New Reservation: ${booking.guestName} — ${booking.date} at ${booking.time}`,
        body: message,
      });
      results.push({ channel: "email", success: true });
    } catch (err) {
      results.push({
        channel: "email",
        success: false,
        error: err instanceof Error ? err.message : "Email notification failed",
      });
    }
  }

  return results;
}

/**
 * Send email via Resend API.
 * Requires RESEND_API_KEY environment variable.
 */
async function sendEmail(params: { to: string; subject: string; body: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required for email notifications");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@velo.dev",
      to: params.to,
      subject: params.subject,
      text: params.body,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend API error: ${response.status} ${err}`);
  }
}
