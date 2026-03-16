"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { EmberReservationProps } from "./ember-reservation.types";
import type { TimeSlot } from "@velo/booking-engine";
import { fadeInUp } from "@velo/animations";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Step = 1 | 2 | 3;

interface GuestDetails {
  partySize: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  notes: string;
}

interface BookingResult {
  id: string;
  date: string;
  time: string;
  guestName: string;
  partySize: number;
  status: string;
  depositAmount?: number;
  confirmationMessage: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getNext14Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                        */
/* -------------------------------------------------------------------------- */

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

/* -------------------------------------------------------------------------- */
/*  Spinner                                                                   */
/* -------------------------------------------------------------------------- */

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export function EmberReservation({ content, reservationConfig, apiBaseUrl = "" }: EmberReservationProps) {
  const { heading, subtitle, phone, address, hours } = content;
  const shouldReduceMotion = useReducedMotion();

  const maxPartySize = reservationConfig?.maxPartySize ?? 10;
  const depositRequired = reservationConfig?.deposit?.required ?? false;
  const depositAmount = reservationConfig?.deposit?.amount ?? 0;
  const depositCurrency = reservationConfig?.deposit?.currency ?? "IDR";
  const depositPerPerson = reservationConfig?.deposit?.perPerson ?? false;

  /* ---- State ---- */
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [guest, setGuest] = useState<GuestDetails>({
    partySize: 2,
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const next14Days = useMemo(getNext14Days, []);

  /* ---- Fetch slots for a date ---- */
  const fetchSlots = useCallback(
    async (date: string) => {
      setLoadingSlots(true);
      setSlotsError(null);
      setSlots([]);
      setSelectedTime(null);
      try {
        const res = await fetch(`${apiBaseUrl}/api/slots?date=${date}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Failed to load time slots (${res.status})`);
        }
        const data: TimeSlot[] = await res.json();
        setSlots(data);
      } catch (err) {
        setSlotsError(err instanceof Error ? err.message : "Failed to load time slots");
      } finally {
        setLoadingSlots(false);
      }
    },
    [apiBaseUrl]
  );

  /* ---- Select a date ---- */
  const handleDateSelect = useCallback(
    (date: string) => {
      setSelectedDate(date);
      fetchSlots(date);
    },
    [fetchSlots]
  );

  /* ---- Submit reservation ---- */
  const handleSubmit = useCallback(async () => {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          guestName: guest.guestName,
          guestPhone: guest.guestPhone,
          guestEmail: guest.guestEmail || undefined,
          partySize: guest.partySize,
          notes: guest.notes || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Reservation failed (${res.status})`);
      }
      const data = await res.json();
      setBookingResult({
        id: data.booking.id,
        date: data.booking.date,
        time: data.booking.time,
        guestName: data.booking.guestName,
        partySize: data.booking.partySize,
        status: data.booking.status,
        depositAmount: data.booking.depositAmount,
        confirmationMessage: data.confirmationMessage,
      });
      setStep(3);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create reservation");
    } finally {
      setSubmitting(false);
    }
  }, [apiBaseUrl, selectedDate, selectedTime, guest]);

  /* ---- Step 2 validation ---- */
  const step2Valid = guest.guestName.trim().length > 0 && guest.guestPhone.trim().length >= 8;

  /* ---- Computed deposit display ---- */
  const displayDeposit = useMemo(() => {
    if (!depositRequired) return null;
    const total = depositPerPerson ? depositAmount * guest.partySize : depositAmount;
    return `${depositCurrency} ${total.toLocaleString()}`;
  }, [depositRequired, depositPerPerson, depositAmount, depositCurrency, guest.partySize]);

  /* ---- Transition config ---- */
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: "easeInOut" };

  /* ======================================================================== */
  /*  Render                                                                  */
  /* ======================================================================== */

  return (
    <section
      className="ember-reservation-section py-section px-6 bg-background"
      aria-label="Reservation"
    >
      <div className="mx-auto max-w-3xl">
        {/* ---- Header ---- */}
        <motion.div
          className="text-center"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="mx-auto mb-6 h-[1px] w-12 bg-primary" />
          <h2 className="font-display text-4xl font-bold text-foreground md:text-6xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg italic text-muted">{subtitle}</p>
        </motion.div>

        {/* ---- Hours info ---- */}
        <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
          {hours.map((h, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                {h.days}
              </p>
              <p className="mt-1 text-muted">{h.time}</p>
            </div>
          ))}
        </div>

        {/* ---- Step indicator ---- */}
        <div className="mt-10 flex items-center justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-display font-bold transition-colors duration-300 ${
                  step >= s
                    ? "bg-primary text-white"
                    : "border border-muted/30 text-muted"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`hidden h-[1px] w-8 sm:block transition-colors duration-300 ${
                    step > s ? "bg-primary" : "bg-muted/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ---- Steps content ---- */}
        <div className="relative mt-10 min-h-[360px]">
          <AnimatePresence mode="wait">
            {/* ================================================================ */}
            {/*  STEP 1 — Date & Time                                            */}
            {/* ================================================================ */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                {/* Date picker */}
                <h3 className="mb-4 text-center font-display text-xl font-bold text-foreground">
                  Select a Date
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {next14Days.map((d) => {
                    const iso = formatDateISO(d);
                    const isSelected = selectedDate === iso;
                    return (
                      <button
                        key={iso}
                        onClick={() => handleDateSelect(iso)}
                        className={`rounded-md px-3 py-2 text-sm font-display transition-all duration-200 ${
                          isSelected
                            ? "bg-primary text-white shadow-md"
                            : "border border-muted/20 bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <span className="block text-[10px] uppercase tracking-wider opacity-70">
                          {d.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span className="block text-base font-bold">{d.getDate()}</span>
                        <span className="block text-[10px] uppercase tracking-wider opacity-70">
                          {d.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-center font-display text-xl font-bold text-foreground">
                      Select a Time
                    </h3>
                    {loadingSlots && <Spinner />}
                    {slotsError && (
                      <p className="text-center text-sm text-red-500">{slotsError}</p>
                    )}
                    {!loadingSlots && !slotsError && slots.length === 0 && (
                      <p className="text-center text-sm text-muted">
                        No available time slots for this date.
                      </p>
                    )}
                    {!loadingSlots && slots.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {slots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`relative rounded-md px-4 py-2 text-sm font-display transition-all duration-200 ${
                                !slot.available
                                  ? "cursor-not-allowed border border-muted/10 bg-muted/5 text-muted/40"
                                  : isSelected
                                    ? "bg-primary text-white shadow-md"
                                    : "border border-muted/20 bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                              }`}
                            >
                              {formatTime12(slot.time)}
                              {!slot.available && (
                                <span className="ml-1 text-[10px] uppercase tracking-wider">
                                  Full
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Next button */}
                <div className="mt-10 text-center">
                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(2)}
                    className="inline-block px-10 py-4 font-display text-lg tracking-wider transition-all duration-300 bg-primary text-white hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================================================================ */}
            {/*  STEP 2 — Guest details                                          */}
            {/* ================================================================ */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <h3 className="mb-6 text-center font-display text-xl font-bold text-foreground">
                  Guest Details
                </h3>

                <div className="mx-auto max-w-md space-y-5">
                  {/* Party size */}
                  <div>
                    <label className="mb-1.5 block text-sm font-display font-bold uppercase tracking-wider text-foreground">
                      Party Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: maxPartySize }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setGuest((g) => ({ ...g, partySize: n }))}
                          className={`h-10 w-10 rounded-full text-sm font-display font-bold transition-all duration-200 ${
                            guest.partySize === n
                              ? "bg-primary text-white"
                              : "border border-muted/20 text-foreground hover:border-primary/50"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-display font-bold uppercase tracking-wider text-foreground">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={guest.guestName}
                      onChange={(e) => setGuest((g) => ({ ...g, guestName: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full border border-muted/20 bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-sm font-display font-bold uppercase tracking-wider text-foreground">
                      Phone <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={guest.guestPhone}
                      onChange={(e) => setGuest((g) => ({ ...g, guestPhone: e.target.value }))}
                      placeholder="+62 812 3456 7890"
                      className="w-full border border-muted/20 bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-display font-bold uppercase tracking-wider text-foreground">
                      Email <span className="text-muted/50 text-xs normal-case">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={guest.guestEmail}
                      onChange={(e) => setGuest((g) => ({ ...g, guestEmail: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-muted/20 bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Special requests */}
                  <div>
                    <label className="mb-1.5 block text-sm font-display font-bold uppercase tracking-wider text-foreground">
                      Special Requests{" "}
                      <span className="text-muted/50 text-xs normal-case">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={guest.notes}
                      onChange={(e) => setGuest((g) => ({ ...g, notes: e.target.value }))}
                      placeholder="Allergies, celebrations, seating preferences..."
                      className="w-full resize-none border border-muted/20 bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Deposit notice */}
                  {displayDeposit && (
                    <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
                      A deposit of <strong>{displayDeposit}</strong> is required to secure your
                      reservation.
                    </div>
                  )}

                  {/* Error */}
                  {submitError && (
                    <p className="text-center text-sm text-red-500">{submitError}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-4 font-display text-lg tracking-wider border border-muted/20 text-foreground hover:border-primary/50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    disabled={!step2Valid || submitting}
                    onClick={handleSubmit}
                    className="px-10 py-4 font-display text-lg tracking-wider bg-primary text-white hover:bg-primary-light transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Confirming..." : "Confirm Reservation"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================================================================ */}
            {/*  STEP 3 — Confirmation                                           */}
            {/* ================================================================ */}
            {step === 3 && bookingResult && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="text-center"
              >
                {/* Success icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="font-display text-2xl font-bold text-foreground">
                  Reservation Confirmed
                </h3>
                <p className="mt-2 text-muted">{bookingResult.confirmationMessage}</p>

                {/* Summary card */}
                <div className="mx-auto mt-8 max-w-sm rounded-md border border-muted/20 bg-background p-6 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Date</span>
                      <span className="font-display font-bold text-foreground">
                        {formatDateDisplay(new Date(bookingResult.date + "T00:00:00"))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Time</span>
                      <span className="font-display font-bold text-foreground">
                        {formatTime12(bookingResult.time)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Guests</span>
                      <span className="font-display font-bold text-foreground">
                        {bookingResult.partySize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Name</span>
                      <span className="font-display font-bold text-foreground">
                        {bookingResult.guestName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Status</span>
                      <span className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                        {bookingResult.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deposit pay button (placeholder) */}
                {bookingResult.depositAmount != null && bookingResult.depositAmount > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        /* Placeholder: would link to payment flow */
                        alert("Payment integration coming soon.");
                      }}
                      className="inline-block px-10 py-4 font-display text-lg tracking-wider bg-primary text-white hover:bg-primary-light transition-all duration-300"
                    >
                      Pay Deposit
                    </button>
                  </div>
                )}

                {/* Contact info */}
                <div className="mt-8 space-y-1">
                  <p className="text-sm text-muted">{phone}</p>
                  <p className="text-sm text-muted">{address}</p>
                </div>

                {/* Book another */}
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setSlots([]);
                      setBookingResult(null);
                      setGuest({ partySize: 2, guestName: "", guestPhone: "", guestEmail: "", notes: "" });
                      setSubmitError(null);
                    }}
                    className="text-sm text-primary underline underline-offset-4 hover:text-primary-light transition-colors"
                  >
                    Make another reservation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
