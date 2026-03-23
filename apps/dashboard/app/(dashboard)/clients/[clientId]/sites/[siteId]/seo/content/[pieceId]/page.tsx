"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ContentTemplate {
  id: string;
  name: string;
}

interface ContentPiece {
  id: string;
  title: string;
  slug: string | null;
  channel: string;
  status: string;
  targetKeyword: string | null;
  scheduledFor: string | null;
  modelUsed: string | null;
  tokenCount: number | null;
  reviewNote: string | null;
  content: Record<string, unknown> | null;
  metaData: Record<string, unknown> | null;
  generatedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  campaign: { id: string; name: string } | null;
  contentTemplate: ContentTemplate | null;
}

/* -------------------------------------------------------------------------- */
/*  Status badge colors                                                        */
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
/*  Markdown renderer (simple, no external deps)                               */
/* -------------------------------------------------------------------------- */

function SimpleMarkdown({ content }: { content: string }) {
  // Very basic markdown → HTML: headers, bold, italic, code, lists, paragraphs
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^### /.test(line)) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-zinc-200 mt-5 mb-1.5">
          {line.slice(4)}
        </h3>
      );
    } else if (/^## /.test(line)) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-zinc-100 mt-6 mb-2">
          {line.slice(3)}
        </h2>
      );
    } else if (/^# /.test(line)) {
      elements.push(
        <h1 key={i} className="text-xl font-bold text-zinc-100 mt-6 mb-2">
          {line.slice(2)}
        </h1>
      );
    } else if (/^- /.test(line) || /^\* /.test(line)) {
      elements.push(
        <li key={i} className="text-sm text-zinc-300 ml-4 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (/^\d+\. /.test(line)) {
      elements.push(
        <li key={i} className="text-sm text-zinc-300 ml-4 list-decimal">
          {line.replace(/^\d+\. /, "")}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-3" />);
    } else {
      // Inline: bold (**), italic (*), code (`)
      const parsed = line
        .replace(/\*\*(.+?)\*\*/g, "<strong class='text-zinc-100 font-semibold'>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em class='text-zinc-300 italic'>$1</em>")
        .replace(/`(.+?)`/g, "<code class='text-zinc-300 bg-zinc-800 rounded px-1 text-xs font-mono'>$1</code>");
      elements.push(
        <p
          key={i}
          className="text-sm text-zinc-300 leading-relaxed"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: parsed }}
        />
      );
    }
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                      */
/* -------------------------------------------------------------------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function ContentPieceEditorPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const siteId = params.siteId as string;
  const pieceId = params.pieceId as string;

  const [piece, setPiece] = useState<ContentPiece | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Polling for GENERATING status
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Action loading states
  const [approving, setApproving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Modals
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const [regenModal, setRegenModal] = useState(false);
  const [regenFeedback, setRegenFeedback] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  // Copy feedback
  const [copied, setCopied] = useState(false);

  // Action message
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchPiece = useCallback(async () => {
    try {
      const data = await fetchAPI<ContentPiece>(
        `/api/sites/${siteId}/seo/content/${pieceId}`
      );
      setPiece(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content piece");
      return null;
    }
  }, [siteId, pieceId]);

  useEffect(() => {
    setLoading(true);
    fetchPiece().finally(() => setLoading(false));
  }, [fetchPiece]);

  // Poll when status is GENERATING
  useEffect(() => {
    if (piece?.status === "GENERATING") {
      if (!pollRef.current) {
        pollRef.current = setInterval(async () => {
          const updated = await fetchPiece();
          if (updated && updated.status !== "GENERATING") {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          }
        }, 2000);
      }
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [piece?.status, fetchPiece]);

  /* ---- Helpers ---- */

  const getContentString = (p: ContentPiece): string => {
    if (!p.content) return "";
    const c = p.content;
    if (typeof c === "string") return c;
    // Blog: body field
    if (typeof c.body === "string") return c.body;
    // GBP/Social/Email: text field
    if (typeof c.text === "string") return c.text;
    if (typeof c.content === "string") return c.content;
    return JSON.stringify(c, null, 2);
  };

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = (text: string) => text.length;

  /* ---- Actions ---- */

  const handleApprove = async () => {
    if (!piece) return;
    setApproving(true);
    setActionMsg(null);
    try {
      const updated = await fetchAPI<ContentPiece>(`/api/sites/${siteId}/seo/content/${pieceId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "APPROVED" }),
      });
      setPiece(updated);
      // Also publish
      setPublishing(true);
      try {
        await fetchAPI(`/api/sites/${siteId}/seo/content/${pieceId}/publish`, { method: "POST" });
        await fetchPiece();
        setActionMsg("Approved and published.");
      } catch {
        setActionMsg("Approved. Publish step failed — check logs.");
      } finally {
        setPublishing(false);
      }
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!piece) return;
    setRejecting(true);
    try {
      const updated = await fetchAPI<ContentPiece>(`/api/sites/${siteId}/seo/content/${pieceId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "REJECTED", reviewNote: rejectNote }),
      });
      setPiece(updated);
      setRejectModal(false);
      setRejectNote("");
      setActionMsg("Content rejected.");
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setRejecting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!piece) return;
    setRegenerating(true);
    try {
      await fetchAPI(`/api/sites/${siteId}/seo/content/${pieceId}/generate`, {
        method: "POST",
        body: JSON.stringify({ feedback: regenFeedback }),
      });
      setRegenModal(false);
      setRegenFeedback("");
      setActionMsg("Regeneration started. Content will update shortly.");
      await fetchPiece();
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!piece) return;
    setSaving(true);
    try {
      const isBlog = piece.channel === "BLOG";
      const contentUpdate = isBlog
        ? { ...piece.content, body: editedContent }
        : { ...piece.content, text: editedContent };
      const updated = await fetchAPI<ContentPiece>(`/api/sites/${siteId}/seo/content/${pieceId}`, {
        method: "PUT",
        body: JSON.stringify({ content: contentUpdate }),
      });
      setPiece(updated);
      setEditing(false);
      setActionMsg("Content saved.");
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---- Render ---- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3" />
          <p className="text-sm text-zinc-500">Loading content piece…</p>
        </div>
      </div>
    );
  }

  if (error || !piece) {
    return (
      <div className="space-y-4">
        <p className="text-red-400 text-sm">{error ?? "Content piece not found"}</p>
        <Link
          href={`/clients/${clientId}/sites/${siteId}/seo`}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Back to SEO
        </Link>
      </div>
    );
  }

  const contentStr = getContentString(piece);
  const isBlog = piece.channel === "BLOG";
  const isGenerating = piece.status === "GENERATING";

  const campaignHref = piece.campaign
    ? `/clients/${clientId}/sites/${siteId}/seo/campaigns/${piece.campaign.id}`
    : `/clients/${clientId}/sites/${siteId}/seo`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">Client</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}/sites/${siteId}/seo`} className="hover:text-zinc-300 transition-colors">SEO</Link>
        <span>/</span>
        {piece.campaign && (
          <>
            <Link href={campaignHref} className="hover:text-zinc-300 transition-colors">
              {piece.campaign.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-300 truncate max-w-[180px]">{piece.title}</span>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={piece.status} />
          <ChannelBadge channel={piece.channel} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Edit toggle */}
          {!isGenerating && contentStr && (
            <button
              onClick={() => {
                if (editing) {
                  setEditing(false);
                } else {
                  setEditedContent(contentStr);
                  setEditing(true);
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              {editing ? "Cancel Edit" : "Edit"}
            </button>
          )}
          {editing && (
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-medium bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          )}
          {/* Regenerate */}
          {!isGenerating && (
            <button
              onClick={() => setRegenModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              Regenerate
            </button>
          )}
          {/* Reject */}
          {["DRAFT", "IN_REVIEW"].includes(piece.status) && (
            <button
              onClick={() => setRejectModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Reject
            </button>
          )}
          {/* Approve */}
          {["DRAFT", "IN_REVIEW", "APPROVED"].includes(piece.status) && (
            <button
              onClick={handleApprove}
              disabled={approving || publishing}
              className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {approving ? "Approving…" : publishing ? "Publishing…" : "Approve & Publish"}
            </button>
          )}
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="mb-3 px-4 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700">
          <p className="text-xs text-zinc-300">{actionMsg}</p>
        </div>
      )}

      {/* GENERATING spinner overlay inside content area */}
      {isGenerating ? (
        <div className="flex-1 flex items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
              <span className="text-sm font-medium text-yellow-400">Generating content…</span>
            </div>
            <p className="text-xs text-zinc-500">This page will update automatically when done.</p>
          </div>
        </div>
      ) : (
        /* Split layout: left 2/3 content | right 1/3 metadata */
        <div className="flex flex-1 gap-6 min-h-0">
          {/* Left: content preview / editor */}
          <div className="flex-1 lg:w-2/3 overflow-y-auto">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 h-full flex flex-col">
              {/* Content panel header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-300">
                  {piece.title}
                </h2>
                <div className="flex items-center gap-3">
                  {isBlog ? (
                    <span className="text-[11px] text-zinc-500">
                      {wordCount(contentStr)} words
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-500">
                      {charCount(contentStr)} chars
                    </span>
                  )}
                  {!isBlog && contentStr && !editing && (
                    <button
                      onClick={() => handleCopy(contentStr)}
                      className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto p-5">
                {!piece.content ? (
                  <p className="text-sm text-zinc-500 italic">No content generated yet.</p>
                ) : editing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-full min-h-[400px] bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-200 font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : isBlog ? (
                  <SimpleMarkdown content={contentStr} />
                ) : (
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {contentStr}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: metadata panel */}
          <div className="w-full lg:w-1/3 shrink-0 overflow-y-auto">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-5">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Details</h3>

              {/* Target keyword */}
              <MetaRow label="Target Keyword">
                {piece.targetKeyword ? (
                  <span className="text-sm text-zinc-200">{piece.targetKeyword}</span>
                ) : (
                  <span className="text-sm text-zinc-500">—</span>
                )}
              </MetaRow>

              {/* Channel */}
              <MetaRow label="Channel">
                <ChannelBadge channel={piece.channel} />
              </MetaRow>

              {/* Scheduled */}
              <MetaRow label="Scheduled For">
                <span className="text-sm text-zinc-200">
                  {piece.scheduledFor
                    ? new Date(piece.scheduledFor).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </MetaRow>

              {/* Model used */}
              <MetaRow label="Model">
                <span className="text-sm text-zinc-400 font-mono">{piece.modelUsed ?? "—"}</span>
              </MetaRow>

              {/* Template */}
              <MetaRow label="Template">
                <span className="text-sm text-zinc-400">{piece.contentTemplate?.name ?? "—"}</span>
              </MetaRow>

              {/* Token count */}
              <MetaRow label="Tokens">
                <span className="text-sm text-zinc-400">
                  {piece.tokenCount !== null && piece.tokenCount !== undefined
                    ? piece.tokenCount.toLocaleString()
                    : "—"}
                </span>
              </MetaRow>

              {/* Channel-specific indicator */}
              {contentStr && (
                <MetaRow label={isBlog ? "Word Count" : "Character Count"}>
                  <span className="text-sm text-zinc-200 font-medium">
                    {isBlog ? wordCount(contentStr).toLocaleString() : charCount(contentStr).toLocaleString()}
                  </span>
                </MetaRow>
              )}

              {/* Review note */}
              {piece.reviewNote && (
                <div className="pt-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Review Note</p>
                  <p className="text-sm text-zinc-300 italic">{piece.reviewNote}</p>
                </div>
              )}

              {/* Campaign link */}
              {piece.campaign && (
                <div className="pt-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Campaign</p>
                  <Link
                    href={`/clients/${clientId}/sites/${siteId}/seo/campaigns/${piece.campaign.id}`}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors truncate block"
                  >
                    {piece.campaign.name}
                  </Link>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Timestamps</p>
                <TimestampRow label="Created" value={piece.createdAt} />
                <TimestampRow label="Updated" value={piece.updatedAt} />
                {piece.generatedAt && <TimestampRow label="Generated" value={piece.generatedAt} />}
                {piece.publishedAt && <TimestampRow label="Published" value={piece.publishedAt} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Modal title="Reject Content" onClose={() => setRejectModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Review Note (optional)</label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Explain why this content is being rejected…"
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setRejectModal(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Regenerate Modal */}
      {regenModal && (
        <Modal title="Regenerate Content" onClose={() => setRegenModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Feedback (optional)</label>
              <textarea
                value={regenFeedback}
                onChange={(e) => setRegenFeedback(e.target.value)}
                placeholder="What should be different this time? (tone, length, focus, etc.)"
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setRegenModal(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {regenerating ? "Starting…" : "Regenerate"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small helper components                                                    */
/* -------------------------------------------------------------------------- */

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      {children}
    </div>
  );
}

function TimestampRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs text-zinc-400">
        {new Date(value).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
