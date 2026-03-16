"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ClientWithInvoices {
  id: string;
  name: string;
  monthlyPrice: number;
  currency: string;
  paymentStatus: string;
  invoices: {
    id: string;
    amount: number;
    currency: string;
    period: string;
    status: string;
    dueDate: string;
    paidDate: string | null;
  }[];
}

function formatCurrency(amount: number, currency: string) {
  if (currency === "IDR") return `Rp ${amount.toLocaleString("id-ID")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

const invoiceStatusColors: Record<string, string> = {
  DRAFT: "text-zinc-400 bg-zinc-500/10 border-zinc-600",
  SENT: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PAID: "text-green-400 bg-green-500/10 border-green-500/20",
  OVERDUE: "text-red-400 bg-red-500/10 border-red-500/20",
  CANCELLED: "text-zinc-400 bg-zinc-500/10 border-zinc-600",
};

export default function RevenuePage() {
  const [clients, setClients] = useState<ClientWithInvoices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients?includeInvoices=true")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setClients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-zinc-800/50 border border-zinc-800" />
          ))}
        </div>
        <div className="h-64 bg-zinc-800/50 rounded-xl border border-zinc-800" />
      </div>
    );
  }

  const totalMonthlyRevenue = clients.reduce((sum, c) => sum + c.monthlyPrice, 0);
  const allInvoices = clients.flatMap((c) =>
    (c.invoices ?? []).map((inv) => ({ ...inv, clientId: c.id, clientName: c.name }))
  );
  allInvoices.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const paidCount = allInvoices.filter((i) => i.status === "PAID").length;
  const overdueInvoices = allInvoices.filter((i) => i.status === "OVERDUE");

  const stats = [
    { label: "Monthly Revenue", value: formatCurrency(totalMonthlyRevenue, "IDR"), accent: "from-green-500/20 to-green-600/5", border: "border-green-500/20" },
    { label: "Paid Invoices", value: paidCount.toString(), accent: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20" },
    { label: "Overdue Invoices", value: overdueInvoices.length.toString(), accent: "from-red-500/20 to-red-600/5", border: "border-red-500/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
        <p className="text-zinc-500 mt-1">Revenue overview and invoice management across all clients.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`relative overflow-hidden rounded-xl border ${stat.border} bg-zinc-900/50 p-5`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} pointer-events-none`} />
            <div className="relative">
              <span className="text-sm text-zinc-400">{stat.label}</span>
              <div className="text-2xl font-bold tracking-tight mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Revenue Trend</p>
          <div className="h-32 flex items-center justify-center text-zinc-600">
            <p className="text-sm">Chart coming soon</p>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Payment Status Breakdown</p>
          <div className="h-32 flex items-center justify-center text-zinc-600">
            <p className="text-sm">Chart coming soon</p>
          </div>
        </div>
      </div>

      {/* All Invoices */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">All Invoices</h2>
        {allInvoices.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <p className="text-sm text-zinc-400">No invoices yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left">
                  <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Period</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Amount</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Due Date</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {allInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`border-b border-zinc-800/60 transition-colors ${
                      inv.status === "OVERDUE" ? "bg-red-950/10" : "hover:bg-zinc-800/30"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/clients/${inv.clientId}/billing`} className="text-zinc-200 hover:text-blue-400 transition-colors">
                        {inv.clientName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-200">{inv.period}</td>
                    <td className="px-4 py-3 text-zinc-200">{formatCurrency(inv.amount, inv.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${invoiceStatusColors[inv.status] ?? invoiceStatusColors.DRAFT}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-zinc-400">{inv.paidDate ? new Date(inv.paidDate).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
