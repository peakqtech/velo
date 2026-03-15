"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { BrandStoryProps } from "./brand-story.types";
import { fadeInUp, clipRevealUp } from "@velo/animations";

export function BrandStory({ content }: BrandStoryProps) {
  const { chapters } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="brand-story-section relative min-h-screen w-full bg-background"
      aria-label="Brand Story"
    >
      {/* Desktop: horizontal scroll container */}
      <div
        className="story-chapters hidden md:flex h-screen items-center"
        style={{ width: `${chapters.length * 100}vw` }}
      >
        {/* Chapter progress indicator */}
        <div className="story-progress fixed top-0 left-0 right-0 h-[2px] z-50 bg-foreground/10">
          <div
            className="story-progress-bar h-full bg-primary origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Chapter dots navigation */}
        <div className="story-dots fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {chapters.map((chapter, i) => (
            <div key={i} className="story-dot flex items-center gap-3 group">
              <span className="text-xs text-foreground/0 group-hover:text-foreground/60 transition-all duration-300 whitespace-nowrap">
                {chapter.heading}
              </span>
              <div className="w-2 h-2 rounded-full bg-foreground/30 transition-all duration-300" />
            </div>
          ))}
        </div>

        {chapters.map((chapter, i) => (
          <div
            key={i}
            className="story-chapter flex-shrink-0 w-screen h-screen flex items-center px-12 lg:px-24"
          >
            <div
              className={`relative flex items-center gap-12 lg:gap-24 w-full max-w-content mx-auto ${
                chapter.layout === "right" ? "flex-row-reverse" : ""
              } ${chapter.layout === "full" ? "flex-col justify-center text-center" : ""}`}
            >
              {/* Full layout: background image behind text */}
              {chapter.layout === "full" && (
                <div className="chapter-media absolute inset-0 rounded-2xl overflow-hidden">
                  <Image
                    src={chapter.media.src}
                    alt={chapter.media.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-background/70" />
                </div>
              )}

              {/* Side layout: media column */}
              {chapter.layout !== "full" && (
                <div
                  className="chapter-media relative w-1/2 h-[60vh] rounded-2xl overflow-hidden"
                >
                  <Image
                    src={chapter.media.src}
                    alt={chapter.media.alt}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>
              )}

              {/* Text */}
              <div
                className={`chapter-text relative z-10 ${
                  chapter.layout === "full" ? "max-w-2xl mx-auto" : "w-1/2"
                }`}
              >
                <div className="chapter-number text-primary font-display font-bold text-sm uppercase tracking-widest mb-4 opacity-60">
                  Chapter {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
                  {chapter.heading}
                </h3>
                <p className="mt-6 text-lg text-muted leading-relaxed">
                  {chapter.body}
                </p>
                {/* Accent line */}
                <div className="mt-8 w-16 h-[2px] bg-primary opacity-60" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: vertical layout with enhanced animations */}
      <div className="md:hidden py-section px-6 space-y-32">
        {chapters.map((chapter, i) => (
          <motion.div
            key={i}
            className="story-chapter"
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {/* Chapter number */}
            <motion.div
              className="text-primary font-display font-bold text-sm uppercase tracking-widest mb-4 opacity-60"
              variants={fadeInUp}
            >
              Chapter {String(i + 1).padStart(2, "0")}
            </motion.div>

            {/* Image with clip reveal */}
            <motion.div
              className="relative w-full h-[50vh] rounded-2xl overflow-hidden mb-8"
              variants={clipRevealUp}
            >
              <Image
                src={chapter.media.src}
                alt={chapter.media.alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </motion.div>

            <motion.h3
              className="text-2xl font-display font-bold text-foreground"
              variants={fadeInUp}
            >
              {chapter.heading}
            </motion.h3>
            <motion.p
              className="mt-4 text-base text-muted leading-relaxed"
              variants={fadeInUp}
            >
              {chapter.body}
            </motion.p>
            <motion.div className="mt-6 w-12 h-[2px] bg-primary opacity-60" variants={fadeInUp} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
