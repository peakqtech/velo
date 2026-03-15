"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { HavenNeighborhoodProps } from "./haven-neighborhood.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function HavenNeighborhood({ content }: HavenNeighborhoodProps) {
  const { heading, subtitle, highlights } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="haven-neighborhood-section py-section px-6 md:px-12 bg-secondary"
      aria-label="Neighborhood"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="haven-neighborhood-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-foreground/50">{subtitle}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="text-2xl flex-shrink-0">{h.icon}</div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-bold text-foreground">
                    {h.title}
                  </h3>
                  <span className="text-xs text-primary font-medium">
                    {h.distance}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/50">
                  {h.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
