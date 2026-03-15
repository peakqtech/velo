"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { PrismFeaturesProps } from "./prism-features.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function PrismFeatures({ content }: PrismFeaturesProps) {
  const { heading, subtitle, features } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="prism-features-section py-section px-6 bg-background" aria-label="Features">
      <div className="max-w-content mx-auto">
        <motion.div className="prism-features-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {features.map((feature, i) => (
            <motion.div key={i} variants={fadeInUp}
              className="prism-feature-card p-8 rounded-2xl bg-white border border-foreground/5 shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-5">{feature.icon}</div>
              <h3 className="text-xl font-display font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
