"use client";

import { useRef, useId, useEffect } from "react";
import { motion, useReducedMotion, animate, useMotionValue } from "framer-motion";
import type { NexusHeroProps } from "./nexus-hero.types";
import { AnimatedText, Marquee } from "@velo/motion-components";
import { springConfig } from "@velo/animations";

// ---------------------------------------------------------------------------
// Ethereal Shadow Background (inlined from 21st.dev)
// ---------------------------------------------------------------------------

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
  if (fromLow === fromHigh) return toLow;
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}

function EtherealShadow({
  color = "rgba(255, 87, 34, 0.8)",
  scale = 100,
  speed = 90,
  noiseOpacity = 0.03,
}: {
  color?: string;
  scale?: number;
  speed?: number;
  noiseOpacity?: number;
}) {
  const rawId = useId();
  const filterId = `ethereal-${rawId.replace(/:/g, "")}`;
  const feRef = useRef<SVGFEColorMatrixElement>(null);
  const hueValue = useMotionValue(0);

  const displacementScale = mapRange(scale, 1, 100, 20, 100);
  const duration = mapRange(speed, 1, 100, 1000, 50) / 25;

  useEffect(() => {
    const ctrl = animate(hueValue, 360, {
      duration,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
      onUpdate: (v: number) => {
        feRef.current?.setAttribute("values", String(v));
      },
    });
    return () => ctrl.stop();
  }, [duration, hueValue]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div style={{ position: "absolute", inset: -displacementScale, filter: `url(#${filterId}) blur(4px)` }}>
        <svg style={{ position: "absolute" }}>
          <defs>
            <filter id={filterId}>
              <feTurbulence result="undulation" numOctaves={2}
                baseFrequency={`${mapRange(scale, 0, 100, 0.001, 0.0005)},${mapRange(scale, 0, 100, 0.004, 0.002)}`}
                seed="0" type="turbulence" />
              <feColorMatrix ref={feRef} in="undulation" type="hueRotate" values="180" />
              <feColorMatrix in="dist" result="circulation" type="matrix"
                values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0" />
              <feDisplacementMap in="SourceGraphic" in2="circulation" scale={displacementScale} result="dist" />
              <feDisplacementMap in="dist" in2="undulation" scale={displacementScale} result="output" />
            </filter>
          </defs>
        </svg>
        <div style={{
          backgroundColor: color,
          maskImage: "url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')",
          maskSize: "cover",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          width: "100%",
          height: "100%",
        }} />
      </div>
      {/* Film grain */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png')",
        backgroundSize: 240,
        backgroundRepeat: "repeat",
        opacity: noiseOpacity,
      }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nexus Hero
// ---------------------------------------------------------------------------

export function NexusHero({ content }: NexusHeroProps) {
  const { headline, subheadline, marqueeText, cta } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="nexus-hero-section relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-background" aria-label="Hero">
      {/* Ethereal shadow background */}
      {!shouldReduceMotion && (
        <EtherealShadow color="rgba(255, 87, 34, 0.6)" scale={80} speed={70} noiseOpacity={0.04} />
      )}

      <div className="relative z-10 px-6 md:px-12 max-w-content mx-auto w-full py-32">
        <div className="nexus-hero-headline">
          <AnimatedText
            text={headline}
            as="h1"
            className="text-7xl md:text-[10rem] lg:text-[12rem] font-display font-black tracking-tighter text-foreground leading-[0.85] uppercase"
            mode="char"
            staggerDelay={0.02}
          />
        </div>

        <motion.p
          className="nexus-hero-subheadline mt-8 text-lg md:text-2xl text-muted max-w-2xl"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          className="nexus-hero-cta mt-12"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, ...springConfig }}
        >
          <a
            href={cta.href}
            className="inline-block px-10 py-5 bg-primary text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-primary-light transition-all duration-300 glow-primary hover:scale-105"
          >
            {cta.label}
          </a>
        </motion.div>
      </div>

      <div className="nexus-hero-marquee absolute bottom-0 left-0 right-0 py-6 border-t border-foreground/10 z-10">
        <Marquee speed={40} className="text-6xl md:text-8xl font-display font-black text-foreground/5 uppercase tracking-tighter">
          <span className="mx-8">{marqueeText}</span>
          <span className="mx-8 text-primary/10">●</span>
          <span className="mx-8">{marqueeText}</span>
          <span className="mx-8 text-primary/10">●</span>
        </Marquee>
      </div>
    </section>
  );
}
