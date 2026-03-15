"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { HavenAmenitiesProps } from "./haven-amenities.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function HavenAmenities({ content }: HavenAmenitiesProps) {
  const { heading, subtitle, amenities } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="haven-amenities-section py-section px-6 md:px-12 bg-secondary"
      aria-label="Amenities"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="haven-amenities-header text-center mb-16"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {amenities.map((amenity, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all duration-500"
            >
              <div className="text-3xl mb-4">{amenity.icon}</div>
              <h3 className="text-lg font-display font-bold text-foreground">
                {amenity.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/50 leading-relaxed">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
