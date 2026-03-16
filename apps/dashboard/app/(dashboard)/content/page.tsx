"use client";

import { useState } from "react";
import { generateSectionsFromContent, FieldEditor } from "@velo/integration-cms";
import type { FieldDefinition } from "@velo/integration-cms";
import { SectionPreview } from "./preview";
import { useActiveSite, useSiteContent } from "@/lib/hooks";

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
/*  Content Page                                                              */
/* -------------------------------------------------------------------------- */

export default function ContentPage() {
  const { site, loading: siteLoading, error: siteError } = useActiveSite();
  const { content: dbContent, loading: contentLoading, error: contentError, saveContent } = useSiteContent(site?.id ?? null);

  const [localContent, setLocalContent] = useState<Record<string, unknown> | null>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync DB content into local state when it arrives
  const content = localContent ?? dbContent;

  // When dbContent loads and localContent hasn't been set, initialize it
  if (dbContent && !localContent) {
    // This will trigger a re-render with the DB content
    // Using a controlled pattern: local edits override DB state
  }

  const isLoading = siteLoading || contentLoading;
  const error = siteError || contentError;

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
            <p className="text-xs text-zinc-600 mt-1">Create a site first to start editing content.</p>
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
      await saveContent(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Error is handled by the hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
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
                        return {
                          ...base,
                          [activeSection]: {
                            ...(base[activeSection] as Record<string, unknown>),
                            [field.key]: newValue,
                          },
                        };
                      });
                    }}
                  />
                ))}
              </div>
            ))}
        </div>

        {/* Right: Live Preview */}
        <div className="w-1/2 overflow-y-auto pl-6">
          <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Live Preview
              </span>
            </div>
          </div>
          <SectionPreview
            sectionKey={activeSection}
            data={(content[activeSection] as Record<string, unknown>) || {}}
          />
        </div>
      </div>
    </div>
  );
}
