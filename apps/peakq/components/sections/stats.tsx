// apps/peakq/components/sections/stats.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// @ts-ignore
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/lib/gsap-setup";

const STATS = [
  { value: "200+", unit: "Active Clients",    sub: "Across 14 industries" },
  { value: "40+",  unit: "Templates Ready",   sub: "Deploy in 48 hours" },
  { value: "4.3×", unit: "Average ROI",        sub: "Measured over 90 days" },
  { value: "48h",  unit: "Time to Launch",     sub: "From signup to live site" },
];

export function Stats() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Set initial state
      gsap.set(".stat-card", { opacity: 0, y: 60 });

      // Cards fade in
      gsap.to(".stat-card", {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // ScrambleText on each stat value
      const values = containerRef.current!.querySelectorAll(".stat-value");
      values.forEach((el, i) => {
        const finalText = el.textContent || "";
        gsap.from(el, {
          scrambleText: {
            text: finalText,
            chars: "0123456789.+×",
            revealDelay: 0.3,
            speed: 0.6,
          },
          duration: 1.5,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        });
      });

      // Labels fade in after numbers
      gsap.from(".stat-unit", {
        y: 15,
        opacity: 0,
        stagger: 0.2,
        duration: 0.4,
        delay: 0.8,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".stat-card, .stat-unit", { clearProps: "all" });
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,5,7,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div
          className="flex items-center gap-3 px-8 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="h-px flex-1"
            style={{ background: "var(--border-mid)" }}
          />
          <span
            className="text-[9px] uppercase tracking-[.14em]"
            style={{ color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}
          >
            By the numbers
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "var(--border-mid)" }}
          />
        </div>

        {/* 4-column grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderLeft: "1px solid var(--border)" }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.unit}
              className="stat-card group relative px-8 py-10 flex flex-col gap-1"
              style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
            >
              {/* Accent underline — expands on hover via CSS */}
              <div
                className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 origin-left transition-transform duration-[250ms] group-hover:scale-x-100"
                style={{ background: "var(--accent)" }}
              />

              <div
                className="stat-value text-[42px] font-black leading-none tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {stat.value}
              </div>
              <div
                className="stat-unit text-[10px] uppercase tracking-[.1em]"
                style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
              >
                {stat.unit}
              </div>
              <div
                className="stat-sub text-[11px] leading-[1.5] mt-1"
                style={{ color: "var(--muted)" }}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
