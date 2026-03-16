"use client";

import { useState, useEffect, useCallback } from "react";
import { useActiveSite, useSiteContent } from "@/lib/hooks";
import { fetchAPI } from "@/lib/api";
import type { ReservationConfig } from "@velo/booking-engine/src/types";

// ── Day helpers ──────────────────────────────────────────────────────
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0]; // Mon=1 … Sun=0

const SLOT_INTERVAL_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
];

const CURRENCIES = ["IDR", "USD", "SGD"];

// ── Booking status colours ───────────────────────────────────────────
const STATUS_COLOURS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  CONFIRMED: "bg-green-500/20 text-green-400",
  PENDING_DEPOSIT: "bg-orange-500/20 text-orange-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

// ── Default config ───────────────────────────────────────────────────
function defaultConfig(): ReservationConfig {
  return {
    enabled: true,
    schedule: DAY_INDICES.map((day) => ({
      day,
      slots: [
        { start: "11:00", end: "14:00" },
        { start: "18:00", end: "22:00" },
      ],
    })),
    slotIntervalMinutes: 60,
    maxPartySize: 10,
    slotsPerTimeBlock: 5,
    blockedDates: [],
    deposit: { required: false, amount: 0, currency: "IDR", perPerson: false },
    notifications: {
      ownerWhatsApp: "",
      ownerEmail: "",
      customerWhatsApp: true,
      messageTemplate:
        "New reservation: {guestName}, {date} at {time}, {partySize} guests",
    },
    confirmationMessage: "Your reservation has been confirmed!",
  };
}

// ── Tiny toggle component ────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      {label && <span className="text-sm text-zinc-300">{label}</span>}
    </label>
  );
}

// =====================================================================
// Main page
// =====================================================================
export default function ReservationsPage() {
  const { site, loading: siteLoading } = useActiveSite();
  const { content, loading: contentLoading, saveSection } = useSiteContent(
    site?.id ?? null
  );

  const [activeTab, setActiveTab] = useState<"settings" | "bookings">("settings");

  if (siteLoading || contentLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Loading...
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        No site found. Create one first.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Reservations</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure your restaurant reservation system and manage bookings.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 mb-6">
        {(["settings", "bookings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-500 -mb-px"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "settings" ? (
        <SettingsTab
          siteId={site.id}
          initialConfig={(content as any)?.reservation ?? null}
          saveSection={saveSection}
        />
      ) : (
        <BookingsTab siteId={site.id} />
      )}
    </div>
  );
}

// =====================================================================
// Settings Tab
// =====================================================================
function SettingsTab({
  siteId,
  initialConfig,
  saveSection,
}: {
  siteId: string;
  initialConfig: ReservationConfig | null;
  saveSection: (key: string, data: unknown) => Promise<any>;
}) {
  const [config, setConfig] = useState<ReservationConfig>(
    initialConfig ?? defaultConfig()
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────
  function patch(partial: Partial<ReservationConfig>) {
    setConfig((prev) => ({ ...prev, ...partial }));
  }

  function patchDeposit(partial: Partial<ReservationConfig["deposit"]>) {
    setConfig((prev) => ({
      ...prev,
      deposit: { ...prev.deposit, ...partial },
    }));
  }

  function patchNotifications(
    partial: Partial<ReservationConfig["notifications"]>
  ) {
    setConfig((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...partial },
    }));
  }

  function updateScheduleSlot(
    dayIdx: number,
    slotIdx: number,
    field: "start" | "end",
    value: string
  ) {
    setConfig((prev) => {
      const schedule = prev.schedule.map((ds) => {
        if (ds.day !== DAY_INDICES[dayIdx]) return ds;
        const slots = ds.slots.map((s, si) =>
          si === slotIdx ? { ...s, [field]: value } : s
        );
        return { ...ds, slots };
      });
      return { ...prev, schedule };
    });
  }

  function toggleDay(dayIdx: number) {
    setConfig((prev) => {
      const dayNum = DAY_INDICES[dayIdx];
      const exists = prev.schedule.find((ds) => ds.day === dayNum);
      let schedule: ReservationConfig["schedule"];
      if (exists) {
        schedule = prev.schedule.filter((ds) => ds.day !== dayNum);
      } else {
        schedule = [
          ...prev.schedule,
          {
            day: dayNum,
            slots: [
              { start: "11:00", end: "14:00" },
              { start: "18:00", end: "22:00" },
            ],
          },
        ];
      }
      return { ...prev, schedule };
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await saveSection("reservation", config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // ── Input class shortcuts ──────────────────────────────────────
  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 transition-colors";
  const selectCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-colors";
  const sectionCls = "rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4";
  const labelCls = "block text-sm font-medium text-zinc-300 mb-1";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Enable Reservations */}
      <div className={sectionCls}>
        <Toggle
          checked={config.enabled}
          onChange={(v) => patch({ enabled: v })}
          label="Enable Reservations"
        />
      </div>

      {/* Operating Schedule */}
      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-zinc-100">
          Operating Schedule
        </h3>
        <p className="text-xs text-zinc-500">
          Set lunch and dinner service hours for each day. Use 24-hour format.
        </p>
        <div className="space-y-3 mt-2">
          {DAY_LABELS.map((label, idx) => {
            const dayNum = DAY_INDICES[idx];
            const daySchedule = config.schedule.find((ds) => ds.day === dayNum);
            const enabled = !!daySchedule;

            return (
              <div
                key={label}
                className="flex items-start gap-3 py-2 border-b border-zinc-800 last:border-0"
              >
                <div className="w-28 shrink-0 pt-1">
                  <Toggle
                    checked={enabled}
                    onChange={() => toggleDay(idx)}
                    label={label}
                  />
                </div>
                {enabled && daySchedule && (
                  <div className="flex-1 space-y-2">
                    {daySchedule.slots.map((slot, slotIdx) => (
                      <div key={slotIdx} className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 w-12">
                          {slotIdx === 0 ? "Lunch" : "Dinner"}
                        </span>
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateScheduleSlot(idx, slotIdx, "start", e.target.value)
                          }
                          className={`${inputCls} !w-32`}
                        />
                        <span className="text-zinc-500 text-sm">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateScheduleSlot(idx, slotIdx, "end", e.target.value)
                          }
                          className={`${inputCls} !w-32`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Slot Interval & Party Size */}
      <div className={sectionCls}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Slot Interval</label>
            <select
              value={config.slotIntervalMinutes}
              onChange={(e) =>
                patch({ slotIntervalMinutes: Number(e.target.value) })
              }
              className={`${selectCls} w-full`}
            >
              {SLOT_INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Max Party Size</label>
            <input
              type="number"
              min={1}
              max={50}
              value={config.maxPartySize}
              onChange={(e) => patch({ maxPartySize: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Slots Per Time Block</label>
            <input
              type="number"
              min={1}
              max={100}
              value={config.slotsPerTimeBlock}
              onChange={(e) =>
                patch({ slotsPerTimeBlock: Number(e.target.value) })
              }
              className={inputCls}
            />
            <p className="text-xs text-zinc-500 mt-1">
              Maximum concurrent reservations per time slot
            </p>
          </div>
        </div>
      </div>

      {/* Blocked Dates */}
      <div className={sectionCls}>
        <label className={labelCls}>Blocked Dates</label>
        <textarea
          rows={4}
          placeholder={"2026-12-25\n2026-01-01"}
          value={config.blockedDates.join("\n")}
          onChange={(e) =>
            patch({
              blockedDates: e.target.value
                .split("\n")
                .map((d) => d.trim())
                .filter(Boolean),
            })
          }
          className={inputCls}
        />
        <p className="text-xs text-zinc-500">One date per line (YYYY-MM-DD)</p>
      </div>

      {/* Deposit */}
      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-zinc-100">Deposit</h3>
        <Toggle
          checked={config.deposit.required}
          onChange={(v) => patchDeposit({ required: v })}
          label="Deposit Required"
        />
        {config.deposit.required && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div>
              <label className={labelCls}>Amount</label>
              <input
                type="number"
                min={0}
                value={config.deposit.amount}
                onChange={(e) =>
                  patchDeposit({ amount: Number(e.target.value) })
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select
                value={config.deposit.currency}
                onChange={(e) => patchDeposit({ currency: e.target.value })}
                className={`${selectCls} w-full`}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <Toggle
                checked={config.deposit.perPerson}
                onChange={(v) => patchDeposit({ perPerson: v })}
                label="Per person"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-zinc-100">Notifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Owner WhatsApp Number</label>
            <input
              type="tel"
              placeholder="+62812345678"
              value={config.notifications.ownerWhatsApp ?? ""}
              onChange={(e) =>
                patchNotifications({ ownerWhatsApp: e.target.value })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Owner Email</label>
            <input
              type="email"
              placeholder="owner@restaurant.com"
              value={config.notifications.ownerEmail ?? ""}
              onChange={(e) =>
                patchNotifications({ ownerEmail: e.target.value })
              }
              className={inputCls}
            />
          </div>
        </div>
        <Toggle
          checked={config.notifications.customerWhatsApp}
          onChange={(v) => patchNotifications({ customerWhatsApp: v })}
          label="Customer WhatsApp Confirmation"
        />
        <div>
          <label className={labelCls}>Message Template</label>
          <textarea
            rows={3}
            placeholder="New reservation: {guestName}, {date} at {time}, {partySize} guests"
            value={config.notifications.messageTemplate}
            onChange={(e) =>
              patchNotifications({ messageTemplate: e.target.value })
            }
            className={inputCls}
          />
          <p className="text-xs text-zinc-500 mt-1">
            Available variables: {"{guestName}"}, {"{date}"}, {"{time}"},{" "}
            {"{partySize}"}
          </p>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className={sectionCls}>
        <label className={labelCls}>Confirmation Message</label>
        <textarea
          rows={3}
          placeholder="Your reservation has been confirmed!"
          value={config.confirmationMessage}
          onChange={(e) => patch({ confirmationMessage: e.target.value })}
          className={inputCls}
        />
        <p className="text-xs text-zinc-500">
          Shown to the customer after a successful booking.
        </p>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-medium text-white transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && (
          <span className="text-sm text-green-400">Settings saved</span>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// Bookings Tab
// =====================================================================
interface Booking {
  id: string;
  date: string;
  time: string;
  guestName: string;
  guestPhone: string;
  partySize: number;
  status: string;
}

function BookingsTab({ siteId }: { siteId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAPI<Booking[]>(
        `/api/sites/${siteId}/bookings`
      );
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(bookingId: string, status: "CONFIRMED" | "CANCELLED") {
    try {
      await fetchAPI(`/api/sites/${siteId}/bookings`, {
        method: "PATCH",
        body: JSON.stringify({ bookingId, status }),
      });
      await fetchBookings();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update booking");
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-zinc-400">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40 text-red-400">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
        <p>No bookings yet.</p>
        <p className="text-xs text-zinc-500 mt-1">
          Bookings will appear here once customers start reserving.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left">
            <th className="px-4 py-3 font-medium text-zinc-400">Date</th>
            <th className="px-4 py-3 font-medium text-zinc-400">Time</th>
            <th className="px-4 py-3 font-medium text-zinc-400">Guest</th>
            <th className="px-4 py-3 font-medium text-zinc-400">Party Size</th>
            <th className="px-4 py-3 font-medium text-zinc-400">Phone</th>
            <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
            <th className="px-4 py-3 font-medium text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const isToday = b.date === today;
            return (
              <tr
                key={b.id}
                className={`border-b border-zinc-800/60 transition-colors ${
                  isToday
                    ? "bg-blue-950/20"
                    : "hover:bg-zinc-800/30"
                }`}
              >
                <td className="px-4 py-3 text-zinc-200">
                  {b.date}
                  {isToday && (
                    <span className="ml-2 text-[10px] font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      TODAY
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-200">{b.time}</td>
                <td className="px-4 py-3 text-zinc-200">{b.guestName}</td>
                <td className="px-4 py-3 text-zinc-200">{b.partySize}</td>
                <td className="px-4 py-3 text-zinc-300">{b.guestPhone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLOURS[b.status] ?? "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {b.status === "PENDING" && (
                      <button
                        onClick={() => updateStatus(b.id, "CONFIRMED")}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status !== "CANCELLED" && (
                      <button
                        onClick={() => updateStatus(b.id, "CANCELLED")}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
