"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  requestedAt: string;
  completedAt: string | null;
  client: { id: string; name: string };
  site: { id: string; name: string } | null;
  assignedTo: { id: string; name: string | null } | null;
}

const COLUMNS = [
  { key: "PENDING", label: "Pending", color: "border-yellow-500/40", dotColor: "bg-yellow-400" },
  { key: "IN_PROGRESS", label: "In Progress", color: "border-blue-500/40", dotColor: "bg-blue-400" },
  { key: "REVIEW", label: "Review", color: "border-violet-500/40", dotColor: "bg-violet-400" },
  { key: "DONE", label: "Done", color: "border-green-500/40", dotColor: "bg-green-400" },
] as const;

const priorityConfig: Record<string, { label: string; color: string; order: number }> = {
  urgent: { label: "Urgent", color: "text-red-400 bg-red-500/10 border-red-500/30", order: 0 },
  high: { label: "High", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", order: 1 },
  normal: { label: "Normal", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", order: 2 },
  low: { label: "Low", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30", order: 3 },
};

export default function AllChangesPage() {
  const [changes, setChanges] = useState<ChangeRequest[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [clientFilter, setClientFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/clients?includeChanges=true")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        const allChanges: ChangeRequest[] = [];
        const clientList: Array<{ id: string; name: string }> = [];
        for (const client of data) {
          clientList.push({ id: client.id, name: client.name });
          if (client.changeRequests) {
            for (const change of client.changeRequests) {
              allChanges.push({ ...change, client: { id: client.id, name: client.name } });
            }
          }
        }
        setChanges(allChanges);
        setClients(clientList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Move card to new status
  const moveCard = useCallback(async (changeId: string, clientId: string, newStatus: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, status: newStatus } : c))
    );

    try {
      await fetch(`/api/clients/${clientId}/changes/${changeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Revert on failure — refetch
      window.location.reload();
    }
  }, []);

  // Apply filters
  const filtered = changes.filter((c) => {
    if (clientFilter !== "all" && c.client.id !== clientFilter) return false;
    if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort by priority within each column
  const sortByPriority = (items: ChangeRequest[]) =>
    [...items].sort((a, b) => (priorityConfig[a.priority]?.order ?? 5) - (priorityConfig[b.priority]?.order ?? 5));

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-zinc-800 rounded" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-96 bg-zinc-800/30 rounded-xl border border-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Change Requests</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{changes.length} total across {clients.length} clients</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search changes..."
          className="h-9 px-3 w-56 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Client filter */}
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

        {(clientFilter !== "all" || priorityFilter !== "all" || searchQuery) && (
          <button
            onClick={() => { setClientFilter("all"); setPriorityFilter("all"); setSearchQuery(""); }}
            className="h-9 px-3 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 rounded-lg transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 flex-1 min-h-0 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const columnCards = sortByPriority(filtered.filter((c) => c.status === col.key));

          return (
            <div key={col.key} className="flex-1 min-w-[280px] flex flex-col">
              {/* Column header */}
              <div className={`flex items-center gap-2 pb-3 mb-3 border-b-2 ${col.color}`}>
                <div className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                <span className="text-sm font-semibold text-zinc-200">{col.label}</span>
                <span className="ml-auto text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {columnCards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {columnCards.length === 0 ? (
                  <div className="text-center py-8 text-zinc-600 text-xs">No items</div>
                ) : (
                  columnCards.map((change) => (
                    <ChangeCard
                      key={change.id}
                      change={change}
                      currentColumn={col.key}
                      onMove={moveCard}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Change Card                                               */
/* ────────────────────────────────────────────────────────── */

function ChangeCard({
  change,
  currentColumn,
  onMove,
}: {
  change: ChangeRequest;
  currentColumn: string;
  onMove: (id: string, clientId: string, status: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const prio = priorityConfig[change.priority] ?? priorityConfig.normal;

  // Available transitions
  const transitions: Record<string, string[]> = {
    PENDING: ["IN_PROGRESS"],
    IN_PROGRESS: ["REVIEW", "PENDING"],
    REVIEW: ["DONE", "IN_PROGRESS"],
    DONE: [],
  };
  const nextStatuses = transitions[currentColumn] ?? [];

  const daysAgo = Math.floor(
    (Date.now() - new Date(change.requestedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 hover:border-zinc-700 transition-all cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row: priority + client */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${prio.color}`}>
          {prio.label}
        </span>
        <Link
          href={`/clients/${change.client.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[11px] text-zinc-500 hover:text-blue-400 transition-colors truncate max-w-[120px]"
        >
          {change.client.name}
        </Link>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-zinc-200 leading-snug mb-1.5">
        {change.title}
      </h3>

      {/* Description (expanded) */}
      {expanded && (
        <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
          {change.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500">
        <span>{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
        {change.site && (
          <span className="truncate max-w-[100px]">{change.site.name}</span>
        )}
      </div>

      {/* Move buttons (expanded) */}
      {expanded && nextStatuses.length > 0 && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800">
          {nextStatuses.map((status) => {
            const targetCol = COLUMNS.find((c) => c.key === status);
            return (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(change.id, change.client.id, status);
                }}
                className="flex-1 text-xs py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                → {targetCol?.label ?? status.replace("_", " ")}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
