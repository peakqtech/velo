"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { SerenityTestimonialsProps } from "./serenity-testimonials.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function SerenityTestimonials({ content }: SerenityTestimonialsProps) {
  const { heading, testimonials } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="serenity-testimonials-section py-section px-6 md:px-12 bg-secondary"
      aria-label="Testimonials"
    >
      <div className="max-w-content mx-auto">
        <motion.h2
          className="serenity-testimonials-heading text-3xl md:text-5xl font-display font-bold text-foreground text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {heading}
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-8 rounded-3xl bg-white shadow-sm border border-foreground/5"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className="w-4 h-4 text-accent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-3 mt-6">
                <Image
                  src={t.avatar}
                  alt={t.avatarAlt}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">
                    {t.author}
                  </p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
