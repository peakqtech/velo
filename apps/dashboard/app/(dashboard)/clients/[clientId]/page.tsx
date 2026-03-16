"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Site {
  id: string;
  name: string;
  slug: string;
  template: string;
  domain: string | null;
  deployStatus: string;
  qaReports: { healthScore: number }[];
}

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  requestedAt: string;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  period: string;
  status: string;
  dueDate: string;
  paidDate: string | null;
}

interface ClientDetail {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  plan: string;
  monthlyPrice: number;
  currency: string;
  paymentStatus: string;
  paymentDueDate: string | null;
  notes: string | null;
  sites: Site[];
  changeRequests: ChangeRequest[];
  invoices: Invoice[];
}

function formatCurrency(amount: number, currency: string) {
  if (currency === "IDR") return `Rp ${amount.toLocaleString("id-ID")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  IN_PROGRESS: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  REVIEW: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  DONE: "text-green-400 bg-green-500/10 border-green-500/20",
  CANCELLED: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
};

const priorityColors: Record<string, string> = {
  low: "text-zinc-400",
  normal: "text-blue-400",
  high: "text-amber-400",
  urgent: "text-red-400",
};

const deployColors: Record<string, { dot: string; text: string; label: string }> = {
  DEPLOYED: { dot: "bg-green-500", text: "text-green-400", label: "Live" },
  PENDING: { dot: "bg-zinc-500", text: "text-zinc-400", label: "Draft" },
  BUILDING: { dot: "bg-amber-500", text: "text-amber-400", label: "Building" },
  FAILED: { dot: "bg-red-500", text: "text-red-400", label: "Failed" },
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-zinc-800 rounded" />
      <div className="h-40 bg-zinc-800/50 rounded-xl border border-zinc-800" />
      <div className="h-64 bg-zinc-800/50 rounded-xl border border-zinc-800" />
    </div>
  );
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/clients/${clientId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load client");
        return res.json();
      })
      .then(setClient)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [clientId]);

  if (loading) return <LoadingSkeleton />;
  if (error || !client) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Client</h1>
        <p className="text-red-400 mt-2">{error ?? "Client not found"}</p>
      </div>
    );
  }

  const recentChanges = client.changeRequests.slice(0, 5);
  const latestInvoice = client.invoices[0];

  return (
    <div className="space-y-8">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
          <span>/</span>
          <span className="text-zinc-300">{client.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <Link
            href={`/clients/${clientId}/edit`}
            className="px-4 py-2 border border-zinc-700 text-sm font-medium text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Edit Client
          </Link>
        </div>
      </div>

      {/* Client Info Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Contact</p>
            <p className="text-sm font-medium text-zinc-200">{client.contactPerson}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{client.email}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Phone / WhatsApp</p>
            <p className="text-sm text-zinc-200">{client.phone ?? "-"}</p>
            {client.whatsapp && <p className="text-xs text-green-400 mt-0.5">WA: {client.whatsapp}</p>}
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Plan & Price</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-200">{client.plan}</span>
              <span className="text-sm text-zinc-400">{formatCurrency(client.monthlyPrice, client.currency)}/mo</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Payment</p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-0.5 border ${
              client.paymentStatus === "PAID" ? "text-green-400 bg-green-500/10 border-green-500/20" :
              client.paymentStatus === "OVERDUE" ? "text-red-400 bg-red-500/10 border-red-500/20" :
              "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
            }`}>
              {client.paymentStatus}
            </span>
            {client.paymentDueDate && (
              <p className="text-xs text-zinc-500 mt-1">Due: {new Date(client.paymentDueDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        {client.notes && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-zinc-400">{client.notes}</p>
          </div>
        )}
      </div>

      {/* Sites Section */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Sites</h2>
        {client.sites.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
            <p className="text-sm text-zinc-400">No sites assigned to this client yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {client.sites.map((site) => {
              const deploy = deployColors[site.deployStatus] ?? deployColors.PENDING;
              const healthScore = site.qaReports?.[0]?.healthScore;
              return (
                <div key={site.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{site.template[0]?.toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{site.name}</p>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                        <span>{site.template}</span>
                        <span>{site.domain ?? site.slug}</span>
                        <span className={`flex items-center gap-1 ${deploy.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${deploy.dot}`} />
                          {deploy.label}
                        </span>
                        {healthScore !== undefined && (
                          <span className="text-zinc-400">Health: {healthScore}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Link
                      href={`/clients/${clientId}/sites/${site.id}/content`}
                      className="px-3 py-1.5 text-xs font-medium text-blue-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Edit Content
                    </Link>
                    <Link
                      href={`/clients/${clientId}/sites/${site.id}/reservations`}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Reservations
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Changes + Billing row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Change Requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent Changes</h2>
            <Link href={`/clients/${clientId}/changes`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800/50">
            {recentChanges.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-500">No change requests</div>
            ) : (
              recentChanges.map((change) => (
                <div key={change.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-200 truncate">{change.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-medium uppercase ${priorityColors[change.priority] ?? "text-zinc-400"}`}>
                        {change.priority}
                      </span>
                      <span className="text-[10px] text-zinc-600">{new Date(change.requestedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium border rounded-full px-2 py-0.5 ${statusColors[change.status] ?? statusColors.PENDING}`}>
                    {change.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Billing Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Billing</h2>
            <Link href={`/clients/${clientId}/billing`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-zinc-500">Current Plan</p>
                <p className="text-lg font-semibold text-zinc-100">{formatCurrency(client.monthlyPrice, client.currency)}<span className="text-sm text-zinc-500 font-normal">/mo</span></p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 border ${
                client.paymentStatus === "PAID" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                client.paymentStatus === "OVERDUE" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
              }`}>
                {client.paymentStatus}
              </span>
            </div>
            {latestInvoice && (
              <div className="border-t border-zinc-800 pt-3">
                <p className="text-xs text-zinc-500 mb-2">Latest Invoice</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{latestInvoice.period}</span>
                  <span className="text-zinc-200">{formatCurrency(latestInvoice.amount, latestInvoice.currency)}</span>
                  <span className={`text-[11px] font-medium border rounded-full px-2 py-0.5 ${
                    latestInvoice.status === "PAID" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                    latestInvoice.status === "OVERDUE" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                    "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                  }`}>
                    {latestInvoice.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
