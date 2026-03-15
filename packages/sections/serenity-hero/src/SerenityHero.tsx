"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import type { SerenityHeroProps } from "./serenity-hero.types";

type AnimationPhase = "scatter" | "line" | "circle";

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;
const TOTAL_IMAGES = 16;
const MAX_SCROLL = 3000;

const IMAGES = [
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&q=80",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&q=80",
  "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=300&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=300&q=80",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80",
  "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=300&q=80",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80",
  "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=300&q=80",
  "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=300&q=80",
  "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
];

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

function FlipCard({ src, index, target }: { src: string; index: number; target: { x: number; y: number; rotation: number; scale: number; opacity: number } }) {
  return (
    <motion.div
      animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{ position: "absolute", width: IMG_WIDTH, height: IMG_HEIGHT, transformStyle: "preserve-3d", perspective: "1000px" }}
      className="cursor-pointer group"
    >
      <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }} whileHover={{ rotateY: 180 }}>
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-primary/10" style={{ backfaceVisibility: "hidden" }}>
          <img src={src} alt={`wellness-${index}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/5 transition-colors group-hover:bg-transparent" />
        </div>
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-primary/20 flex flex-col items-center justify-center p-4 border border-primary/20"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-[8px] font-bold text-primary uppercase tracking-widest mb-1">Discover</p>
          <p className="text-xs font-medium text-foreground">Wellness</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SerenityHero({ content }: SerenityHeroProps) {
  const { headline, tagline, cta, badges } = content;
  const shouldReduceMotion = useReducedMotion();
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(containerRef.current);
    setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shouldReduceMotion) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollRef.current = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      virtualScroll.set(scrollRef.current);
    };
    let tsy = 0;
    const handleTS = (e: TouchEvent) => { tsy = e.touches[0].clientY; };
    const handleTM = (e: TouchEvent) => {
      const dy = tsy - e.touches[0].clientY; tsy = e.touches[0].clientY;
      scrollRef.current = Math.min(Math.max(scrollRef.current + dy, 0), MAX_SCROLL);
      virtualScroll.set(scrollRef.current);
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTS, { passive: false });
    container.addEventListener("touchmove", handleTM, { passive: false });
    return () => { container.removeEventListener("wheel", handleWheel); container.removeEventListener("touchstart", handleTS); container.removeEventListener("touchmove", handleTM); };
  }, [virtualScroll, shouldReduceMotion]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const h = (e: MouseEvent) => { const r = c.getBoundingClientRect(); mouseX.set(((e.clientX - r.left) / r.width * 2 - 1) * 100); };
    c.addEventListener("mousemove", h); return () => c.removeEventListener("mousemove", h);
  }, [mouseX]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const scatterPositions = useMemo(() =>
    IMAGES.map(() => ({ x: (Math.random() - 0.5) * 1500, y: (Math.random() - 0.5) * 1000, rotation: (Math.random() - 0.5) * 180, scale: 0.6, opacity: 0 })), []);

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  if (shouldReduceMotion) {
    return (
      <section className="serenity-hero-section relative min-h-screen w-full flex items-center bg-background overflow-hidden" aria-label="Hero">
        <div className="relative z-10 px-6 md:px-12 max-w-content mx-auto w-full py-32 text-center">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {badges.map((badge, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span>{badge.icon}</span> {badge.label}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">{headline}</h1>
          <p className="mt-6 text-lg text-muted max-w-lg mx-auto">{tagline}</p>
          <a href={cta.href} className="mt-10 inline-block px-8 py-4 bg-primary text-white font-display font-semibold rounded-2xl">{cta.label}</a>
        </div>
      </section>
    );
  }

  return (
    <div ref={containerRef} className="serenity-hero-section relative w-full h-screen bg-background overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center" style={{ perspective: "1000px" }}>
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-4xl font-display font-bold tracking-tight text-foreground"
          >{headline}</motion.h1>
          <motion.p initial={{ opacity: 0 }}
            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-xs font-bold tracking-[0.2em] text-muted uppercase">Scroll to explore</motion.p>
        </div>

        <motion.div style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {badges.map((b, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium pointer-events-auto">
                <span>{b.icon}</span> {b.label}
              </span>
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-4">{headline}</h2>
          <p className="text-sm md:text-base text-muted max-w-lg leading-relaxed">{tagline}</p>
          <a href={cta.href} className="mt-8 inline-block px-8 py-4 bg-primary text-white font-display font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-light transition-all pointer-events-auto">{cta.label}</a>
        </motion.div>

        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };
            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const sp = 70, tw = TOTAL_IMAGES * sp;
              target = { x: i * sp - tw / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMob = containerSize.width < 768;
              const minD = Math.min(containerSize.width, containerSize.height);
              const cR = Math.min(minD * 0.35, 350);
              const cA = (i / TOTAL_IMAGES) * 360, cRad = (cA * Math.PI) / 180;
              const cPos = { x: Math.cos(cRad) * cR, y: Math.sin(cRad) * cR, rotation: cA + 90 };

              const bR = Math.min(containerSize.width, containerSize.height * 1.5);
              const aR = bR * (isMob ? 1.4 : 1.1);
              const aAY = containerSize.height * (isMob ? 0.35 : 0.25), aCY = aAY + aR;
              const spread = isMob ? 100 : 130, startA = -90 - spread / 2, step = spread / (TOTAL_IMAGES - 1);
              const sP = Math.min(Math.max(rotateValue / 360, 0), 1);
              const bounded = -sP * spread * 0.8;
              const curA = startA + i * step + bounded, aRad = (curA * Math.PI) / 180;
              const aPos = { x: Math.cos(aRad) * aR + parallaxValue, y: Math.sin(aRad) * aR + aCY, rotation: curA + 90, scale: isMob ? 1.4 : 1.8 };

              target = { x: lerp(cPos.x, aPos.x, morphValue), y: lerp(cPos.y, aPos.y, morphValue), rotation: lerp(cPos.rotation, aPos.rotation, morphValue), scale: lerp(1, aPos.scale, morphValue), opacity: 1 };
            }
            return <FlipCard key={i} src={src} index={i} target={target} />;
          })}
        </div>
      </div>
    </div>
  );
}
