"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { EmberHeroProps } from "./ember-hero.types";
import { AnimatedText } from "@velo/motion-components";
import { springConfig } from "@velo/animations";

export function EmberHero({ content }: EmberHeroProps) {
  const { headline, tagline, cta, media, overlay } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="ember-hero-section relative h-screen w-full overflow-hidden flex items-center justify-center" aria-label="Hero">
      <div className="ember-hero-bg absolute inset-0 z-0">
        <Image src={media.src} alt={media.alt} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: overlay.gradient ?? `rgba(0,0,0,${overlay.opacity})` }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          className="ember-hero-ornament mb-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="w-16 h-[1px] bg-primary mx-auto" />
        </motion.div>

        <div className="ember-hero-headline">
          <AnimatedText
            text={headline}
            as="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-wide text-foreground"
            mode="word"
            staggerDelay={0.08}
          />
        </div>

        <motion.p
          className="ember-hero-tagline mt-6 text-lg md:text-xl text-foreground/70 font-body italic max-w-2xl mx-auto"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {tagline}
        </motion.p>

        <motion.div
          className="ember-hero-cta mt-10"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, ...springConfig }}
        >
          <a href={cta.href}
            className="inline-block px-10 py-4 bg-primary text-white font-display text-lg tracking-wider hover:bg-primary-light transition-all duration-300">
            {cta.label}
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}>
        <span className="text-xs text-foreground/40 uppercase tracking-widest font-display">Discover</span>
        <motion.div className="w-[1px] h-8 bg-foreground/20 origin-top"
          animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
    </section>
  );
}
