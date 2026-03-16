"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { HavenAgentProps } from "./haven-agent.types";
import {
  fadeInUp,
  slideInFromLeft,
  slideInFromRight,
  staggerContainer,
} from "@velo/animations";

export function HavenAgent({ content }: HavenAgentProps) {
  const {
    heading,
    name,
    title,
    bio,
    image,
    alt,
    phone,
    email,
    cta,
    credentials,
  } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="haven-agent-section py-section px-6 md:px-12 bg-background"
      aria-label="Agent"
    >
      <div className="max-w-content mx-auto">
        <motion.h2
          className="haven-agent-heading text-4xl md:text-6xl font-display font-bold text-foreground text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {heading}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          <motion.div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInFromLeft}
          >
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInFromRight}
          >
            <h3 className="text-3xl font-display font-bold text-foreground">
              {name}
            </h3>
            <p className="text-primary font-medium mt-1">{title}</p>
            <p className="mt-6 text-foreground/60 leading-relaxed">{bio}</p>

            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {credentials.map((c, i) => (
                <motion.span
                  key={i}
                  variants={fadeInUp}
                  className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-foreground/60"
                >
                  {c}
                </motion.span>
              ))}
            </motion.div>

            <div className="mt-8 space-y-2 text-sm text-foreground/50">
              <p>{phone}</p>
              <p>{email}</p>
            </div>

            <a
              href={cta.href}
              className="mt-6 inline-block px-8 py-3 bg-primary text-background font-display font-bold rounded-lg hover:bg-primary-light transition-all duration-300"
            >
              {cta.label}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
