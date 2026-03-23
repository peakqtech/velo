"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  period: string;
  status: string;
  dueDate: string;
  paidDate: string | null;
  notes: string | null;
  createdAt: string;
}

interface ClientBilling {
  id: string;
  name: string;
  plan: string;
  monthlyPrice: number;
  currency: string;
  paymentStatus: string;
  paymentDueDate: string | null;
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

export default function ClientBillingPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientBilling | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [clientRes, invoicesRes] = await Promise.all([
        fetch(`/api/clients/${clientId}`),
        fetch(`/api/clients/${clientId}/invoices`),
      ]);
      if (clientRes.ok) setClientInfo(await clientRes.json());
      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function createInvoice() {
    if (!clientInfo) return;
    setCreating(true);
    try {
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      await fetch(`/api/clients/${clientId}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: clientInfo.monthlyPrice,
          currency: clientInfo.currency,
          period,
          dueDate: dueDate.toISOString(),
        }),
      });
      fetchData();
    } catch {
      // silent
    } finally {
      setCreating(false);
    }
  }

  async function markAsPaid(invoiceId: string) {
    await fetch(`/api/clients/${clientId}/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAID" }),
    });
    fetchData();
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="h-32 bg-zinc-800/50 rounded-xl border border-zinc-800" />
        <div className="h-48 bg-zinc-800/50 rounded-xl border border-zinc-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">Client</Link>
        <span>/</span>
        <span className="text-zinc-300">Billing</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <button
          onClick={createInvoice}
          disabled={creating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {creating ? "Creating..." : "Create Invoice"}
        </button>
      </div>

      {/* Summary Card */}
      {clientInfo && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Current Plan</p>
              <p className="text-lg font-semibold text-zinc-100">{clientInfo.plan}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Monthly Price</p>
              <p className="text-lg font-semibold text-zinc-100">{formatCurrency(clientInfo.monthlyPrice, clientInfo.currency)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Payment Status</p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 border ${
                clientInfo.paymentStatus === "PAID" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                clientInfo.paymentStatus === "OVERDUE" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
              }`}>
                {clientInfo.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Invoice History */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Invoice History</h2>
        {invoices.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <p className="text-sm text-zinc-400">No invoices yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left">
                  <th className="px-4 py-3 font-medium text-zinc-400">Period</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Amount</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Due Date</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Paid Date</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 text-zinc-200">{inv.period}</td>
                    <td className="px-4 py-3 text-zinc-200">{formatCurrency(inv.amount, inv.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${invoiceStatusColors[inv.status] ?? invoiceStatusColors.DRAFT}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-zinc-400">{inv.paidDate ? new Date(inv.paidDate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3">
                      {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                        <button
                          onClick={() => markAsPaid(inv.id)}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
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
