const consultations = [
  { id: "CON-001", client: "PT Maju Sejahtera", email: "legal@majusejahtera.co.id", attorney: "Alexander Hartono", area: "Corporate Law", date: "2026-03-16", status: "scheduled", summary: "M&A due diligence for acquisition target" },
  { id: "CON-002", client: "Siti Rahayu", email: "siti.rahayu@gmail.com", attorney: "Victoria Susanto", area: "Immigration", date: "2026-03-16", status: "completed", summary: "KITAS renewal and family visa" },
  { id: "CON-003", client: "Global Ventures Ltd", email: "ops@globalventures.com", attorney: "Alexander Hartono", area: "Corporate Law", date: "2026-03-17", status: "pending", summary: "Joint venture agreement review" },
  { id: "CON-004", client: "Ahmad Prasetyo", email: "ahmad.p@outlook.com", attorney: "David Prasetyo", area: "Criminal Defense", date: "2026-03-17", status: "scheduled", summary: "White-collar fraud allegations" },
  { id: "CON-005", client: "Dewi & Partners", email: "office@dewi-partners.com", attorney: "Victoria Susanto", area: "Tax Advisory", date: "2026-03-18", status: "pending", summary: "Transfer pricing audit defense" },
  { id: "CON-006", client: "Keluarga Wirawan", email: "h.wirawan@gmail.com", attorney: "David Prasetyo", area: "Family Law", date: "2026-03-18", status: "scheduled", summary: "Estate planning and trust setup" },
];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function ConsultationsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Consultation Requests</h1>
        <button className="px-4 py-2 text-sm font-medium bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors">
          + New Consultation
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Attorney</th>
                <th className="px-5 py-3 font-medium">Area</th>
                <th className="px-5 py-3 font-medium">Summary</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {consultations.map((con) => (
                <tr key={con.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-mono text-xs">{con.id}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium">{con.client}</p>
                      <p className="text-xs text-zinc-500">{con.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{con.attorney}</td>
                  <td className="px-5 py-3 text-zinc-400">{con.area}</td>
                  <td className="px-5 py-3 text-zinc-400 max-w-48 truncate">{con.summary}</td>
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
