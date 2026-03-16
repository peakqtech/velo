"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ClientSummary {
  id: string;
  name: string;
  contactPerson: string;
  plan: string;
  monthlyPrice: number;
  currency: string;
  paymentStatus: string;
  paymentDueDate: string | null;
  lastPaymentDate: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { sites: number; changeRequests: number };
  pendingChanges: number;
  lastActivity: string | null;
}

function formatCurrency(amount: number, currency: string) {
  if (currency === "IDR") {
    return `Rp ${(amount / 1).toLocaleString("id-ID")}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

function paymentBadge(status: string, dueDate: string | null) {
  switch (status) {
    case "PAID":
      return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Paid</span>;
    case "OVERDUE": {
      const days = dueDate ? Math.max(0, Math.floor((Date.now() - new Date(dueDate).getTime()) / 86400000)) : 0;
      return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Overdue {days}d</span>;
    }
    case "PENDING":
      return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2.5 py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />Pending</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 bg-zinc-500/10 border border-zinc-500/20 rounded-full px-2.5 py-0.5">{status}</span>;
  }
}

function planBadge(plan: string) {
  const colors: Record<string, string> = {
    BASIC: "text-zinc-300 bg-zinc-700/50 border-zinc-600",
    PREMIUM: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    ENTERPRISE: "text-violet-300 bg-violet-500/10 border-violet-500/20",
    CUSTOM: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider border rounded px-1.5 py-0.5 ${colors[plan] ?? colors.BASIC}`}>
      {plan}
    </span>
  );
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "No activity";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="h-4 w-72 bg-zinc-800 rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-zinc-800/50 border border-zinc-800" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-52 rounded-xl bg-zinc-800/50 border border-zinc-800" />
        ))}
      </div>
    </div>
  );
}

export default function ClientsOverviewPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load clients");
        return res.json();
      })
      .then(setClients)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-red-400 mt-1">Failed to load. {error}</p>
        </div>
      </div>
    );
  }

  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyPrice, 0);
  const pendingChanges = clients.reduce((sum, c) => sum + c.pendingChanges, 0);
  const overdueCount = clients.filter((c) => c.paymentStatus === "OVERDUE").length;

  const stats = [
    { label: "Total Clients", value: clients.length.toString(), accent: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", iconColor: "text-blue-400" },
    { label: "Monthly Revenue", value: formatCurrency(totalRevenue, "IDR"), accent: "from-green-500/20 to-green-600/5", border: "border-green-500/20", iconColor: "text-green-400" },
    { label: "Pending Changes", value: pendingChanges.toString(), accent: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20", iconColor: "text-amber-400" },
    { label: "Overdue Payments", value: overdueCount.toString(), accent: "from-red-500/20 to-red-600/5", border: "border-red-500/20", iconColor: "text-red-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-zinc-500 mt-1">Manage all your agency clients from one place.</p>
        </div>
        <Link
          href="/clients/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Client
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border ${stat.border} bg-zinc-900/50 p-5`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} pointer-events-none`} />
            <div className="relative">
              <span className="text-sm text-zinc-400">{stat.label}</span>
              <div className="text-2xl font-bold tracking-tight mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Client Cards Grid */}
      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-blue-400">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">No clients yet</h2>
          <p className="text-sm text-zinc-500 mb-6 max-w-md">
            Add your first client to start managing their sites, change requests, and billing.
          </p>
          <Link
            href="/clients/new"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            Add First Client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-150"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white truncate">
                    {client.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{client.contactPerson}</p>
                </div>
                {planBadge(client.plan)}
              </div>

              <div className="flex items-center justify-between mb-4">
                {paymentBadge(client.paymentStatus, client.paymentDueDate)}
                <span className="text-sm font-medium text-zinc-200">
                  {formatCurrency(client.monthlyPrice, client.currency)}/mo
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-500 border-t border-zinc-800 pt-3">
                <span>{client._count.sites} site{client._count.sites !== 1 ? "s" : ""}</span>
                <span className="text-zinc-700">|</span>
                <span>{client.pendingChanges} pending change{client.pendingChanges !== 1 ? "s" : ""}</span>
                <span className="ml-auto text-zinc-600">{timeAgo(client.lastActivity ?? client.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
