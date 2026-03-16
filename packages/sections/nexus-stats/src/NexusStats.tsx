"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { NexusStatsProps } from "./nexus-stats.types";
import { Counter } from "@velo/motion-components";
import { fadeInUp, staggerContainer } from "@velo/animations";

export function NexusStats({ content }: NexusStatsProps) {
  const { heading, stats } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="nexus-stats-section py-section px-6 md:px-12 bg-secondary" aria-label="Stats">
      <div className="max-w-content mx-auto">
        <motion.h2
          className="nexus-stats-heading text-3xl md:text-5xl font-display font-black tracking-tighter text-foreground uppercase text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {heading}
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <div className="text-5xl md:text-7xl font-display font-black text-primary">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-3 text-sm text-muted uppercase tracking-widest font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
