"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { generateSectionsFromContent, FieldEditor } from "@velo/integration-cms";
import type { FieldDefinition } from "@velo/integration-cms";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*  Field Editor Wrapper                                                      */
/* -------------------------------------------------------------------------- */

function FieldEditorWrapper({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  return (
    <div className="group">
      <FieldEditor field={field} value={value} onChange={onChange} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content Page (per-client, per-site)                                       */
/* -------------------------------------------------------------------------- */

export default function SiteContentPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const siteId = params.siteId as string;

  const [site, setSite] = useState<any>(null);
  const [dbContent, setDbContent] = useState<Record<string, unknown> | null>(null);
  const [localContent, setLocalContent] = useState<Record<string, unknown> | null>(null);
  const [siteLoading, setSiteLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.5);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load site info
  useEffect(() => {
    setSiteLoading(true);
    fetchAPI<any>(`/api/sites/${siteId}`)
      .then(setSite)
      .catch((err) => setError(err.message))
      .finally(() => setSiteLoading(false));
  }, [siteId]);

  // Load content
  useEffect(() => {
    setContentLoading(true);
    fetchAPI<any>(`/api/sites/${siteId}/content`)
      .then(setDbContent)
      .catch((err) => setError(err.message))
      .finally(() => setContentLoading(false));
  }, [siteId]);

  // Template site URL
  const templatePorts: Record<string, number> = {
    velocity: 3000, ember: 3001, haven: 3002,
    nexus: 3003, prism: 3004, serenity: 3005,
  };
  const templateUrl = `http://localhost:${templatePorts[site?.template ?? "velocity"] ?? 3000}/en`;

  const content = localContent ?? dbContent;

  // Listen for preview-ready message from iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "velo:preview-ready") {
        setPreviewReady(true);
        if (content && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: "velo:content-update", content },
            "*"
          );
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [content]);

  // Send content updates to iframe on every edit
  const sendToPreview = useCallback((updatedContent: Record<string, unknown>) => {
    if (previewReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "velo:content-update", content: updatedContent },
        "*"
      );
    }
  }, [previewReady]);

  // Scroll iframe to active section when tab changes
  useEffect(() => {
    if (previewReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "velo:scroll-to", section: activeSection },
        "*"
      );
    }
  }, [activeSection, previewReady]);

  const isLoading = siteLoading || contentLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3" />
            <p className="text-sm text-zinc-500">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-sm text-red-400 mb-2">Failed to load content.</p>
            <p className="text-xs text-zinc-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!site || !content) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-sm text-zinc-400">No site or content found.</p>
          </div>
        </div>
      </div>
    );
  }

  const sections = generateSectionsFromContent(content);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const saved = await fetchAPI<any>(`/api/sites/${siteId}/content`, {
        method: "PUT",
        body: JSON.stringify(content),
      });
      setDbContent(saved);
      setLocalContent(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">{site.name}</Link>
        <span>/</span>
        <span className="text-zinc-300">Content Editor</span>
      </div>

      {/* Top bar: section tabs + save button */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-150 ${
                activeSection === section.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* Split pane: Editor | Preview */}
      <div className="flex flex-1 gap-0 mt-4 min-h-0">
        {/* Left: Editor fields */}
        <div className="w-1/2 overflow-y-auto pr-6 border-r border-zinc-800">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">
              {sections.find((s) => s.key === activeSection)?.label || "Section"}
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">Edit the fields below to update your content</p>
          </div>
          {sections
            .filter((s) => s.key === activeSection)
            .map((section) => (
              <div key={section.key} className="space-y-5">
                {section.fields.map((field) => (
                  <FieldEditorWrapper
                    key={field.key}
                    field={field}
                    value={
                      (content[activeSection] as Record<string, unknown>)?.[
                        field.key
                      ]
                    }
                    onChange={(newValue) => {
                      setLocalContent((prev) => {
                        const base = prev ?? content;
                        const updated = {
                          ...base,
                          [activeSection]: {
                            ...(base[activeSection] as Record<string, unknown>),
                            [field.key]: newValue,
                          },
                        };
                        sendToPreview(updated);
                        return updated;
                      });
                    }}
                  />
                ))}
              </div>
            ))}
        </div>

        {/* Right: Live Preview */}
        <div className="w-1/2 flex flex-col pl-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${previewReady ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {previewReady ? "Live Preview" : "Connecting..."}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewScale(previewScale === 1 ? 0.75 : previewScale === 0.75 ? 0.5 : 1)}
                className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {Math.round(previewScale * 100)}%
              </button>
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-zinc-800 overflow-hidden bg-black relative">
            <iframe
              ref={iframeRef}
              src={templateUrl}
              className="absolute inset-0 border-0"
              style={{
                width: `${100 / previewScale}%`,
                height: `${100 / previewScale}%`,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
              title="Site preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
