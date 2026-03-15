"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SerenityProcessProps } from "./serenity-process.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function SerenityProcess({ content }: SerenityProcessProps) {
  const { heading, subtitle, steps } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="serenity-process-section py-section px-6 md:px-12 bg-secondary"
      aria-label="How It Works"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="serenity-process-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mx-auto mb-4 relative z-10">
                {step.icon}
              </div>
              <div className="text-xs text-primary font-bold uppercase tracking-widest mb-2">
                Step {step.step}
              </div>
              <h3 className="font-display font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
