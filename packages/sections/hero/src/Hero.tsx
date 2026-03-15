"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { HeroProps } from "./hero.types";
import { AnimatedText } from "@velocity/motion-components";
import { springConfig } from "@velocity/animations";

export function Hero({ content }: HeroProps) {
  const { headline, tagline, cta, media, overlay } = content;
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const showVideo = media.type === "video" && !videoFailed && !isMobile;
  const showPoster = !showVideo && media.poster;

  return (
    <section
      className="hero-section relative h-screen w-full overflow-hidden flex items-center justify-center"
      aria-label="Hero"
    >
      {/* Background media */}
      <div className="hero-bg absolute inset-0 z-0">
        {showVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={media.poster}
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover"
          >
            <source src={media.src} type="video/mp4" />
          </video>
        )}

        {(showPoster || (!showVideo && media.type === "image")) && (
          <Image
            src={showPoster ? media.poster! : media.src}
            alt={media.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: overlay.gradient ?? `rgba(0,0,0,${overlay.opacity})`,
          }}
        />
        {/* Extra bottom fade for section transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-content">
        <div className="hero-headline">
          <AnimatedText
            text={headline}
            as="h1"
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-foreground"
            mode="char"
            staggerDelay={0.02}
          />
        </div>

        <motion.p
          className="hero-tagline mt-6 text-lg md:text-2xl text-foreground/80 max-w-2xl mx-auto"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {tagline}
        </motion.p>

        <motion.div
          className="hero-cta mt-10"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, ...springConfig }}
        >
          <a
            href={cta.href}
            className="inline-block px-8 py-4 bg-primary text-white font-display font-bold text-lg rounded-full hover:bg-primary-light transition-all duration-300 glow-primary hover:scale-105"
          >
            {cta.label}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-xs text-foreground/50 uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-[1px] h-8 bg-foreground/30 origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
