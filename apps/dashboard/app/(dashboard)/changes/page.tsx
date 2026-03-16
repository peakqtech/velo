"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  requestedAt: string;
  client: { id: string; name: string };
  site: { id: string; name: string } | null;
  assignedTo: { id: string; name: string | null } | null;
}

const STATUS_FILTERS = ["All", "PENDING", "IN_PROGRESS", "REVIEW", "DONE"];

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

export default function AllChangesPage() {
  const [changes, setChanges] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/clients?includeChanges=true")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const clients = await res.json();
        // Flatten all changes across clients
        const allChanges: ChangeRequest[] = [];
        for (const client of clients) {
          if (client.changeRequests) {
            for (const change of client.changeRequests) {
              allChanges.push({ ...change, client: { id: client.id, name: client.name } });
            }
          }
        }
        allChanges.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
        setChanges(allChanges);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? changes : changes.filter((c) => c.status === filter);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-zinc-800/50 rounded-xl border border-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Change Requests</h1>
        <p className="text-zinc-500 mt-1">Change requests across all clients.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-150 ${
              filter === s
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
            }`}
          >
            {s === "All" ? "All" : s.replace("_", " ")}
          </button>
        ))}
        <span className="ml-3 text-xs text-zinc-500">{filtered.length} results</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <p className="text-sm text-zinc-400">No change requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left">
                <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Site</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Title</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Priority</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Assigned To</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((change) => (
                <tr key={change.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/clients/${change.client.id}`} className="text-zinc-200 hover:text-blue-400 transition-colors">
                      {change.client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{change.site?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/clients/${change.client.id}/changes`} className="text-zinc-200 hover:text-blue-400 transition-colors">
                      {change.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium uppercase ${priorityColors[change.priority] ?? "text-zinc-400"}`}>
                      {change.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[change.status] ?? statusColors.PENDING}`}>
                      {change.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{change.assignedTo?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-zinc-500">{new Date(change.requestedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
