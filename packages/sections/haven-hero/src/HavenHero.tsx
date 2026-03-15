"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { HavenHeroProps } from "./haven-hero.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function HavenHero({ content }: HavenHeroProps) {
  const { headline, tagline, cta, media, stats } = content;
  const shouldReduceMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mediaExpanded, setMediaExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Freeze Lenis + native scroll while hero is expanding
  useEffect(() => {
    if (shouldReduceMotion) return;
    const html = document.documentElement;
    if (!mediaExpanded) {
      html.classList.add("lenis-stopped");
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      html.classList.remove("lenis-stopped");
      html.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      html.classList.remove("lenis-stopped");
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mediaExpanded, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setMediaExpanded(true);
      return;
    }

    // Use capture phase to intercept before Lenis
    const handleWheel = (e: WheelEvent) => {
      if (!mediaExpanded) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY * 0.0009;
        const next = Math.min(Math.max(scrollProgress + delta, 0), 1);
        setScrollProgress(next);
        if (next >= 1) setMediaExpanded(true);
      } else if (mediaExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        // Scroll up at top of page — reverse back into hero expansion
        e.preventDefault();
        e.stopPropagation();
        setMediaExpanded(false);
        setScrollProgress(0.99);
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (!mediaExpanded) {
        e.preventDefault();
        e.stopPropagation();
        const factor = deltaY < 0 ? 0.008 : 0.005;
        const next = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
        setScrollProgress(next);
        if (next >= 1) setMediaExpanded(true);
        setTouchStartY(e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => setTouchStartY(0);

    // capture: true ensures we run before Lenis
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: false, capture: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, { capture: true });
      window.removeEventListener("touchmove", handleTouchMove, { capture: true });
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaExpanded, touchStartY, shouldReduceMotion]);

  // Phase 1 (0→0.7): expand image only, text stays centered
  // Phase 2 (0.7→1): text splits apart
  const expandProgress = Math.min(scrollProgress / 0.7, 1);
  const textProgress = Math.max((scrollProgress - 0.7) / 0.3, 0);

  const mediaWidth = 300 + expandProgress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + expandProgress * (isMobile ? 200 : 400);
  const textTranslateX = textProgress * (isMobile ? 180 : 150);

  const words = headline.split(" ");
  const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const secondHalf = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <div ref={sectionRef} className="haven-hero-section transition-colors duration-700 overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh] !pt-0 !pb-0">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          {/* Background image that fades out */}
          <motion.div className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 - scrollProgress }} transition={{ duration: 0.1 }}>
            <Image src={media.poster || media.src} alt="Background" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-background/40" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              {/* Expanding media */}
              <div className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
                style={{ width: `${mediaWidth}px`, height: `${mediaHeight}px`, maxWidth: "95vw", maxHeight: "85vh", boxShadow: "0px 0px 50px rgba(0,0,0,0.3)" }}>
                <div className="relative w-full h-full">
                  <Image src={media.poster || media.src} alt={media.alt} fill className="object-cover rounded-xl" sizes="95vw" />
                  <motion.div className="absolute inset-0 bg-black/50 rounded-xl"
                    initial={{ opacity: 0.7 }} animate={{ opacity: 0.7 - scrollProgress * 0.3 }} transition={{ duration: 0.2 }} />
                </div>
                <div className="flex flex-col items-center text-center relative z-10 mt-4">
                  <p className="text-foreground/60 font-medium text-center text-sm"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}>
                    {!mediaExpanded && "Scroll to explore"}
                  </p>
                </div>
              </div>

              {/* Split headline */}
              <div className="flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col mix-blend-difference">
                <motion.h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}>
                  {firstHalf}
                </motion.h2>
                <motion.h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}>
                  {secondHalf}
                </motion.h2>
              </div>
            </div>

            {/* Content after expansion */}
            <motion.div className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }} animate={{ opacity: mediaExpanded ? 1 : 0 }} transition={{ duration: 0.7 }}>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-foreground/60 mb-8">{tagline}</p>
                <a href={cta.href} className="inline-block px-10 py-4 bg-primary text-background font-display font-bold text-lg tracking-wider rounded-lg hover:bg-primary-light transition-all duration-300">
                  {cta.label}
                </a>
                <div className="mt-12 flex flex-wrap justify-center gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="px-6 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                      <p className="text-2xl font-display font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-foreground/50 uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
