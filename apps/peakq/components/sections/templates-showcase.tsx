// apps/peakq/components/sections/templates-showcase.tsx
"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// @ts-expect-error — GSAP ships type files as kebab-case but subpaths are PascalCase; TS casing conflict on macOS
import Flip from "gsap/Flip";
// @ts-expect-error — same as above
import ScrollTrigger from "gsap/ScrollTrigger";
import "@/lib/gsap-setup";

interface Template {
  id: string;
  name: string;
  industry: "Hospitality" | "Healthcare" | "Real Estate" | "Fitness" | "Restaurant" | "Other";
  accentColor: string;
}

const TEMPLATES: Template[] = [
  { id: "hotel-pro",      name: "Hotel Pro",       industry: "Hospitality",  accentColor: "#3b82f6" },
  { id: "villa-luxe",     name: "Villa Luxe",      industry: "Hospitality",  accentColor: "#6366f1" },
  { id: "clinic-suite",   name: "Clinic Suite",    industry: "Healthcare",   accentColor: "#8b5cf6" },
  { id: "medcare",        name: "MedCare Pro",     industry: "Healthcare",   accentColor: "#7c3aed" },
  { id: "realtor-os",     name: "Realtor OS",      industry: "Real Estate",  accentColor: "#10b981" },
  { id: "property-hub",   name: "Property Hub",    industry: "Real Estate",  accentColor: "#059669" },
  { id: "fitness-co",     name: "Fitness Co",      industry: "Fitness",      accentColor: "#f59e0b" },
  { id: "gym-elite",      name: "Gym Elite",       industry: "Fitness",      accentColor: "#d97706" },
  { id: "restaurant",     name: "The Table",       industry: "Restaurant",   accentColor: "#ef4444" },
  { id: "cafe-noir",      name: "Café Noir",       industry: "Restaurant",   accentColor: "#dc2626" },
  { id: "salon-pro",      name: "Salon Pro",       industry: "Other",        accentColor: "#ec4899" },
  { id: "agency-dark",    name: "Agency Dark",     industry: "Other",        accentColor: "#3b82f6" },
];

const INDUSTRIES = ["All", "Hospitality", "Healthcare", "Real Estate", "Fitness", "Restaurant"] as const;

function TemplateMockup({ template }: { template: Template }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        height: 180,
        background: "#0a0a0d",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Mockup nav bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0"
        style={{ background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {["#ef4444","#f59e0b","#22c55e"].map((c) => (
          <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
        ))}
      </div>

      {/* Mockup content */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-2">
        {/* Headline blocks */}
        <div className="h-2 rounded-sm w-3/4" style={{ background: "rgba(255,255,255,0.15)" }} />
        <div className="h-1.5 rounded-sm w-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-1.5 rounded-sm w-2/3" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* CTA button */}
        <div
          className="h-4 rounded-sm w-1/3 mt-1"
          style={{ background: template.accentColor, opacity: 0.9 }}
        />
      </div>

      {/* Live demo badge */}
      <div
        className="absolute top-6 right-2 text-[7px] uppercase tracking-[.1em] px-1.5 py-0.5"
        style={{
          background: template.accentColor,
          color: "#fff",
          fontFamily: "monospace",
        }}
      >
        Live Demo
      </div>

      {/* Card footer */}
      <div
        className="px-3 py-2 flex items-center justify-between flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#111114" }}
      >
        <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
          {template.name}
        </span>
        <span
          className="text-[7px] uppercase tracking-[.08em]"
          style={{ color: template.accentColor, fontFamily: "monospace" }}
        >
          {template.industry}
        </span>
      </div>
    </div>
  );
}

interface TemplatesShowcaseProps {
  id?: string;
}

export function TemplatesShowcase({ id }: TemplatesShowcaseProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const containerRef = useRef<HTMLElement>(null);

  const filtered =
    selectedIndustry === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.industry === selectedIndustry);

  const handleFilter = (category: string) => {
    setSelectedIndustry(category);

    const cards = containerRef.current!.querySelectorAll(".template-card");
    const state = Flip.getState(cards);

    // Toggle visibility based on filter
    cards.forEach((card) => {
      const el = card as HTMLElement;
      if (category === "All" || el.dataset.category?.includes(category)) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    });

    Flip.from(state, {
      duration: 0.7,
      ease: "power2.inOut",
      scale: true,
      absolute: true,
      stagger: 0.04,
      onEnter: (elements: Element[]) =>
        gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (elements: Element[]) =>
        gsap.to(elements, { opacity: 0, scale: 0, duration: 0.3 }),
    });
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".template-card", { opacity: 0, y: 60 });

      ScrollTrigger.batch(".template-card", {
        start: "top 90%",
        batchMax: 6,
        interval: 0.05,
        onEnter: (batch: Element[]) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        }),
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".template-card", { clearProps: "all" });
    });
  }, { scope: containerRef });

  return (
    <section
      id={id}
      ref={containerRef}
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,5,7,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="px-8 pt-14 pb-10" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-6">
          <span
            className="text-[9px] uppercase tracking-[.14em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
          >
            03 / Templates
          </span>
        </div>

        <h2
          style={{
            fontSize: "clamp(26px, 3.2vw, 40px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: 0.96,
          }}
        >
          {[
            { text: "40+ TEMPLATES.", outline: false },
            { text: "YOUR INDUSTRY.",  outline: true  },
            { text: "YOUR BRAND.",     outline: false },
          ].map((line, i) => (
            <div key={i} style={{ overflow: "hidden", display: "block", marginBottom: 3 }}>
              <span
                style={{
                  display: "block",
                  ...(line.outline
                    ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" }
                    : { color: "var(--text)" }),
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </h2>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-0 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {INDUSTRIES.map((industry) => {
          const isActive = selectedIndustry === industry;
          return (
            <button
              key={industry}
              onClick={() => handleFilter(industry)}
              className="px-5 py-3 text-[9px] uppercase tracking-[.1em] whitespace-nowrap transition-all flex-shrink-0"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                color: isActive ? "var(--accent)" : "var(--muted)",
                borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                background: isActive ? "var(--accent-dim)" : "transparent",
              }}
            >
              {industry}
            </button>
          );
        })}
      </div>

      {/* Template filmstrip grid */}
      <div className="px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATES.slice(0, 12).map((template) => {
            const isVisible =
              selectedIndustry === "All" || template.industry === selectedIndustry;
            return (
              <div
                key={template.id}
                className="template-card"
                data-category={template.industry}
                style={{ display: isVisible ? "" : "none" }}
              >
                <TemplateMockup template={template} />
              </div>
            );
          })}

          {/* +More ghost card */}
          {filtered.length > 4 && (
            <div
              className="hidden md:flex items-center justify-center"
              style={{
                height: 180,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <span
                className="text-[10px] uppercase tracking-[.1em]"
                style={{ color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}
              >
                +{filtered.length - 4} More
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Browse all button */}
      <div className="px-8 pb-10">
        <a
          href="/templates"
          className="flex items-center justify-center gap-2 w-full py-4 text-[10px] uppercase tracking-[.12em] transition-all"
          style={{
            border: "1px solid var(--border-mid)",
            color: "var(--muted)",
          }}
        >
          Browse All 40+ Templates →
        </a>
      </div>
      </div>
    </section>
  );
}
