import Link from "next/link";

const metrics = [
  { label: "Total Sites", value: "1", icon: "globe", accent: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", iconColor: "text-blue-400" },
  { label: "Health Score", value: "94", icon: "heart", accent: "from-green-500/20 to-green-600/5", border: "border-green-500/20", iconColor: "text-green-400", suffix: "%" },
  { label: "Total Visitors", value: "1,247", icon: "users", accent: "from-violet-500/20 to-violet-600/5", border: "border-violet-500/20", iconColor: "text-violet-400" },
  { label: "Active Integrations", value: "3", icon: "plug", accent: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20", iconColor: "text-amber-400" },
];

const quickActions = [
  { label: "Edit Content", description: "Update site copy and media", href: "/content", icon: "edit", gradient: "from-blue-600 to-blue-700" },
  { label: "Run QA Audit", description: "Check content quality", href: "/qa-reports", icon: "shield", gradient: "from-green-600 to-emerald-700" },
  { label: "View Analytics", description: "Performance insights", href: "/", icon: "chart", gradient: "from-violet-600 to-purple-700" },
  { label: "Manage Integrations", description: "Connect services", href: "/integrations", icon: "plug", gradient: "from-amber-600 to-orange-700" },
];

const recentActivity = [
  { action: "Content updated", detail: "Hero section headline changed", time: "2 hours ago", icon: "edit" },
  { action: "QA audit completed", detail: "Score: 94% — 2 warnings", time: "5 hours ago", icon: "check" },
  { action: "Integration added", detail: "Connected Google Analytics", time: "1 day ago", icon: "plug" },
  { action: "Site deployed", detail: "Production build v1.2.0", time: "2 days ago", icon: "rocket" },
];

export default function OverviewPage() {
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
                {metric.suffix && <span className="text-lg text-zinc-400 ml-0.5">{metric.suffix}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Site Preview row */}
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

        {/* Site Preview Card */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Active Site</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            {/* Thumbnail placeholder */}
            <div className="h-32 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10" />
              <div className="relative text-center">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Velocity</p>
                <p className="text-[10px] text-zinc-500 mt-1">Athletic Template</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-zinc-200">Velocity Demo</p>
                <p className="text-xs text-zinc-500">velocity-demo.velo.dev</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Live
                </span>
                <span>4 sections</span>
                <span>Last edited 2h ago</span>
              </div>
              <Link
                href="/content"
                className="block text-center text-xs font-medium text-blue-400 hover:text-blue-300 border border-zinc-800 rounded-lg py-2 hover:bg-zinc-800/50 transition-colors"
              >
                Open Editor
              </Link>
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                <ActivityIcon name={entry.icon} />
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
    case "chart": return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "plug": return <svg {...props}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

function ActivityIcon({ name }: { name: string }) {
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "text-zinc-400" };
  switch (name) {
    case "edit": return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case "check": return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case "plug": return <svg {...props}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>;
    case "rocket": return <svg {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
