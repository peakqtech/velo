"use client";

import { useState } from "react";
import { templates, TEMPLATE_CATEGORIES } from "@/lib/templates.config";
import { TemplateCard, RequestIndustryCard } from "@/components/template-card";

export function TemplateGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered =
    activeFilter === "all"
      ? templates
      : templates.filter((t) => t.category === activeFilter);

  return (
    <div className="flex flex-col gap-8">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveFilter(cat.slug)}
            className="rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-200"
            style={
              activeFilter === cat.slug
                ? {
                    backgroundColor: "#4ade80",
                    color: "#030712",
                    borderColor: "#4ade80",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "#9ca3af",
                    borderColor: "#374151",
                  }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((template) => (
          <TemplateCard key={template.slug} template={template} />
        ))}
        <RequestIndustryCard />
      </div>
    </div>
  );
}
