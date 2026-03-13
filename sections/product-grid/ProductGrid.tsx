"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import type { ProductGridProps } from "./product-grid.types";

function formatPrice(amount: number, currency: string): string {
  // Auto-detect locale from currency for proper formatting
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

  // First category is always "show all" regardless of locale
  const filteredProducts =
    activeCategoryIndex === 0
      ? products
      : products.filter((p) => p.category === categories[activeCategoryIndex]);

  return (
    <section
      className="product-grid-section relative py-section bg-secondary"
      aria-label="Product Collection"
    >
      <div className="max-w-content mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground text-center mb-12">
          {heading}
        </h2>

        {/* Filter tabs */}
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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategoryIndex === i
                  ? "bg-primary text-white"
                  : "bg-foreground/10 text-muted hover:text-foreground"
              }`}
            >
              {cat}
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
              {filteredProducts.map((product) => (
                <motion.article
                  key={product.name}
                  className="product-card group relative bg-background rounded-2xl overflow-hidden"
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      {product.badge}
                    </span>
                  )}

                  {/* Image */}
                  <div className="relative aspect-square bg-secondary/50">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-muted">
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
