"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "@/lib/gsap-setup";

const CLIENTS = [
  "APEX DENTAL", "NOVA REALTY", "KLEO FITNESS", "BLOOM HOSPITALITY",
  "SUMMIT LEGAL", "CREST CLINICS", "PEAK EVENTS", "HARBOR STAYS",
];

export function LogoMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Duplicate for seamless loop
  const items = [...CLIENTS, ...CLIENTS];

  useGSAP(() => {
    const track = trackRef.current!;
    const width = track.scrollWidth / 2;
    const speed = 50; // px per second

    tweenRef.current = gsap.to(track, {
      x: -width,
      duration: width / speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(gsap.utils.wrap(-width, 0)),
      },
    });
  }, { scope: containerRef });

  const handleMouseEnter = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5 });
  };
  const handleMouseLeave = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden py-6"
      style={{
        borderTop: "1px solid rgba(59,130,246,0.12)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
        background: "rgba(5,5,7,0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p
        className="text-center mb-4 text-[10px] uppercase tracking-[0.15em]"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.25)" }}
      >
        Trusted by businesses across 12+ industries
      </p>
      <div className="flex overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-16 whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {items.map((name, i) => (
            <span
              key={`${i}-${name}`}
              className="text-sm tracking-[0.1em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.16)", textTransform: "uppercase" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
