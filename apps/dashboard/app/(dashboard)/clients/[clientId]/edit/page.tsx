"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const PLANS = ["BASIC", "PREMIUM", "ENTERPRISE", "CUSTOM"];
const CURRENCIES = ["IDR", "USD", "SGD", "EUR"];
const PAYMENT_STATUSES = ["PAID", "PENDING", "OVERDUE", "GRACE"];

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    whatsapp: "",
    plan: "BASIC",
    monthlyPrice: "",
    currency: "IDR",
    paymentStatus: "PENDING",
    notes: "",
  });

  useEffect(() => {
    fetch(`/api/clients/${clientId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load client");
        return res.json();
      })
      .then((client) => {
        setForm({
          name: client.name ?? "",
          contactPerson: client.contactPerson ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
          whatsapp: client.whatsapp ?? "",
          plan: client.plan ?? "BASIC",
          monthlyPrice: String(client.monthlyPrice ?? 0),
          currency: client.currency ?? "IDR",
          paymentStatus: client.paymentStatus ?? "PENDING",
          notes: client.notes ?? "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [clientId]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlyPrice: parseInt(form.monthlyPrice) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to update client" }));
        throw new Error(data.error);
      }

      router.push(`/clients/${clientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 transition-colors";
  const labelCls = "block text-sm font-medium text-zinc-300 mb-1.5";

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="h-64 bg-zinc-800/50 rounded-xl border border-zinc-800" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">Client</Link>
        <span>/</span>
        <span className="text-zinc-300">Edit</span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Client</h1>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
          <h2 className="text-base font-semibold text-zinc-100">Business Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Business Name *</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Contact Person *</label>
              <input required value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Email *</label>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
          <h2 className="text-base font-semibold text-zinc-100">Plan & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Plan</label>
              <select value={form.plan} onChange={(e) => update("plan", e.target.value)} className={inputCls}>
                {PLANS.map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Monthly Price</label>
              <input type="number" min="0" value={form.monthlyPrice} onChange={(e) => update("monthlyPrice", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className={inputCls}>
                {CURRENCIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Payment Status</label>
              <select value={form.paymentStatus} onChange={(e) => update("paymentStatus", e.target.value)} className={inputCls}>
                {PAYMENT_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
          <h2 className="text-base font-semibold text-zinc-100">Notes</h2>
          <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} className={inputCls} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href={`/clients/${clientId}`} className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
