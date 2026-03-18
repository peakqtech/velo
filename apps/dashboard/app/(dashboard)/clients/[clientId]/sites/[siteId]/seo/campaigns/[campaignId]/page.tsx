"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Campaign {
  id: string;
  name: string;
  goal: string | null;
  status: string;
  channels: string[];
  totalPieces: number;
  publishedCount: number;
  schedule: {
    startDate?: string;
    endDate?: string;
    frequency?: string;
  } | null;
  keywordTargets: string[];
  createdAt: string;
  _count: { contentPieces: number };
}

interface ContentPiece {
  id: string;
  title: string;
  channel: string;
  status: string;
  scheduledFor: string | null;
  targetKeyword: string | null;
  campaign: { id: string; name: string } | null;
}

type Channel = "ALL" | "BLOG" | "GBP" | "SOCIAL" | "EMAIL";

/* -------------------------------------------------------------------------- */
/*  Status badge                                                               */
/* -------------------------------------------------------------------------- */

const STATUS_COLORS: Record<string, string> = {
  PLANNED: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  GENERATING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  DRAFT: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  FAILED: "text-red-400 bg-red-500/10 border-red-500/20",
  IN_REVIEW: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  APPROVED: "text-green-400 bg-green-500/10 border-green-500/20",
  PUBLISHED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  REJECTED: "text-red-400 bg-red-500/10 border-red-500/20",
};

const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  ACTIVE: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PAUSED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  COMPLETED: "text-green-400 bg-green-500/10 border-green-500/20",
  ARCHIVED: "text-zinc-500 bg-zinc-500/5 border-zinc-600/20",
};

const CHANNEL_COLORS: Record<string, string> = {
  BLOG: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  GBP: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  SOCIAL: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  EMAIL: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? STATUS_COLORS.PLANNED;
  return (
    <span className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${cls}`}>
      {status === "GENERATING" && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse mr-1.5" />
      )}
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  const cls = CHANNEL_COLORS[channel] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  return (
    <span className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${cls}`}>
      {channel}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats card                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const siteId = params.siteId as string;
  const campaignId = params.campaignId as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [pieces, setPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel>("ALL");
  const [generating, setGenerating] = useState(false);
  const [approvingAll, setApprovingAll] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [campaignData, piecesData] = await Promise.all([
        fetchAPI<Campaign>(`/api/sites/${siteId}/seo/campaigns/${campaignId}`),
        fetchAPI<ContentPiece[]>(`/api/sites/${siteId}/seo/content?campaign=${campaignId}`),
      ]);
      setCampaign(campaignData);
      setPieces(piecesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  }, [siteId, campaignId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Stats by status
  const statuses = ["PLANNED", "GENERATING", "DRAFT", "APPROVED", "PUBLISHED", "FAILED"] as const;
  const statCounts = statuses.reduce((acc, s) => {
    acc[s] = pieces.filter((p) => p.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const statColors: Record<string, string> = {
    PLANNED: "text-zinc-300",
    GENERATING: "text-yellow-400",
    DRAFT: "text-blue-400",
    APPROVED: "text-green-400",
    PUBLISHED: "text-emerald-400",
    FAILED: "text-red-400",
  };

  // Channel filter
  const CHANNELS: Channel[] = ["ALL", "BLOG", "GBP", "SOCIAL", "EMAIL"];
  const filteredPieces =
    activeChannel === "ALL" ? pieces : pieces.filter((p) => p.channel === activeChannel);

  const handleGenerateBatch = async () => {
    setGenerating(true);
    setActionMsg(null);
    try {
      const res = await fetchAPI<{ accepted: boolean; pieceIds: string[] }>(
        `/api/sites/${siteId}/seo/campaigns/${campaignId}/generate-batch`,
        { method: "POST" }
      );
      setActionMsg(
        res.pieceIds.length > 0
          ? `Generating ${res.pieceIds.length} piece(s) in background…`
          : "No PLANNED pieces scheduled in the next 7 days."
      );
      // Refresh after a short delay so statuses update
      setTimeout(() => loadData(), 3000);
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : "Failed to start generation");
    } finally {
      setGenerating(false);
    }
  };

  const handleApproveAll = async () => {
    const drafts = pieces.filter((p) => p.status === "DRAFT");
    if (drafts.length === 0) {
      setActionMsg("No DRAFT pieces to approve.");
      return;
    }
    setApprovingAll(true);
    setActionMsg(null);
    try {
      await Promise.all(
        drafts.map((p) =>
          fetchAPI(`/api/sites/${siteId}/seo/content/${p.id}`, {
            method: "PUT",
            body: JSON.stringify({ status: "APPROVED" }),
          })
        )
      );
      setActionMsg(`Approved ${drafts.length} piece(s).`);
      await loadData();
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : "Failed to approve drafts");
    } finally {
      setApprovingAll(false);
    }
  };

  /* ---- Render ---- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3" />
          <p className="text-sm text-zinc-500">Loading campaign…</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-4">
        <p className="text-red-400 text-sm">{error ?? "Campaign not found"}</p>
        <Link href={`/clients/${clientId}/sites/${siteId}`} className="text-xs text-blue-400 hover:text-blue-300">
          Back to site
        </Link>
      </div>
    );
  }

  const schedule = campaign.schedule as { startDate?: string; endDate?: string } | null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">Client</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}/sites/${siteId}/seo`} className="hover:text-zinc-300 transition-colors">SEO</Link>
        <span>/</span>
        <span className="text-zinc-300 truncate max-w-[200px]">{campaign.name}</span>
      </div>

      {/* Campaign header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-bold text-zinc-100 truncate">{campaign.name}</h1>
              <span className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${CAMPAIGN_STATUS_COLORS[campaign.status] ?? CAMPAIGN_STATUS_COLORS.DRAFT}`}>
                {campaign.status}
              </span>
            </div>
            {campaign.goal && (
              <p className="text-sm text-zinc-400 mb-3">{campaign.goal}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
              {schedule?.startDate && (
                <span>
                  Start: <span className="text-zinc-300">{new Date(schedule.startDate).toLocaleDateString()}</span>
                </span>
              )}
              {schedule?.endDate && (
                <span>
                  End: <span className="text-zinc-300">{new Date(schedule.endDate).toLocaleDateString()}</span>
                </span>
              )}
              <span>
                Total pieces: <span className="text-zinc-300">{campaign.totalPieces}</span>
              </span>
              <span>
                Published: <span className="text-emerald-400">{campaign.publishedCount}</span>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleApproveAll}
              disabled={approvingAll || statCounts.DRAFT === 0}
              className="px-3 py-1.5 text-xs font-medium text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {approvingAll ? "Approving…" : `Approve All Drafts${statCounts.DRAFT > 0 ? ` (${statCounts.DRAFT})` : ""}`}
            </button>
            <button
              onClick={handleGenerateBatch}
              disabled={generating}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {generating ? "Starting…" : "Generate Next Batch"}
            </button>
          </div>
        </div>
        {actionMsg && (
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-xs text-zinc-400">{actionMsg}</p>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statuses.map((s) => (
          <StatCard key={s} label={s} count={statCounts[s] ?? 0} color={statColors[s]} />
        ))}
      </div>

      {/* Channel filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap border-b border-zinc-800 pb-3">
        {CHANNELS.map((ch) => {
          const count = ch === "ALL" ? pieces.length : pieces.filter((p) => p.channel === ch).length;
          return (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                activeChannel === ch
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
              }`}
            >
              {ch}
              <span className={`text-[10px] font-medium rounded-full px-1.5 py-0 ${
                activeChannel === ch ? "bg-blue-500/40 text-blue-100" : "bg-zinc-800 text-zinc-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content list */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        {filteredPieces.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-zinc-500">No content pieces found for this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {filteredPieces.map((piece) => (
              <button
                key={piece.id}
                onClick={() => router.push(`/clients/${clientId}/sites/${siteId}/seo/content/${piece.id}`)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors text-left group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white truncate transition-colors">
                    {piece.title}
                  </p>
                  {piece.targetKeyword && (
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      Keyword: <span className="text-zinc-400">{piece.targetKeyword}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <ChannelBadge channel={piece.channel} />
                  <StatusBadge status={piece.status} />
                  {piece.scheduledFor && (
                    <span className="text-[11px] text-zinc-500 hidden sm:inline">
                      {new Date(piece.scheduledFor).toLocaleDateString()}
                    </span>
                  )}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
