"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { HavenVirtualTourProps } from "./haven-virtual-tour.types";
import { fadeInUp, fadeInBlur } from "@velo/animations";

export function HavenVirtualTour({ content }: HavenVirtualTourProps) {
  const { heading, subtitle, cta, media } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="haven-virtual-tour-section py-section px-6 md:px-12 bg-background"
      aria-label="Virtual Tour"
    >
      <div className="max-w-content mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="relative aspect-[21/9]">
            <Image
              src={media.poster || media.src}
              alt={media.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.h2
              className="haven-virtual-tour-heading text-4xl md:text-6xl font-display font-bold text-foreground"
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInBlur}
            >
              {heading}
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-foreground/60 max-w-xl"
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {subtitle}
            </motion.p>
            <motion.a
              href={cta.href}
              className="mt-8 inline-flex items-center gap-3 px-10 py-4 bg-primary text-background font-display font-bold rounded-lg hover:bg-primary-light transition-all duration-300"
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {cta.label}
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
