"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SerenityServicesProps } from "./serenity-services.types";
import { fadeInUp, staggerContainer } from "@velo/animations";

export function SerenityServices({ content }: SerenityServicesProps) {
  const { heading, subtitle, services } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="serenity-services-section py-section px-6 md:px-12 bg-background"
      aria-label="Services"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="serenity-services-header text-center mb-16"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="serenity-service-card p-8 rounded-3xl bg-white shadow-sm border border-foreground/5 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-5">
                {service.icon}
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {service.description}
              </p>
              <div className="mt-4 flex justify-between text-xs text-muted">
                <span>{service.duration}</span>
                <span className="font-semibold text-foreground">
                  {service.price}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
