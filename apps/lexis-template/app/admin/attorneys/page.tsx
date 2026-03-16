"use client";

const attorneys = [
  { id: 1, name: "Alexander Hartono, SH, MH", role: "Managing Partner", specialty: "Corporate Law", activeCases: 15, winRate: "98%", status: "active" },
  { id: 2, name: "Victoria Susanto, SH, LLM", role: "Senior Partner", specialty: "Immigration Law", activeCases: 22, winRate: "97%", status: "active" },
  { id: 3, name: "David Prasetyo, SH, MH", role: "Partner", specialty: "Criminal Defense", activeCases: 8, winRate: "96%", status: "active" },
  { id: 4, name: "Maria Anggraeni, SH", role: "Associate", specialty: "Family Law", activeCases: 12, winRate: "94%", status: "active" },
  { id: 5, name: "Reza Firmansyah, SH", role: "Associate", specialty: "Property Law", activeCases: 9, winRate: "95%", status: "on-leave" },
];

export default function AttorneysManagement() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Attorney Management</h1>
        <button className="px-4 py-2 text-sm font-medium bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors">
          + Add Attorney
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attorneys.map((atty) => (
          <div key={atty.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{atty.name}</h3>
                <p className="text-xs text-amber-500">{atty.role}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${atty.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                {atty.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>Specialty: {atty.specialty}</p>
              <p>Active Cases: {atty.activeCases}</p>
              <p>Win Rate: {atty.winRate}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                Edit Profile
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors">
                View Cases
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
