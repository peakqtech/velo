// apps/peakq/components/sections/compounding-stack.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
// @ts-ignore
import gsap from "gsap";
// @ts-ignore
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/lib/gsap-setup";

const STEPS = [
  {
    num: "01",
    title: "Tell Us Your Business",
    body: "Answer 5 questions about your industry, audience, and goals. Takes under 3 minutes.",
  },
  {
    num: "02",
    title: "We Build Everything",
    body: "Your website, blog setup, ad campaigns, email sequences, and review system — configured and launched.",
  },
  {
    num: "03",
    title: "AI Runs It Daily",
    body: "Our Business AI OS monitors performance, publishes content, optimises ads, and sends follow-ups — automatically.",
  },
  {
    num: "ROI",
    title: "4.3× Average Return",
    body: "Clients see measurable results within 90 days. We track every dollar in, every lead out.",
    isMetric: true,
  },
];

interface CompoundingStackProps {
  id?: string;
}

export function CompoundingStack({ id }: CompoundingStackProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const steps = gsap.utils.toArray<HTMLElement>(".stack-step");

      // Initially hide all steps
      gsap.set(steps, { opacity: 0, x: 60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 1.5 },
            delay: 0.2,
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            const bar = containerRef.current?.querySelector(".stack-progress-fill") as HTMLElement;
            if (bar) bar.style.width = `${self.progress * 100}%`;
          },
        },
      });

      steps.forEach((step, i) => {
        const label = `step${i}`;
        tl.addLabel(label);

        // Dim previous step
        if (i > 0) {
          tl.to(steps[i - 1], { opacity: 0.3, duration: 0.3 }, label);
        }

        // Reveal current step
        tl.to(step, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, label);
      });

      tl.addLabel("end");
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".stack-step", { clearProps: "all" });
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="px-8 pt-14 pb-10" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-6">
            <span
              className="text-[9px] uppercase tracking-[.14em]"
              style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
            >
              05 / How It Works
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
              { text: "UP AND RUNNING", outline: false },
              { text: "IN 48 HOURS.", outline: true },
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

        {/* Progress bar */}
        <div className="px-8 pt-8">
          <div className="stack-progress w-full h-0.5 bg-white/5 mb-8">
            <div className="stack-progress-fill h-full bg-[var(--accent)] transition-none" style={{ width: "0%" }} />
          </div>
        </div>

        {/* Steps — stacked for sequential reveal */}
        <div className="px-8 pb-14 flex flex-col gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="stack-step group relative px-8 py-10 flex flex-col gap-4 overflow-hidden"
              style={{
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {/* Accent bar at top */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{ background: "var(--accent)" }}
              />

              {/* Oversized step number */}
              <div
                className="step-number text-[52px] font-black leading-none tracking-tight"
                style={
                  step.isMetric
                    ? { color: "var(--accent)" }
                    : { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.2)" }
                }
              >
                {step.num}
              </div>

              <div>
                <div
                  className="text-[11px] uppercase tracking-[.08em] font-semibold mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {step.title}
                </div>
                <p className="text-[12px] leading-[1.7]" style={{ color: "var(--muted)" }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
