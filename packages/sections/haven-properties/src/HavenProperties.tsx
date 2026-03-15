"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { HavenPropertiesProps } from "./haven-properties.types";
import { GlassCard, Carousel } from "@velocity/motion-components";
import { fadeInUp } from "@velocity/animations";

export function HavenProperties({ content }: HavenPropertiesProps) {
  const { heading, subtitle, properties } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="haven-properties-section py-section px-6 md:px-12 bg-background"
      aria-label="Properties"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="haven-properties-header mb-16"
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

        <Carousel gap={24}>
          {properties.map((property, i) => (
            <GlassCard
              key={i}
              className="w-[350px] md:w-[400px] overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={property.image}
                  alt={property.alt}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                {property.featured && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-background text-xs font-bold rounded-full uppercase">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-foreground">
                  {property.name}
                </h3>
                <p className="text-sm text-foreground/50 mt-1">
                  {property.location}
                </p>
                <p className="text-2xl font-display font-bold text-primary mt-4">
                  {property.price}
                </p>
                <div className="flex gap-4 mt-4 text-xs text-foreground/40 uppercase tracking-wider">
                  <span>{property.bedrooms} Beds</span>
                  <span>{property.bathrooms} Baths</span>
                  <span>{property.area}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
