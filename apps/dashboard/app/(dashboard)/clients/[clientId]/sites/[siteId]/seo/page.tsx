"use client";

import { useState, useEffect } from "react";
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

/* -------------------------------------------------------------------------- */
/*  Status helpers                                                             */
/* -------------------------------------------------------------------------- */

const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  ACTIVE: "text-green-400 bg-green-500/10 border-green-500/20",
  PAUSED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  COMPLETED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

const CHANNEL_COLORS: Record<string, string> = {
  BLOG: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  GBP: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  SOCIAL: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  EMAIL: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const cls = CAMPAIGN_STATUS_COLORS[status] ?? CAMPAIGN_STATUS_COLORS.DRAFT;
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${cls}`}
    >
      {status}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  const cls =
    CHANNEL_COLORS[channel] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${cls}`}
    >
      {channel}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-blue-500 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function SeoOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const siteId = params.siteId as string;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAPI<Campaign[]>(`/api/sites/${siteId}/seo/campaigns`)
      .then(setCampaigns)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load campaigns"))
      .finally(() => setLoading(false));
  }, [siteId]);

  /* ── Derived stats ── */
  const totalCampaigns = campaigns.length;
  const totalPublished = campaigns.reduce((sum, c) => sum + c.publishedCount, 0);

  const nextScheduledDate = campaigns
    .flatMap((c) => {
      const s = c.schedule as { startDate?: string } | null;
      return s?.startDate ? [new Date(s.startDate)] : [];
    })
    .filter((d) => d > new Date())
    .sort((a, b) => a.getTime() - b.getTime())[0];

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3" />
          <p className="text-sm text-zinc-500">Loading SEO campaigns…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-400 text-sm">{error}</p>
        <Link
          href={`/clients/${clientId}`}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Back to client
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Clients
        </Link>
        <span>/</span>
        <Link
          href={`/clients/${clientId}`}
          className="hover:text-zinc-300 transition-colors"
        >
          Client
        </Link>
        <span>/</span>
        <span className="text-zinc-300">SEO</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">SEO Campaigns</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage content campaigns and track SEO progress.
          </p>
        </div>
        <Link
          href={`/clients/${clientId}/sites/${siteId}/seo/campaigns/new`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
        >
          + New Campaign
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Campaigns" value={totalCampaigns} />
        <StatCard label="Published Pieces" value={totalPublished} />
        <StatCard
          label="Next Scheduled"
          value={
            nextScheduledDate
              ? nextScheduledDate.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"
          }
          sub={nextScheduledDate ? "Upcoming campaign start" : "No upcoming schedules"}
        />
      </div>

      {/* Campaign grid */}
      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-10 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl border border-dashed border-zinc-700 flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-600"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            No campaigns yet. Create your first SEO campaign to get started.
          </p>
          <Link
            href={`/clients/${clientId}/sites/${siteId}/seo/campaigns/new`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Create First Campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => {
            const schedule = campaign.schedule as {
              startDate?: string;
              endDate?: string;
            } | null;
            const progressPct =
              campaign.totalPieces > 0
                ? Math.round((campaign.publishedCount / campaign.totalPieces) * 100)
                : 0;

            return (
              <button
                key={campaign.id}
                onClick={() =>
                  router.push(
                    `/clients/${clientId}/sites/${siteId}/seo/campaigns/${campaign.id}`
                  )
                }
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-left hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-150 group cursor-pointer"
              >
                {/* Name + status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-2 flex-1">
                    {campaign.name}
                  </h3>
                  <StatusBadge status={campaign.status} />
                </div>

                {/* Goal */}
                {campaign.goal && (
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{campaign.goal}</p>
                )}

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <span>Progress</span>
                    <span>
                      <span className="text-zinc-300">{campaign.publishedCount}</span>
                      {" / "}
                      {campaign.totalPieces} published
                    </span>
                  </div>
                  <ProgressBar
                    value={campaign.publishedCount}
                    max={campaign.totalPieces}
                  />
                  <p className="text-right text-[10px] text-zinc-600 mt-1">{progressPct}%</p>
                </div>

                {/* Channels */}
                {campaign.channels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {campaign.channels.map((ch) => (
                      <ChannelBadge key={ch} channel={ch} />
                    ))}
                  </div>
                )}

                {/* Date range */}
                {(schedule?.startDate || schedule?.endDate) && (
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-3 border-t border-zinc-800">
                    {schedule.startDate && (
                      <span>
                        Start:{" "}
                        <span className="text-zinc-400">
                          {new Date(schedule.startDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                    )}
                    {schedule.startDate && schedule.endDate && (
                      <span className="text-zinc-700">–</span>
                    )}
                    {schedule.endDate && (
                      <span>
                        End:{" "}
                        <span className="text-zinc-400">
                          {new Date(schedule.endDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
