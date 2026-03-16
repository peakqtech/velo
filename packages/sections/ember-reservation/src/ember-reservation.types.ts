import type { ReservationConfig } from "@velo/booking-engine";

export interface EmberReservationProps {
  content: import("@velo/types").EmberReservationContent;
  /** Optional reservation config for the booking engine. */
  reservationConfig?: ReservationConfig;
  /** API base URL for fetching slots and creating reservations. Defaults to "" (same origin). */
  apiBaseUrl?: string;
}
