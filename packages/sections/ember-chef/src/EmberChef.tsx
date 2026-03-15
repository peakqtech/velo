"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { EmberChefProps } from "./ember-chef.types";
import { fadeInUp, slideInFromLeft, slideInFromRight, staggerContainer } from "@velo/animations";

export function EmberChef({ content }: EmberChefProps) {
  const { heading, name, bio, philosophy, image, alt, achievements } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="ember-chef-section py-section px-6 bg-secondary" aria-label="Chef">
      <div className="max-w-content mx-auto">
        <motion.div className="ember-chef-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div className="relative aspect-[3/4] overflow-hidden"
            initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={slideInFromLeft}>
            <Image src={image} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </motion.div>

          <motion.div initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={slideInFromRight}>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">{name}</h3>
            <p className="mt-6 text-muted leading-relaxed">{bio}</p>
            <blockquote className="mt-8 pl-6 border-l-2 border-primary">
              <p className="text-foreground italic font-display text-lg">&ldquo;{philosophy}&rdquo;</p>
            </blockquote>
            <motion.ul className="mt-8 space-y-3"
              initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {achievements.map((a, i) => (
                <motion.li key={i} variants={fadeInUp} className="flex items-center gap-3 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {a}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
