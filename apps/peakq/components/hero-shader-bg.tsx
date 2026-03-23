// apps/peakq/components/hero-shader-bg.tsx
"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";

/**
 * Cinematic mesh gradient shader — hero section background only.
 * Uses the PeakQ dark-blue color palette.
 * Falls back to a static dark bg when reduced motion is preferred.
 */
export function HeroShaderBg() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #050507 0%, #0f172a 50%, #1e3a8a 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0" style={{ background: "#050507" }} aria-hidden="true">
      {/* Primary mesh gradient — deep blue palette */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#050507", "#0f172a", "#1e3a8a", "#3b82f6", "#050507"]}
        speed={0.25}
      />
      {/* Overlay to darken and keep text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,7,0.2) 0%, rgba(5,5,7,0.1) 40%, rgba(5,5,7,0.5) 100%)",
        }}
      />
    </div>
  );
}
