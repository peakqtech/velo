export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-8">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Sites", value: "0", change: null },
          { label: "Health Score", value: "—", change: null },
          { label: "Total Visitors", value: "0", change: null },
          { label: "Active Integrations", value: "0", change: null },
        ].map((metric) => (
          <div key={metric.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-sm text-zinc-400 mb-1">{metric.label}</div>
            <div className="text-2xl font-bold">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <p className="text-zinc-500 text-sm">No activity yet. Create your first site to get started.</p>
      </div>
    </div>
  );
}
