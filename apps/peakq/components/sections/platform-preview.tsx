"use client";

import { useRef } from "react";
import gsap from "gsap";
// @ts-expect-error — GSAP ships type files as kebab-case but subpaths are PascalCase; TS casing conflict on macOS
import { useGSAP } from "@gsap/react";
import "@/lib/gsap-setup";

interface PlatformPreviewProps {
  id?: string;
}

function KpiCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-4"
      style={{ backgroundColor: "#020a1a", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(59,130,246,0.15)" }}
    >
      <div className="text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {delta && (
        <div className="text-[11px]" style={{ color: "#3b82f6" }}>{delta}</div>
      )}
    </div>
  );
}

const SIDEBAR_ITEMS = ["Overview", "Website", "Ads", "Email", "Reviews", "Analytics"];

const HEADLINE_LINES: { text: string; stroke: boolean }[] = [
  { text: "ONE SCREEN.", stroke: false },
  { text: "YOUR WHOLE", stroke: true },
  { text: "DIGITAL BUSINESS.", stroke: false },
];

export function PlatformPreview({ id }: PlatformPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".platform-mockup", {
        y: 80, opacity: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 75%", once: true },
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".platform-mockup", { clearProps: "all" });
    });
  }, { scope: containerRef });

  return (
    <section
      id={id}
      ref={containerRef}
      className="py-20 px-4 md:px-8 overflow-hidden"
      style={{
        background: "rgba(5,5,7,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow + H2 */}
        <div className="text-center mb-12">
          <p
            className="text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "var(--font-mono)", color: "#3b82f6" }}
          >
            See It In Action
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 4vw, 52px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
            }}
          >
            {HEADLINE_LINES.map(({ text, stroke }) => (
              <div key={text} className="overflow-hidden">
                <span
                  className="block"
                  style={
                    stroke
                      ? {
                          WebkitTextStroke: "1px white",
                          color: "transparent",
                        }
                      : { color: "white" }
                  }
                >
                  {text}
                </span>
              </div>
            ))}
          </h2>
        </div>

        {/* Browser mockup */}
        <div
          className="platform-mockup"
          data-speed="0.95"
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "rgba(59,130,246,0.25)",
            boxShadow: "0 0 60px rgba(59,130,246,0.1)",
          }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ backgroundColor: "#050d1f", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "rgba(59,130,246,0.15)" }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <div
              className="ml-4 px-4 py-1 text-[11px] flex-1 max-w-xs"
              style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: "#020a1a",
                color: "rgba(255,255,255,0.4)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              peakq.tech/dashboard
            </div>
          </div>

          {/* Dashboard interior */}
          <div className="flex" style={{ backgroundColor: "#030d20" }}>
            {/* Sidebar */}
            <div
              className="flex flex-col gap-1 py-4 px-2 min-w-[110px]"
              style={{ borderRightWidth: "1px", borderRightStyle: "solid", borderRightColor: "rgba(59,130,246,0.12)" }}
            >
              {SIDEBAR_ITEMS.map((item, i) => (
                <div
                  key={item}
                  className="px-3 py-1.5 text-[11px] rounded-sm"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: i === 0 ? "white" : "rgba(255,255,255,0.4)",
                    backgroundColor: i === 0 ? "rgba(59,130,246,0.15)" : "transparent",
                    letterSpacing: "0.03em",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <KpiCard label="Leads Today" value="24" delta="+8 vs yesterday" />
                <KpiCard label="Reviews" value="4.9★" delta="12 new this week" />
                <KpiCard label="Automated %" value="78%" delta="↑ 6% this month" />
              </div>

              {/* Activity feed + mini chart */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-4"
                  style={{ backgroundColor: "#020a1a", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(59,130,246,0.15)" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>
                    Recent Activity
                  </div>
                  {[
                    "Lead captured via web form",
                    "Review request sent × 3",
                    "Follow-up email triggered",
                    "New booking confirmed",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="p-4 flex flex-col"
                  style={{ backgroundColor: "#020a1a", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(59,130,246,0.15)" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>
                    Lead Volume — 7d
                  </div>
                  <svg viewBox="0 0 200 60" className="flex-1" aria-hidden="true">
                    <polyline
                      points="0,50 30,40 60,45 90,25 120,30 150,15 200,10"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    <polyline
                      points="0,50 30,40 60,45 90,25 120,30 150,15 200,10 200,60 0,60"
                      fill="rgba(59,130,246,0.08)"
                      stroke="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
