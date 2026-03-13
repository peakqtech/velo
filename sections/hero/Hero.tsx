"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { HeroProps } from "./hero.types";
import { AnimatedText } from "@/components/motion/animated-text";
import { springConfig } from "@/lib/animations";

export function Hero({ content }: HeroProps) {
  const { headline, tagline, cta, media, overlay } = content;
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Mobile: no autoplay video — fall back to poster/image with play button
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

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: overlay.gradient ?? `rgba(0,0,0,${overlay.opacity})`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-content">
        <div className="hero-headline">
          <AnimatedText
            text={headline}
            as="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground"
          />
        </div>

        <motion.p
          className="hero-tagline mt-6 text-lg md:text-2xl text-foreground/80 max-w-2xl mx-auto"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {tagline}
        </motion.p>

        <motion.div
          className="hero-cta mt-10"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, ...springConfig }}
        >
          <a
            href={cta.href}
            className="inline-block px-8 py-4 bg-primary text-white font-display font-bold text-lg rounded-full hover:bg-primary-light transition-colors"
          >
            {cta.label}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
