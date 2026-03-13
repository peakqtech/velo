"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { BrandStoryProps } from "./brand-story.types";
import { fadeInUp } from "@/lib/animations";

export function BrandStory({ content }: BrandStoryProps) {
  const { chapters } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="brand-story-section relative min-h-screen w-full overflow-hidden bg-background"
      aria-label="Brand Story"
    >
      {/* Desktop: horizontal scroll container */}
      <div
        className="story-chapters hidden md:flex h-screen items-center"
        style={{ width: `${chapters.length * 100}vw` }}
      >
        {chapters.map((chapter, i) => (
          <div
            key={i}
            className="story-chapter flex-shrink-0 w-screen h-screen flex items-center px-12 lg:px-24"
          >
            <div
              className={`flex items-center gap-12 lg:gap-24 w-full max-w-content mx-auto ${
                chapter.layout === "right" ? "flex-row-reverse" : ""
              } ${chapter.layout === "full" ? "flex-col text-center" : ""}`}
            >
              {/* Media */}
              <div
                className={`chapter-media relative ${
                  chapter.layout === "full"
                    ? "w-full h-[50vh]"
                    : "w-1/2 h-[60vh]"
                } rounded-2xl overflow-hidden`}
              >
                <Image
                  src={chapter.media.src}
                  alt={chapter.media.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Text */}
              <div
                className={`chapter-text ${
                  chapter.layout === "full" ? "max-w-2xl mx-auto" : "w-1/2"
                }`}
              >
                <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                  {chapter.heading}
                </h3>
                <p className="mt-4 text-lg text-muted leading-relaxed">
                  {chapter.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: vertical layout */}
      <div className="md:hidden py-section px-6 space-y-24">
        {chapters.map((chapter, i) => (
          <motion.div
            key={i}
            className="story-chapter"
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <div className="relative w-full h-[40vh] rounded-2xl overflow-hidden mb-6">
              <Image
                src={chapter.media.src}
                alt={chapter.media.alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground">
              {chapter.heading}
            </h3>
            <p className="mt-3 text-base text-muted leading-relaxed">
              {chapter.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
