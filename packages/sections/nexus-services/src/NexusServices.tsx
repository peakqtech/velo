"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { NexusServicesProps } from "./nexus-services.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function NexusServices({ content }: NexusServicesProps) {
  const { heading, subtitle, services } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="nexus-services-section py-section px-6 md:px-12 bg-background" aria-label="Services">
      <div className="max-w-content mx-auto">
        <motion.div
          className="nexus-services-header mb-20"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-foreground uppercase">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl">{subtitle}</p>
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
              className="nexus-service-card group p-8 border border-foreground/10 hover:border-primary/30 transition-all duration-500 bg-foreground/[0.02]"
            >
              <div className="text-4xl mb-6">{service.icon}</div>
              <h3 className="text-xl font-display font-bold text-foreground uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="mt-3 text-muted text-sm leading-relaxed">{service.description}</p>
              {service.stats && (
                <div className="mt-6 pt-4 border-t border-foreground/10">
                  <span className="text-primary font-display font-bold text-sm uppercase tracking-wider">{service.stats}</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
