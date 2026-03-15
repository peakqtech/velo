"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import type { ProductGridProps } from "./product-grid.types";

function formatPrice(amount: number, currency: string): string {
  const localeMap: Record<string, string> = { USD: "en-US", IDR: "id-ID" };
  const locale = localeMap[currency] ?? "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function ProductGrid({ content }: ProductGridProps) {
  const { heading, categories, products } = content;
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const filteredProducts =
    activeCategoryIndex === 0
      ? products
      : products.filter((p) => p.category === categories[activeCategoryIndex]);

  return (
    <section
      className="product-grid-section relative py-section bg-secondary overflow-hidden"
      id="products"
      aria-label="Product Collection"
    >
      <div className="max-w-content mx-auto px-6">
        {/* Section divider */}
        <div className="section-divider mb-16" />

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground text-center mb-12">
          {heading}
        </h2>

        {/* Filter tabs with animated indicator */}
        <div
          className="flex justify-center gap-2 mb-12 flex-wrap"
          role="tablist"
          aria-label="Filter products by category"
        >
          {categories.map((cat, i) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategoryIndex === i}
              onClick={() => setActiveCategoryIndex(i)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategoryIndex === i
                  ? "text-white"
                  : "bg-foreground/5 text-muted hover:text-foreground hover:bg-foreground/10"
              }`}
            >
              {activeCategoryIndex === i && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Product grid */}
        <LayoutGroup>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            layout={!shouldReduceMotion}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.name}
                  className="product-card group relative bg-background rounded-2xl overflow-hidden card-hover-lift"
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Badge with pulse */}
                  {product.badge && (
                    <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full badge-pulse">
                      {product.badge}
                    </span>
                  )}

                  {/* Image */}
                  <div className="relative aspect-square bg-secondary/50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-foreground text-lg">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-display text-primary font-bold">
                      {formatPrice(product.price.amount, product.price.currency)}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
