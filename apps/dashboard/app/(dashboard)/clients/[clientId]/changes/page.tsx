"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: { id: string; name: string | null } | null;
  assignedToId: string | null;
  requestedAt: string;
  completedAt: string | null;
  notes: string | null;
  site: { name: string } | null;
}

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
}

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "REVIEW", "DONE", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  IN_PROGRESS: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  REVIEW: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  DONE: "text-green-400 bg-green-500/10 border-green-500/20",
  CANCELLED: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
};

const priorityColors: Record<string, string> = {
  low: "text-zinc-400 bg-zinc-500/10 border-zinc-600",
  normal: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  high: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  urgent: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function ClientChangesPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [changes, setChanges] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newChange, setNewChange] = useState({ title: "", description: "", priority: "normal" });
  const [creating, setCreating] = useState(false);

  const fetchChanges = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clients/${clientId}/changes`);
      if (!res.ok) throw new Error();
      setChanges(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => { fetchChanges(); }, [fetchChanges]);

  async function updateStatus(changeId: string, status: string) {
    await fetch(`/api/clients/${clientId}/changes/${changeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchChanges();
  }

  async function createChange(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await fetch(`/api/clients/${clientId}/changes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChange),
      });
      setNewChange({ title: "", description: "", priority: "normal" });
      setShowNewForm(false);
      fetchChanges();
    } catch {
      // silent
    } finally {
      setCreating(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 transition-colors";

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-zinc-800/50 rounded-xl border border-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">Client</Link>
        <span>/</span>
        <span className="text-zinc-300">Changes</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Change Requests</h1>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Change Request
        </button>
      </div>

      {/* New Change Form */}
      {showNewForm && (
        <form onSubmit={createChange} className="rounded-xl border border-blue-500/20 bg-zinc-900/50 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Title *</label>
              <input
                required
                value={newChange.title}
                onChange={(e) => setNewChange((p) => ({ ...p, title: e.target.value }))}
                placeholder="Update hero banner"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Priority</label>
              <select
                value={newChange.priority}
                onChange={(e) => setNewChange((p) => ({ ...p, priority: e.target.value }))}
                className={inputCls}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={newChange.description}
              onChange={(e) => setNewChange((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe the change needed..."
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {creating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Change Requests List */}
      {changes.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <p className="text-sm text-zinc-400">No change requests yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {changes.map((change) => (
            <div key={change.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === change.id ? null : change.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`text-[10px] font-semibold uppercase border rounded px-1.5 py-0.5 ${priorityColors[change.priority] ?? priorityColors.normal}`}>
                    {change.priority}
                  </span>
                  <span className="text-sm font-medium text-zinc-200 truncate">{change.title}</span>
                  {change.site && <span className="text-[10px] text-zinc-500">({change.site.name})</span>}
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {change.assignedTo && (
                    <span className="text-xs text-zinc-500">{change.assignedTo.name}</span>
                  )}
                  <span className={`text-[11px] font-medium border rounded-full px-2.5 py-0.5 ${statusColors[change.status] ?? statusColors.PENDING}`}>
                    {change.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-zinc-600">{new Date(change.requestedAt).toLocaleDateString()}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-zinc-500 transition-transform ${expandedId === change.id ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              {expandedId === change.id && (
                <div className="px-5 pb-4 border-t border-zinc-800 pt-3 space-y-3">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">{change.description}</p>
                  {change.notes && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-sm text-zinc-400">{change.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-xs text-zinc-500">Status:</label>
                    <select
                      value={change.status}
                      onChange={(e) => updateStatus(change.id, e.target.value)}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
