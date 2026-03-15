"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { NexusCaseStudiesProps } from "./nexus-case-studies.types";
import { fadeInUp, staggerContainerSlow, clipRevealUp } from "@velocity/animations";

export function NexusCaseStudies({ content }: NexusCaseStudiesProps) {
  const { heading, studies } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="nexus-case-studies-section py-section px-6 md:px-12 bg-background" aria-label="Case Studies">
      <div className="max-w-content mx-auto">
        <motion.h2
          className="nexus-case-studies-heading text-5xl md:text-8xl font-display font-black tracking-tighter text-foreground uppercase mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {heading}
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerSlow}
        >
          {studies.map((study, i) => (
            <motion.a
              key={i}
              href={study.href}
              variants={clipRevealUp}
              className="nexus-study-card group relative aspect-[4/3] overflow-hidden block"
            >
              <Image
                src={study.image}
                alt={study.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-xs text-primary font-bold uppercase tracking-widest">{study.category}</span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mt-2">{study.title}</h3>
                <p className="text-sm text-white/60 mt-1">{study.client}</p>
                <p className="text-sm text-primary font-bold mt-3">{study.result}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
