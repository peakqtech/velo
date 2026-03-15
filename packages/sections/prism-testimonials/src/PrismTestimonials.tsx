"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { PrismTestimonialsProps } from "./prism-testimonials.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function PrismTestimonials({ content }: PrismTestimonialsProps) {
  const { heading, testimonials } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="prism-testimonials-section py-section px-6 bg-white" aria-label="Testimonials">
      <div className="max-w-content mx-auto">
        <motion.h2 className="prism-testimonials-heading text-4xl md:text-6xl font-display font-bold text-foreground text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          {heading}
        </motion.h2>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeInUp}
              className="p-8 rounded-2xl bg-background border border-foreground/5">
              <div className="text-primary text-4xl mb-4">&ldquo;</div>
              <p className="text-foreground leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-3 mt-6">
                <Image src={t.avatar} alt={t.avatarAlt} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">{t.author}</p>
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
