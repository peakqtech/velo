"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { EmberTestimonialsProps } from "./ember-testimonials.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function EmberTestimonials({ content }: EmberTestimonialsProps) {
  const { heading, testimonials } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="ember-testimonials-section py-section px-6 bg-background" aria-label="Testimonials">
      <div className="max-w-content mx-auto">
        <motion.div className="ember-testimonials-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center p-8">
              <div className="text-5xl text-primary/30 font-serif mb-4">&ldquo;</div>
              <p className="text-foreground italic leading-relaxed">{t.quote}</p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <Image src={t.avatar} alt={t.avatarAlt} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-display font-bold text-foreground text-sm">{t.author}</p>
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
