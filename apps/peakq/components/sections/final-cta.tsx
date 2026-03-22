// apps/peakq/components/sections/final-cta.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
// @ts-ignore
import { SplitText } from "gsap/SplitText";
// @ts-ignore
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/lib/gsap-setup";

const DELIVERABLE_PILLS = ["Websites", "Blogs", "Ads", "Email", "Reviews", "Analytics"];

const HEADLINE_LINES = [
  { text: "YOUR WEBSITE.", outline: false, accent: false },
  { text: "YOUR ADS.",     outline: true,  accent: false },
  { text: "YOUR REVIEWS.", outline: false, accent: false },
  { text: "ALL HANDLED.",  outline: false, accent: true  },
];

interface FinalCtaProps {
  id?: string;
}

export function FinalCta({ id }: FinalCtaProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.fonts.ready.then(() => {
        const headingEl = containerRef.current!.querySelector(".cta-headline");
        if (headingEl) {
          headingEl.setAttribute("aria-label", headingEl.textContent || "");
          const split = new SplitText(headingEl, { type: "chars" });
          gsap.from(split.chars, {
            y: 60, opacity: 0, stagger: 0.02, duration: 0.8, ease: "expo.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 70%", once: true },
          });

          // Resize handler
          ScrollTrigger.addEventListener("refreshInit", () => {
            split.revert();
            const newSplit = new SplitText(headingEl, { type: "chars" });
            gsap.set(newSplit.chars, { clearProps: "all" });
          });
        }
      });

      gsap.from(".cta-pill", {
        rotation: 5, y: 40, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 70%", once: true },
      });

      gsap.to(".cta-button", {
        scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.3)",
        duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".cta-headline, .cta-pill", { clearProps: "all" });
    });
  }, { scope: containerRef });

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,5,7,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Radial blue glow — parallax via ScrollSmoother */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        data-speed="0.8"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
      <div className="px-8 py-20 max-w-[860px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-8">
          <span
            className="text-[9px] uppercase tracking-[.14em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}
          >
            10 / Get Started
          </span>
        </div>

        {/* Headline */}
        <h2
          className="cta-headline"
          style={{
            fontSize: "clamp(40px, 5.5vw, 68px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: 0.94,
            marginBottom: "2rem",
          }}
        >
          {HEADLINE_LINES.map((line, i) => (
            <div key={i} style={{ overflow: "hidden", display: "block", marginBottom: 4 }}>
              <span
                style={{
                  display: "block",
                  ...(line.outline
                    ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" }
                    : line.accent
                    ? { color: "var(--accent)" }
                    : { color: "var(--text)" }),
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </h2>

        {/* Subtext */}
        <p
          className="text-[13px] leading-[1.7] mb-8 max-w-[480px]"
          style={{ color: "var(--muted)" }}
        >
          One system. Every channel. No agency markup, no freelancer coordination, no monthly "strategy calls."
          Just results.
        </p>

        {/* Deliverable pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {DELIVERABLE_PILLS.map((pill) => (
            <span
              key={pill}
              className="cta-pill text-[9px] uppercase tracking-[.1em] px-3 py-1.5"
              style={{
                border: "1px solid var(--border-mid)",
                color: "var(--muted)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {pill}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/get-started"
            className="cta-button inline-flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[.08em] font-semibold transition-all hover:brightness-110"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Get Started — It&apos;s Free →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[.08em] transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            Talk to Us First
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
