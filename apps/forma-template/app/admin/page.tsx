const metrics = [
  { label: "Total Projects", value: "47", change: "+2 this quarter" },
  { label: "Active Projects", value: "5", change: "3 in design phase" },
  { label: "Open Inquiries", value: "8", change: "+4 this week" },
  { label: "Portfolio Views", value: "2,847", change: "+23% this month" },
];

const recentInquiries = [
  { id: "INQ-001", name: "PT Nusantara Properti", email: "dev@nusantaraprop.com", type: "Commercial", date: "2026-03-16", status: "new", budget: "> Rp 5B" },
  { id: "INQ-002", name: "The Wirawan Family", email: "h.wirawan@gmail.com", type: "Residential", date: "2026-03-15", status: "contacted", budget: "Rp 2-3B" },
  { id: "INQ-003", name: "Bali Retreat Resort", email: "gm@baliretreat.co.id", type: "Hospitality", date: "2026-03-15", status: "new", budget: "> Rp 10B" },
  { id: "INQ-004", name: "Rina Andersen", email: "rina.a@outlook.com", type: "Interior", date: "2026-03-14", status: "proposal-sent", budget: "Rp 500M-1B" },
  { id: "INQ-005", name: "StartupHub Co-working", email: "ops@startuphub.id", type: "Commercial", date: "2026-03-13", status: "contacted", budget: "Rp 1-2B" },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  "proposal-sent": "bg-purple-500/20 text-purple-400",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-red-500/20 text-red-400",
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
          <h2 className="text-sm font-semibold">Recent Inquiries</h2>
          <a href="/admin/inquiries" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            View all &rarr;
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Budget</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-mono text-xs">{inq.id}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium">{inq.name}</p>
                      <p className="text-xs text-zinc-500">{inq.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{inq.type}</td>
                  <td className="px-5 py-3 text-zinc-400">{inq.budget}</td>
                  <td className="px-5 py-3">{inq.date}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[inq.status]}`}>
                      {inq.status.replace("-", " ")}
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
