"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { NexusContactProps } from "./nexus-contact.types";
import { fadeInUp, fadeInBlur } from "@velocity/animations";

export function NexusContact({ content }: NexusContactProps) {
  const { heading, subtitle, cta, email, features } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="nexus-contact-section py-section px-6 md:px-12 bg-background" aria-label="Contact">
      <div className="max-w-content mx-auto text-center">
        <motion.h2
          className="nexus-contact-heading text-5xl md:text-[8rem] font-display font-black tracking-tighter text-foreground uppercase leading-[0.9]"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInBlur}
        >
          {heading}
        </motion.h2>

        <motion.p
          className="mt-6 text-lg text-muted max-w-xl mx-auto"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <a
            href={cta.href}
            className="inline-block px-10 py-5 bg-primary text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-primary-light transition-all duration-300 glow-primary hover:scale-105"
          >
            {cta.label}
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-block px-10 py-5 border border-foreground/20 text-foreground font-display font-bold text-lg uppercase tracking-wider hover:border-primary/50 transition-all duration-300"
          >
            {email}
          </a>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {features.map((f, i) => (
            <span key={i} className="text-sm text-muted uppercase tracking-wider">
              {f.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
