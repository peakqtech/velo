"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { SerenityPractitionersProps } from "./serenity-practitioners.types";
import { fadeInUp, staggerContainer } from "@velo/animations";

export function SerenityPractitioners({ content }: SerenityPractitionersProps) {
  const { heading, subtitle, practitioners } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="serenity-practitioners-section py-section px-6 md:px-12 bg-background"
      aria-label="Practitioners"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="serenity-practitioners-header text-center mb-16"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {practitioners.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="rounded-3xl bg-white shadow-sm border border-foreground/5 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display font-semibold text-foreground">
                  {p.name}
                </h3>
                <p className="text-sm text-primary font-medium">
                  {p.specialty}
                </p>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {p.bio}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.credentials.map((c, j) => (
                    <span
                      key={j}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
