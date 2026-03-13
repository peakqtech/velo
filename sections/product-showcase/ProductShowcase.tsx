"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProductShowcaseProps } from "./product-showcase.types";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function ProductShowcase({ content }: ProductShowcaseProps) {
  const { title, subtitle, products } = content;
  const shouldReduceMotion = useReducedMotion();
  const product = products[0]; // Primary product

  if (!product) return null;

  return (
    <section
      className="product-showcase-section relative min-h-screen w-full bg-secondary flex items-center justify-center overflow-hidden"
      aria-label="Product Showcase"
    >
      <div className="relative z-10 w-full max-w-content mx-auto px-6 py-section">
        {/* Title */}
        <motion.div
          className="showcase-title text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-display font-bold text-foreground"
            variants={fadeInUp}
          >
            {title}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg md:text-xl text-muted"
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Product image with parallax layers */}
        <div className="showcase-product relative mx-auto max-w-2xl aspect-square">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>

        {/* Feature callouts */}
        <div className="showcase-features relative mx-auto max-w-2xl mt-12">
          <div className="flex flex-wrap justify-center gap-8">
            {product.features.map((feature, i) => (
              <div
                key={i}
                className="feature-callout flex items-center gap-2 px-4 py-2 bg-foreground/10 rounded-full backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground font-medium">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
