"use client";

import { useState } from "react";
import { generateSectionsFromContent, FieldEditor } from "@velo/integration-cms";
import type { FieldDefinition } from "@velo/integration-cms";
import { SectionPreview } from "./preview";

// Demo content — in production this comes from the database
const DEMO_CONTENT: Record<string, unknown> = {
  hero: {
    headline: "Run Faster. Go Further.",
    tagline: "Premium athletic wear engineered for peak performance",
    cta: { label: "Shop Now", href: "/shop" },
    media: { type: "video", src: "/videos/hero.mp4", poster: "/images/hero-poster.jpg", alt: "Athletes running" },
    overlay: { opacity: 0.4, gradient: "linear-gradient(to bottom, transparent, black)" },
  },
  productShowcase: {
    title: "Featured Collection",
    subtitle: "Engineered for champions",
    products: [
      { name: "Velocity Pro", image: "/images/shoe-1.jpg", alt: "Running shoe", features: [] },
      { name: "Aero Jacket", image: "/images/jacket-1.jpg", alt: "Lightweight jacket", features: [] },
    ],
  },
  testimonials: {
    heading: "What Athletes Say",
    testimonials: [
      { quote: "Best running gear I've ever owned.", author: "Sarah K.", role: "Marathon Runner", avatar: "/images/avatar-1.jpg", avatarAlt: "Sarah" },
    ],
  },
  footer: {
    brand: { name: "Velocity", logo: "/images/logo.svg" },
    newsletter: { heading: "Stay in the race", placeholder: "Enter your email", cta: "Subscribe" },
    socials: [{ platform: "Instagram", url: "https://instagram.com", icon: "instagram" }],
    links: [{ group: "Shop", items: [{ label: "Running", href: "/running" }] }],
    legal: "\u00a9 2026 Velocity Athletics",
  },
};

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
  const [content, setContent] = useState<Record<string, unknown>>(DEMO_CONTENT);
  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sections = generateSectionsFromContent(content);

  const handleSave = async (updatedContent: Record<string, unknown>) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setContent(updatedContent);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            onClick={() => handleSave(content)}
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
                      setContent((prev) => ({
                        ...prev,
                        [activeSection]: {
                          ...(prev[activeSection] as Record<string, unknown>),
                          [field.key]: newValue,
                        },
                      }));
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
