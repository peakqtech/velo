const metrics = [
  { label: "Active Cases", value: "47", change: "+3 this week" },
  { label: "Pending Consultations", value: "12", change: "5 need follow-up" },
  { label: "Revenue (Monthly)", value: "Rp 892.000.000", change: "+15.3%" },
  { label: "Win Rate (YTD)", value: "97.2%", change: "+1.8% vs last year" },
];

const recentConsultations = [
  { id: "CON-001", client: "PT Maju Sejahtera", attorney: "Alexander Hartono", area: "Corporate Law", date: "2026-03-16", status: "scheduled" },
  { id: "CON-002", client: "Siti Rahayu", attorney: "Victoria Susanto", area: "Immigration", date: "2026-03-16", status: "completed" },
  { id: "CON-003", client: "Global Ventures Ltd", attorney: "Alexander Hartono", area: "Corporate Law", date: "2026-03-17", status: "pending" },
  { id: "CON-004", client: "Ahmad Prasetyo", attorney: "David Prasetyo", area: "Criminal Defense", date: "2026-03-17", status: "scheduled" },
  { id: "CON-005", client: "Dewi & Partners", attorney: "Victoria Susanto", area: "Tax Advisory", date: "2026-03-18", status: "pending" },
];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metrics.map((m) => (
          <div key={m.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-semibold mt-2">{m.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{m.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Consultations</h2>
          <a href="/admin/consultations" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            View all &rarr;
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Attorney</th>
                <th className="px-5 py-3 font-medium">Practice Area</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentConsultations.map((con) => (
                <tr key={con.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-mono text-xs">{con.id}</td>
                  <td className="px-5 py-3 font-medium">{con.client}</td>
                  <td className="px-5 py-3 text-zinc-400">{con.attorney}</td>
                  <td className="px-5 py-3 text-zinc-400">{con.area}</td>
                  <td className="px-5 py-3">{con.date}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[con.status]}`}>
                      {con.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
