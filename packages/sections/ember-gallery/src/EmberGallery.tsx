"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { EmberGalleryProps } from "./ember-gallery.types";
import { fadeInUp, staggerContainer, clipRevealUp } from "@velocity/animations";

export function EmberGallery({ content }: EmberGalleryProps) {
  const { heading, images } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="ember-gallery-section py-section px-6 bg-secondary" aria-label="Gallery">
      <div className="max-w-content mx-auto">
        <motion.div className="ember-gallery-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {images.map((img, i) => (
            <motion.div key={i} variants={clipRevealUp}
              className={`relative overflow-hidden ${img.span === "wide" ? "col-span-2" : img.span === "tall" ? "row-span-2" : ""} ${img.span === "tall" ? "aspect-[2/3]" : "aspect-[4/3]"}`}>
              <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
