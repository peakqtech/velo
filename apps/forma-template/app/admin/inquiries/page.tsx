const inquiries = [
  { id: "INQ-001", name: "PT Nusantara Properti", email: "dev@nusantaraprop.com", type: "Commercial", date: "2026-03-16", status: "new", budget: "> Rp 5B", message: "Looking for an architect to design our new headquarters in BSD." },
  { id: "INQ-002", name: "The Wirawan Family", email: "h.wirawan@gmail.com", type: "Residential", date: "2026-03-15", status: "contacted", budget: "Rp 2-3B", message: "We want to build a modern tropical home on our land in Bali." },
  { id: "INQ-003", name: "Bali Retreat Resort", email: "gm@baliretreat.co.id", type: "Hospitality", date: "2026-03-15", status: "new", budget: "> Rp 10B", message: "Boutique resort expansion — 20 new villas and a spa complex." },
  { id: "INQ-004", name: "Rina Andersen", email: "rina.a@outlook.com", type: "Interior", date: "2026-03-14", status: "proposal-sent", budget: "Rp 500M-1B", message: "Complete interior redesign for our penthouse apartment." },
  { id: "INQ-005", name: "StartupHub Co-working", email: "ops@startuphub.id", type: "Commercial", date: "2026-03-13", status: "contacted", budget: "Rp 1-2B", message: "Need a creative co-working space design for 200+ members." },
  { id: "INQ-006", name: "Keluarga Santoso", email: "budi.s@yahoo.com", type: "Residential", date: "2026-03-12", status: "accepted", budget: "Rp 3-5B", message: "Dream home project. We love the Villa Serenity aesthetic." },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  "proposal-sent": "bg-purple-500/20 text-purple-400",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-red-500/20 text-red-400",
};

export default function InquiriesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Project Inquiries</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg">
            3 New
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{inq.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[inq.status]}`}>
                    {inq.status.replace("-", " ")}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{inq.email} &middot; {inq.date}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span className="px-2.5 py-1 bg-zinc-800 rounded text-xs">{inq.type}</span>
                <span className="px-2.5 py-1 bg-zinc-800 rounded text-xs">{inq.budget}</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400">{inq.message}</p>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                Reply
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                Send Proposal
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
