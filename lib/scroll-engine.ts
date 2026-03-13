"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export interface ScrollConfig {
  trigger: string;
  pin?: boolean;
  scrub?: number | boolean;
  start?: string;
  end?: string;
  timeline: (
    tl: gsap.core.Timeline,
    el: (selector: string) => Element | null
  ) => void;
}

export function useScrollEngine(configs: ScrollConfig[]) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (err) {
      console.warn("GSAP ScrollTrigger failed to initialize:", err);
      return;
    }

    try {
      const lenis = new Lenis();
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } catch (err) {
      console.warn("Lenis failed to initialize:", err);
    }

    const isMobile = window.innerWidth < 768;
    const triggers: ScrollTrigger[] = [];

    configs.forEach((config) => {
      const triggerEl = document.querySelector(config.trigger);
      if (!triggerEl) {
        console.warn(`ScrollEngine: trigger "${config.trigger}" not found`);
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: config.trigger,
          pin: isMobile ? false : (config.pin ?? false),
          scrub: config.scrub ?? false,
          start: config.start ?? "top top",
          end: config.end ?? (isMobile ? "+=50%" : "+=100%"),
        },
      });

      const el = (selector: string): Element | null =>
        triggerEl.querySelector(selector);

      config.timeline(tl, el);

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      if (lenisRef.current) {
        const lenis = lenisRef.current;
        gsap.ticker.remove(lenis.raf as any);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, [configs]);
}
