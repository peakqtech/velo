"use client";

import Link from "next/link";
import { useActiveSite, useSiteIntegrations } from "@/lib/hooks";

const quickActions = [
  { label: "Edit Content", description: "Update site copy and media", href: "/content", icon: "edit", gradient: "from-blue-600 to-blue-700" },
  { label: "Run QA Audit", description: "Check content quality", href: "/qa-reports", icon: "shield", gradient: "from-green-600 to-emerald-700" },
  { label: "Manage Integrations", description: "Connect services", href: "/integrations", icon: "plug", gradient: "from-amber-600 to-orange-700" },
  { label: "Settings", description: "Site configuration", href: "/settings", icon: "gear", gradient: "from-violet-600 to-purple-700" },
];

const recentActivity = [
  { action: "Content updated", detail: "Hero section", time: "2 hours ago", icon: "edit", dot: "bg-blue-400" },
  { action: "QA audit completed", detail: "Score: 87", time: "1 day ago", icon: "shield", dot: "bg-green-400" },
  { action: "Integration enabled", detail: "Analytics", time: "2 days ago", icon: "plug", dot: "bg-amber-400" },
  { action: "Site deployed to production", detail: "Build v1.3.0", time: "3 days ago", icon: "rocket", dot: "bg-violet-400" },
  { action: "Content updated", detail: "Footer section", time: "5 days ago", icon: "edit", dot: "bg-blue-400" },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-40 bg-zinc-800 rounded" />
        <div className="h-4 w-64 bg-zinc-800 rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-zinc-800/50 border border-zinc-800" />
        ))}
      </div>
    </div>
  );
}

function CreateSiteCard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-500 mt-1">Welcome! Get started by creating your first site.</p>
      </div>
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Create your first site</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Choose a template and start building your site. You can customize content, connect integrations, and deploy in minutes.
          </p>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
            Create Site
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { site, loading, error } = useActiveSite();
  const { integrations, loading: intLoading } = useSiteIntegrations(site?.id ?? null);

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-red-400 mt-1">Failed to load. {error}</p>
        </div>
      </div>
    );
  }
  if (!site) return <CreateSiteCard />;

  const enabledIntegrations = integrations.filter((i: any) => i.enabled).length;
  const totalIntegrations = 5;
  const deployStatus = site.deployStatus ?? "draft";
  const isDeployed = deployStatus === "deployed" || deployStatus === "production";

  const metrics = [
    { label: "Total Sites", value: "1", sub: site.name, icon: "globe", accent: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", iconColor: "text-blue-400" },
    { label: "Template", value: site.template ?? "N/A", sub: site.domain ?? "No domain", icon: "heart", accent: "from-green-500/20 to-green-600/5", border: "border-green-500/20", iconColor: "text-green-400" },
    { label: "Deploy Status", value: isDeployed ? "Live" : "Draft", sub: isDeployed ? "Production" : "Not deployed yet", icon: "users", accent: "from-violet-500/20 to-violet-600/5", border: "border-violet-500/20", iconColor: "text-violet-400", subColor: isDeployed ? "text-green-400" : undefined },
    { label: "Active Integrations", value: intLoading ? "..." : `${enabledIntegrations}/${totalIntegrations}`, sub: intLoading ? "Loading" : `${totalIntegrations - enabledIntegrations} available`, icon: "plug", accent: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20", iconColor: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-500 mt-1">Welcome back. Here is a summary of your project.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`relative overflow-hidden rounded-xl border ${metric.border} bg-zinc-900/50 p-5`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.accent} pointer-events-none`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-400">{metric.label}</span>
                <span className={`${metric.iconColor}`}>
                  <MetricIcon name={metric.icon} />
                </span>
              </div>
              <div className="text-3xl font-bold tracking-tight">
                {metric.value}
              </div>
              {metric.sub && (
                <p className={`text-xs mt-1 ${metric.subColor ?? "text-zinc-500"}`}>{metric.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Site Card row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-150"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${action.gradient} shadow-lg`}>
                  <ActionIcon name={action.icon} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{action.label}</p>
                  <p className="text-xs text-zinc-500">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Active Site Card */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Active Site</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            {/* Thumbnail */}
            <div className="h-32 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10" />
              <div className="relative text-center">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{site.name}</p>
                <p className="text-[10px] text-zinc-500 mt-1">{site.template ?? "Custom template"}</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{site.name}</p>
                  <p className="text-xs text-zinc-500">{site.domain ?? "No domain set"}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-[11px] font-medium ${isDeployed ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"} border rounded-full px-2.5 py-0.5`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isDeployed ? "bg-green-500" : "bg-zinc-500"}`} />
                  {isDeployed ? "Deployed" : "Draft"}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="flex-1 text-center text-xs font-medium text-blue-400 hover:text-blue-300 border border-zinc-800 rounded-lg py-2 hover:bg-zinc-800/50 transition-colors"
                >
                  View Site
                </Link>
                <Link
                  href="/content"
                  className="flex-1 text-center text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 rounded-lg py-2 hover:bg-zinc-800/50 transition-colors"
                >
                  Edit Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Recent Activity</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800/50">
          {recentActivity.map((entry, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                <ActivityIcon name={entry.icon} />
                <span className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${entry.dot}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-200">{entry.action}</p>
                <p className="text-xs text-zinc-500">{entry.detail}</p>
              </div>
              <span className="text-xs text-zinc-600 shrink-0">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Icon helpers                                                              */
/* -------------------------------------------------------------------------- */

function MetricIcon({ name }: { name: string }) {
  const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "globe": return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "heart": return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    case "users": return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "plug": return <svg {...props}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

function ActionIcon({ name }: { name: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "edit": return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case "shield": return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "plug": return <svg {...props}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>;
    case "gear": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

function ActivityIcon({ name }: { name: string }) {
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "text-zinc-400" };
  switch (name) {
    case "edit": return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case "shield": return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "plug": return <svg {...props}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>;
    case "rocket": return <svg {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
