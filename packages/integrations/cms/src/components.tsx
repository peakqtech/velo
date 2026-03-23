"use client";

import { useState, useCallback, type ReactNode } from "react";
import type { FieldDefinition, ContentSection } from "./field-types";

/* -------------------------------------------------------------------------- */
/*  FieldEditor                                                               */
/* -------------------------------------------------------------------------- */

interface FieldEditorProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function FieldEditor({ field, value, onChange }: FieldEditorProps) {
  const inputClasses =
    "w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-zinc-300 mb-1";

  switch (field.type) {
    case "text":
    case "email":
    case "url":
    case "color":
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.description && <p className="text-xs text-zinc-500 mb-1">{field.description}</p>}
          <input
            type={field.type === "color" ? "text" : field.type}
            className={inputClasses}
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.type === "color" && typeof value === "string" && value && (
            <div className="mt-1 flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-zinc-600" style={{ backgroundColor: value }} />
              <span className="text-xs text-zinc-400">{value}</span>
            </div>
          )}
        </div>
      );

    case "textarea":
    case "richtext":
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.description && <p className="text-xs text-zinc-500 mb-1">{field.description}</p>}
          <textarea
            className={`${inputClasses} min-h-[100px] resize-y`}
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "number":
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.description && <p className="text-xs text-zinc-500 mb-1">{field.description}</p>}
          <input
            type="number"
            className={inputClasses}
            value={(value as number) ?? ""}
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </div>
      );

    case "image":
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.description && <p className="text-xs text-zinc-500 mb-1">{field.description}</p>}
          <input
            type="url"
            className={inputClasses}
            value={(value as string) ?? ""}
            placeholder={field.placeholder ?? "https://example.com/image.jpg"}
            onChange={(e) => onChange(e.target.value)}
          />
          {typeof value === "string" && value && (value.startsWith("http") || value.startsWith("/")) && (
            <div className="mt-2">
              <img
                src={value}
                alt={field.label}
                className="max-h-32 rounded border border-zinc-700 object-contain"
              />
            </div>
          )}
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <div>
            <label className={labelClasses}>{field.label}</label>
            {field.description && <p className="text-xs text-zinc-500">{field.description}</p>}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              value ? "bg-blue-600" : "bg-zinc-600"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                value ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      );

    case "select":
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.description && <p className="text-xs text-zinc-500 mb-1">{field.description}</p>}
          <select
            className={inputClasses}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "object":
      return (
        <div className="rounded-lg border border-zinc-700 p-4">
          <h4 className="text-sm font-medium text-zinc-200 mb-3">{field.label}</h4>
          {field.description && <p className="text-xs text-zinc-500 mb-3">{field.description}</p>}
          <div className="space-y-4">
            {field.fields?.map((subField) => (
              <FieldEditor
                key={subField.key}
                field={subField}
                value={(value as Record<string, unknown>)?.[subField.key]}
                onChange={(subValue) => {
                  const current = (value as Record<string, unknown>) ?? {};
                  onChange({ ...current, [subField.key]: subValue });
                }}
              />
            ))}
          </div>
        </div>
      );

    case "array": {
      const items = Array.isArray(value) ? value : [];
      return (
        <div className="rounded-lg border border-zinc-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-zinc-200">{field.label}</h4>
            <button
              type="button"
              onClick={() => onChange([...items, {}])}
              className="rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600 transition-colors"
            >
              + Add item
            </button>
          </div>
          {field.description && <p className="text-xs text-zinc-500 mb-3">{field.description}</p>}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded border border-zinc-700 bg-zinc-800/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400">Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...items];
                      next.splice(index, 1);
                      onChange(next);
                    }}
                    className="rounded bg-red-900/50 px-2 py-0.5 text-xs text-red-300 hover:bg-red-900 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {field.itemFields ? (
                  <div className="space-y-3">
                    {field.itemFields.map((subField) => (
                      <FieldEditor
                        key={subField.key}
                        field={subField}
                        value={(item as Record<string, unknown>)?.[subField.key]}
                        onChange={(subValue) => {
                          const next = [...items];
                          const current = (next[index] as Record<string, unknown>) ?? {};
                          next[index] = { ...current, [subField.key]: subValue };
                          onChange(next);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    className={inputClasses}
                    value={typeof item === "string" ? item : JSON.stringify(item)}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = e.target.value;
                      onChange(next);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "json":
    default:
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.description && <p className="text-xs text-zinc-500 mb-1">{field.description}</p>}
          <textarea
            className={`${inputClasses} min-h-[80px] resize-y font-mono text-xs`}
            value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                onChange(e.target.value);
              }
            }}
          />
        </div>
      );
  }
}

/* -------------------------------------------------------------------------- */
/*  SectionEditor                                                             */
/* -------------------------------------------------------------------------- */

interface SectionEditorProps {
  section: ContentSection;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionEditor({ section, data, onChange }: SectionEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{section.label}</h3>
        {section.description && <p className="mt-1 text-sm text-zinc-400">{section.description}</p>}
      </div>
      <div className="space-y-5">
        {section.fields.map((field) => (
          <FieldEditor
            key={field.key}
            field={field}
            value={data[field.key]}
            onChange={(value) => {
              onChange({ ...data, [field.key]: value });
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ContentEditor                                                             */
/* -------------------------------------------------------------------------- */

interface ContentEditorProps {
  sections: ContentSection[];
  content: Record<string, unknown>;
  onSave: (content: Record<string, unknown>) => Promise<void>;
}

export function ContentEditor({ sections, content: initialContent, onSave }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState(sections[0]?.key ?? "");
  const [content, setContent] = useState<Record<string, unknown>>(initialContent);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSectionChange = useCallback(
    (sectionKey: string, sectionData: Record<string, unknown>) => {
      setContent((prev) => ({ ...prev, [sectionKey]: sectionData }));
      setHasChanges(true);
      setSaveState("idle");
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setSaveState("saving");
    try {
      await onSave(content);
      setSaveState("saved");
      setHasChanges(false);
    } catch {
      setSaveState("error");
    }
  }, [content, onSave]);

  const activeSection = sections.find((s) => s.key === activeTab);

  return (
    <div className="flex h-full flex-col bg-zinc-900">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-zinc-100">Content Editor</h2>
          {hasChanges && (
            <span className="rounded-full bg-amber-900/50 px-2 py-0.5 text-xs text-amber-300">
              Unsaved changes
            </span>
          )}
          {saveState === "saved" && (
            <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-xs text-green-300">Saved</span>
          )}
          {saveState === "error" && (
            <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-xs text-red-300">
              Error saving
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || saveState === "saving"}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveState === "saving" ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tab navigation */}
        <nav className="w-56 shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-900 p-3">
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.key}>
                <button
                  type="button"
                  onClick={() => setActiveTab(section.key)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    activeTab === section.key
                      ? "bg-zinc-800 text-zinc-100 font-medium"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                  }`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection && (
            <SectionEditor
              section={activeSection}
              data={(content[activeSection.key] as Record<string, unknown>) ?? {}}
              onChange={(data) => handleSectionChange(activeSection.key, data)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
