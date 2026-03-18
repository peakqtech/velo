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
  siteUrl: string | null;
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Sites</h2>
          <Link
            href={`/clients/${clientId}/sites/new`}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            + Create Site
          </Link>
        </div>
        {client.sites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center">
            <p className="text-sm text-zinc-400 mb-3">No sites yet. Create one from a template.</p>
            <Link
              href={`/clients/${clientId}/sites/new`}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Create First Site
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {client.sites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                clientId={clientId}
                onUpdate={() => {
                  fetch(`/api/clients/${clientId}`).then((r) => r.json()).then(setClient);
                }}
              />
            ))}
            {/* Fill empty grid slot when odd number of sites */}
            {client.sites.length % 2 === 1 && (
              <Link
                href={`/clients/${clientId}/sites/new`}
                className="rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-transparent flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer min-h-[200px]"
              >
                <div className="h-12 w-12 rounded-xl border-2 border-dashed border-zinc-700 group-hover:border-zinc-500 flex items-center justify-center transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    <rect x="3" y="3" width="18" height="14" rx="2" />
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <circle cx="6" cy="5" r="0.5" fill="currentColor" />
                    <circle cx="8.5" cy="5" r="0.5" fill="currentColor" />
                    <circle cx="11" cy="5" r="0.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  Add Another Great Site
                </span>
              </Link>
            )}
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

/* ────────────────────────────────────────────────────────── */
/*  Site Card with live preview                               */
/* ────────────────────────────────────────────────────────── */

const templateGradients: Record<string, string> = {
  velocity: "from-red-600 to-orange-600",
  ember: "from-amber-600 to-red-700",
  haven: "from-emerald-600 to-teal-700",
  nexus: "from-orange-500 to-amber-600",
  prism: "from-violet-600 to-indigo-600",
  serenity: "from-green-600 to-emerald-700",
};

function SiteCard({ site, clientId, onUpdate }: { site: Site; clientId: string; onUpdate: () => void }) {
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(site.siteUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [localSiteUrl, setLocalSiteUrl] = useState(site.siteUrl);
  const [localDeployStatus, setLocalDeployStatus] = useState(site.deployStatus);

  const deploy = deployColors[localDeployStatus] ?? deployColors.PENDING;
  const healthScore = site.qaReports?.[0]?.healthScore;
  const isLive = localDeployStatus === "DEPLOYED" && !!localSiteUrl;

  const handleSaveUrl = async () => {
    setSaving(true);
    setSaveError(null);
    const newUrl = urlInput.trim() || null;
    const newStatus = newUrl ? "DEPLOYED" : "PENDING";

    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl: newUrl, deployStatus: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }

      // Update local state immediately
      setLocalSiteUrl(newUrl);
      setLocalDeployStatus(newStatus);
      setEditingUrl(false);
      onUpdate();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${templateGradients[site.template] ?? "from-zinc-600 to-zinc-700"} flex items-center justify-center`}>
            <span className="text-xs font-bold text-white">{site.template[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{site.name}</p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
              <span className="capitalize">{site.template}</span>
              {localSiteUrl && <span className="truncate max-w-[200px]">{localSiteUrl.replace(/^https?:\/\//, "")}</span>}
              <span className={`flex items-center gap-1 ${deploy.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${deploy.dot}`} />
                {deploy.label}
              </span>
              {healthScore !== undefined && <span>Health: {healthScore}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isLive && (
            <a
              href={localSiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-blue-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              Open
            </a>
          )}
          <button
            onClick={() => setEditingUrl(true)}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            {localSiteUrl ? "Change URL" : "Set URL"}
          </button>
          <Link
            href={`/clients/${clientId}/sites/${site.id}/seo`}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            SEO
          </Link>
          <Link
            href={`/clients/${clientId}/sites/${site.id}/reservations`}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Reservations
          </Link>
        </div>
      </div>

      {/* URL editor */}
      {editingUrl && (
        <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/80">
          <label className="block text-xs text-zinc-500 mb-1.5">Site URL (paste the deployed URL after hosting on Vercel or any platform)</label>
          <div className="flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://sushimasa.vercel.app"
              className="flex-1 h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSaveUrl()}
            />
            <button
              onClick={handleSaveUrl}
              disabled={saving}
              className="px-4 h-9 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => { setEditingUrl(false); setUrlInput(localSiteUrl ?? ""); setSaveError(null); }}
              className="px-3 h-9 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
          </div>
          {saveError && <p className="text-xs text-red-400 mt-2">{saveError}</p>}
        </div>
      )}

      {/* Live preview — 16:10 aspect ratio */}
      {isLive && (
        <div className="relative bg-black" style={{ aspectRatio: "16/10" }}>
          <iframe
            src={localSiteUrl!}
            className="absolute inset-0 border-0"
            style={{ width: "250%", height: "250%", transform: "scale(0.4)", transformOrigin: "top left" }}
            title={`Preview of ${site.name}`}
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-zinc-300">Live</span>
          </div>
        </div>
      )}

      {/* Not live */}
      {!isLive && (
        <div className="p-8 text-center">
          <p className="text-sm text-zinc-400">
            {localSiteUrl ? "Connecting..." : "No URL set \u2014 deploy the site first, then set the URL"}
          </p>
          {!localSiteUrl && (
            <button
              onClick={() => setEditingUrl(true)}
              className="mt-3 px-4 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              Set Site URL
            </button>
          )}
        </div>
      )}
    </div>
  );
}

