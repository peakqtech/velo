"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { DollarSign, Receipt, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

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
  DRAFT: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20",
  SENT: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  PAID: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  OVERDUE: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  CANCELLED: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20",
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
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Revenue"
        description="Revenue overview and invoice management across all clients."
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Revenue" }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(totalMonthlyRevenue, "IDR")}
          icon={<DollarSign size={18} />}
          color="emerald"
        />
        <StatCard
          label="Paid Invoices"
          value={paidCount.toString()}
          icon={<Receipt size={18} />}
          color="blue"
        />
        <StatCard
          label="Overdue Invoices"
          value={overdueInvoices.length.toString()}
          icon={<AlertTriangle size={18} />}
          color="rose"
        />
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-6 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Revenue Trend</p>
          <div className="h-32 flex items-center justify-center text-muted-foreground/50">
            <p className="text-sm">Chart coming soon</p>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Payment Status Breakdown</p>
          <div className="h-32 flex items-center justify-center text-muted-foreground/50">
            <p className="text-sm">Chart coming soon</p>
          </div>
        </div>
      </div>

      {/* All Invoices */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">All Invoices</h2>
        {allInvoices.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-slate-500/10 flex items-center justify-center mx-auto mb-3">
              <Receipt size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Period</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {allInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`border-b last:border-b-0 transition-colors ${
                      inv.status === "OVERDUE" ? "bg-red-500/5" : "hover:bg-accent/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/clients/${inv.clientId}/billing`} className="text-foreground hover:text-primary transition-colors font-medium">
                        {inv.clientName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{inv.period}</td>
                    <td className="px-4 py-3 font-semibold tracking-tight">{formatCurrency(inv.amount, inv.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${invoiceStatusColors[inv.status] ?? invoiceStatusColors.DRAFT}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.paidDate ? new Date(inv.paidDate).toLocaleDateString() : "—"}</td>
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
