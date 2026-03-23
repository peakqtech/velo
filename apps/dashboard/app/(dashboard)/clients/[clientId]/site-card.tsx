"use client";

import { useState } from "react";
import Link from "next/link";

export interface SiteData {
  id: string;
  name: string;
  slug: string;
  template: string;
  domain: string | null;
  siteUrl: string | null;
  deployStatus: string;
  qaReports: { healthScore: number }[];
}

const templateGradients: Record<string, string> = {
  velocity: "from-red-600 to-orange-600",
  ember: "from-amber-600 to-red-700",
  haven: "from-emerald-600 to-teal-700",
  nexus: "from-orange-500 to-amber-600",
  prism: "from-violet-600 to-indigo-600",
  serenity: "from-green-600 to-emerald-700",
};

const deployColors: Record<string, { dot: string; text: string; label: string }> = {
  DEPLOYED: { dot: "bg-green-500", text: "text-green-400", label: "Live" },
  PENDING: { dot: "bg-zinc-500", text: "text-zinc-400", label: "Draft" },
  BUILDING: { dot: "bg-amber-500", text: "text-amber-400", label: "Building" },
  FAILED: { dot: "bg-red-500", text: "text-red-400", label: "Failed" },
};

export function SiteCard({ site, clientId }: { site: SiteData; clientId: string }) {
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(site.siteUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [localSiteUrl, setLocalSiteUrl] = useState(site.siteUrl);
  const [localDeployStatus, setLocalDeployStatus] = useState(site.deployStatus);

  const deploy = deployColors[localDeployStatus] ?? deployColors.PENDING;
  const healthScore = site.qaReports?.[0]?.healthScore;
  const isLive = localDeployStatus === "DEPLOYED" && !!localSiteUrl;

  const handleSaveUrl = async () => {
    setSaving(true);
    setSaveError(null);
    const newUrl = urlInput.trim() || null;
    const newStatus = newUrl ? "DEPLOYED" : "PENDING";

    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl: newUrl, deployStatus: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }

      setLocalSiteUrl(newUrl);
      setLocalDeployStatus(newStatus);
      setEditingUrl(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${templateGradients[site.template] ?? "from-zinc-600 to-zinc-700"} flex items-center justify-center`}
          >
            <span className="text-xs font-bold text-white">
              {site.template[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{site.name}</p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
              <span className="capitalize">{site.template}</span>
              {localSiteUrl && (
                <span className="truncate max-w-[200px]">
                  {localSiteUrl.replace(/^https?:\/\//, "")}
                </span>
              )}
              <span className={`flex items-center gap-1 ${deploy.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${deploy.dot}`} />
                {deploy.label}
              </span>
              {healthScore !== undefined && <span>Health: {healthScore}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isLive && (
            <a
              href={localSiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-blue-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open
            </a>
          )}
          <button
            onClick={() => setEditingUrl(true)}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            {localSiteUrl ? "Change URL" : "Set URL"}
          </button>
          <Link
            href={`/clients/${clientId}/sites/${site.id}/seo`}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            SEO
          </Link>
          <Link
            href={`/clients/${clientId}/sites/${site.id}/reservations`}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Reservations
          </Link>
        </div>
      </div>

      {/* URL editor */}
      {editingUrl && (
        <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/80">
          <label className="block text-xs text-zinc-500 mb-1.5">
            Site URL (paste the deployed URL after hosting on Vercel or any platform)
          </label>
          <div className="flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://sushimasa.vercel.app"
              className="flex-1 h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSaveUrl()}
            />
            <button
              onClick={handleSaveUrl}
              disabled={saving}
              className="px-4 h-9 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditingUrl(false);
                setUrlInput(localSiteUrl ?? "");
                setSaveError(null);
              }}
              className="px-3 h-9 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
          </div>
          {saveError && <p className="text-xs text-red-400 mt-2">{saveError}</p>}
        </div>
      )}

      {/* Live preview — 16:10 aspect ratio */}
      {isLive && (
        <div className="relative bg-black" style={{ aspectRatio: "16/10" }}>
          <iframe
            src={localSiteUrl!}
            className="absolute inset-0 border-0"
            style={{
              width: "250%",
              height: "250%",
              transform: "scale(0.4)",
              transformOrigin: "top left",
            }}
            title={`Preview of ${site.name}`}
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-zinc-300">Live</span>
          </div>
        </div>
      )}

      {/* Not live */}
      {!isLive && (
        <div className="p-8 text-center">
          <p className="text-sm text-zinc-400">
            {localSiteUrl
              ? "Connecting..."
              : "No URL set \u2014 deploy the site first, then set the URL"}
          </p>
          {!localSiteUrl && (
            <button
              onClick={() => setEditingUrl(true)}
              className="mt-3 px-4 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              Set Site URL
            </button>
          )}
        </div>
      )}
    </div>
  );
}
