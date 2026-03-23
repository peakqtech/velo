// apps/peakq/components/ethereal-background.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

const ORBS = [
  {
    size: 600,
    color: "rgba(37,99,235,0.16)",
    style: { top: "-8%", left: "-4%" },
    duration: 22,
    delay: 0,
    drift: { x: [0, 40, 20, -30, 0], y: [0, -30, 50, 20, 0] },
  },
  {
    size: 500,
    color: "rgba(99,102,241,0.12)",
    style: { top: "28%", right: "-8%" },
    duration: 28,
    delay: -8,
    drift: { x: [0, -35, -15, 25, 0], y: [0, 25, -40, -10, 0] },
  },
  {
    size: 400,
    color: "rgba(59,130,246,0.09)",
    style: { bottom: "8%", left: "18%" },
    duration: 18,
    delay: -14,
    drift: { x: [0, 30, -20, 10, 0], y: [0, -20, 30, -15, 0] },
  },
  {
    size: 300,
    color: "rgba(139,92,246,0.07)",
    style: { top: "55%", left: "58%" },
    duration: 24,
    delay: -5,
    drift: { x: [0, -20, 15, -10, 0], y: [0, 15, -25, 10, 0] },
  },
] as const;

export function EtherealBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            ...orb.style,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [...orb.drift.x],
                  y: [...orb.drift.y],
                }
          }
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Edge vignette to keep content readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, transparent 40%, #050507 100%), radial-gradient(ellipse 60% 40% at 50% 100%, transparent 40%, #050507 100%)",
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
