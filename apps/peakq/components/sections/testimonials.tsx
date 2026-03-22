// apps/peakq/components/sections/testimonials.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// @ts-ignore
import { SplitText } from "gsap/SplitText";
// @ts-ignore
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/lib/gsap-setup";

const TESTIMONIALS = [
  {
    quote:
      "We went from zero web presence to a live site, active Google Ads, and 47 new leads in our first 30 days. Our agency couldn't have done this for three times the price.",
    author: "Marcus T.",
    role: "Owner",
    business: "Urban HVAC Services",
    metric: "+47 leads / Month 1",
  },
  {
    quote:
      "The email sequences alone paid for the whole year. We recovered $12,400 in abandoned bookings we would have just lost. The system runs without us touching it.",
    author: "Priya S.",
    role: "Director",
    business: "Serenity Wellness Clinic",
    metric: "$12,400 recovered",
  },
  {
    quote:
      "I was spending $3,200/month on a marketing agency and getting a PDF report. PeakQ replaced it completely — better results, a tenth of the cost.",
    author: "James L.",
    role: "Founder",
    business: "Coastline Real Estate",
    metric: "Agency replaced",
  },
  {
    quote:
      "Our Google rating went from 3.8 to 4.6 stars in 60 days. The review system just works — customers get the request at exactly the right moment.",
    author: "Rosa M.",
    role: "GM",
    business: "Terra Rossa Restaurant",
    metric: "3.8 → 4.6 ★ in 60 days",
  },
];

interface TestimonialsProps {
  id?: string;
}

export function Testimonials({ id }: TestimonialsProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".testimonial-card", { opacity: 0, y: 80 });

      ScrollTrigger.batch(".testimonial-card", {
        start: "top 85%",
        interval: 0.1,
        onEnter: (batch: Element[]) => {
          gsap.to(batch, {
            opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power2.out", overwrite: true,
            onComplete: () => {
              batch.forEach((card: Element) => {
                const quoteEl = card.querySelector(".testimonial-quote");
                if (quoteEl) {
                  quoteEl.setAttribute("aria-label", quoteEl.textContent || "");
                  const split = new SplitText(quoteEl, { type: "words" });
                  gsap.from(split.words, { opacity: 0, y: 15, stagger: 0.02, duration: 0.4, ease: "power2.out" });
                }
              });
            },
          });
        },
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".testimonial-card", { clearProps: "all" });
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
              06 / Results
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
              { text: "REAL NUMBERS.", outline: false },
              { text: "REAL CLIENTS.", outline: true },
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

        {/* 2×2 testimonial grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ borderLeft: "1px solid var(--border)" }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="testimonial-card px-8 py-10 flex flex-col gap-6"
              style={{
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {/* Metric highlight */}
              <div
                className="testimonial-metric text-[9px] uppercase tracking-[.12em] px-2 py-1 self-start"
                style={{
                  color: "var(--accent)",
                  border: "1px solid var(--accent-dim)",
                  background: "var(--accent-dim)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {t.metric}
              </div>

              {/* Quote */}
              <blockquote
                className="testimonial-quote text-[13px] leading-[1.75]"
                style={{ color: "var(--muted)", fontStyle: "italic" }}
              >
                "{t.quote}"
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className="w-6 h-6 flex-shrink-0"
                  style={{ background: "var(--accent-dim)", border: "1px solid var(--border-mid)" }}
                />
                <div>
                  <div className="text-[10px] font-semibold" style={{ color: "var(--text)" }}>
                    {t.author} — {t.role}
                  </div>
                  <div
                    className="text-[9px] uppercase tracking-[.08em]"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {t.business}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
