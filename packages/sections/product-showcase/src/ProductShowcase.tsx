"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProductShowcaseProps } from "./product-showcase.types";
import { fadeInUp, staggerContainer, fadeInBlur } from "@velo/animations";

export function ProductShowcase({ content }: ProductShowcaseProps) {
  const { title, subtitle, products } = content;
  const shouldReduceMotion = useReducedMotion();
  const product = products[0];

  if (!product) return null;

  return (
    <section
      className="product-showcase-section relative min-h-screen w-full bg-secondary flex items-center justify-center"
      aria-label="Product Showcase"
    >
      {/* Radial glow background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          }}
        />
      </div>

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

        {/* Product image with 3D perspective */}
        <div className="showcase-product relative mx-auto max-w-2xl" style={{ perspective: "1000px" }}>
          <motion.div
            className="relative aspect-square"
            initial={shouldReduceMotion ? {} : { rotateX: 5, rotateY: -5, scale: 0.9, opacity: 0 }}
            whileInView={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Glow ring behind product */}
            <div
              className="absolute inset-[10%] rounded-full opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
            />
            <Image
              src={product.image}
              alt={product.alt}
              fill
              className="object-contain relative z-10 drop-shadow-2xl"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </motion.div>
        </div>

        {/* Feature callouts with connecting dots */}
        <div className="showcase-features relative mx-auto max-w-2xl mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            {product.features.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-callout flex items-center gap-2 px-5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-full backdrop-blur-sm hover:bg-foreground/10 hover:border-primary/30 transition-all duration-300 cursor-default"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-primary glow-primary-sm" />
                <span className="text-sm text-foreground font-medium">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
