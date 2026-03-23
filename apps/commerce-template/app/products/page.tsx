"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { demoProducts, formatPrice } from "@/lib/demo-products";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme-context";

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem } = useCart();
  const { theme, variant } = useTheme();

  const filtered =
    activeCategory === "All"
      ? demoProducts
      : demoProducts.filter((p) => p.category === activeCategory);

  function handleQuickAdd(product: (typeof demoProducts)[number]) {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: `${product.variants[0]?.options[0] ?? "Default"}`,
    });
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.bg }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-semibold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
              textTransform: variant === "streetwear" ? "uppercase" : "none",
            }}
          >
            {variant === "streetwear" ? "All Drops" : variant === "minimal" ? "Collection" : "All Products"}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor: isActive ? theme.colors.primary : "transparent",
                  color: isActive ? "#FFFFFF" : theme.colors.textSecondary,
                  border: isActive ? "none" : `1px solid ${theme.colors.border}`,
                  borderRadius: variant === "luxury" ? "0" : variant === "streetwear" ? "0" : "2px",
                  textTransform: variant === "streetwear" ? "uppercase" : "none",
                  letterSpacing: variant === "streetwear" ? "0.05em" : "0",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/products/${product.slug}`}>
                <div
                  className="relative aspect-[3/4] overflow-hidden mb-3"
                  style={{
                    borderRadius: theme.borderRadius,
                    backgroundColor: theme.colors.surface,
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={`object-cover transition-all duration-500 ${
                      variant === "luxury"
                        ? "group-hover:scale-110"
                        : variant === "streetwear"
                          ? "group-hover:scale-105"
                          : "group-hover:scale-[1.02]"
                    }`}
                    unoptimized
                  />

                  {/* Luxury: overlay with View text */}
                  {variant === "luxury" && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                      <span
                        className="text-white text-xs font-medium tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-4 py-2"
                        style={{ border: "1px solid rgba(255,255,255,0.5)" }}
                      >
                        View
                      </span>
                    </div>
                  )}

                  {/* Streetwear: border glow */}
                  {variant === "streetwear" && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 2px ${theme.colors.primary}, 0 0 20px rgba(255,51,51,0.2)`,
                      }}
                    />
                  )}

                  {/* Minimal: subtle shadow lift handled by container */}
                  {variant === "minimal" && (
                    <div className="absolute inset-0 shadow-none group-hover:shadow-lg transition-shadow duration-500 pointer-events-none" />
                  )}

                  {/* Sale badge */}
                  {product.comparePrice && (
                    <span
                      className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5"
                      style={{
                        backgroundColor: variant === "streetwear" ? theme.colors.accent : "var(--color-error, #ef4444)",
                        color: variant === "streetwear" ? "#0A0A0A" : "#FFFFFF",
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      SALE
                    </span>
                  )}

                  {/* Streetwear: Quick add slides up */}
                  {variant === "streetwear" && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuickAdd(product);
                        }}
                        className="w-full py-3 text-xs font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: "#FFFFFF",
                        }}
                      >
                        Quick Add +
                      </button>
                    </div>
                  )}
                </div>
              </Link>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <Link href={`/products/${product.slug}`}>
                    <h3
                      className="text-sm font-medium hover:opacity-70 transition-opacity"
                      style={{
                        color: theme.colors.text,
                        textTransform: variant === "streetwear" ? "uppercase" : "none",
                      }}
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs line-through" style={{ color: theme.colors.textSecondary }}>
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
                {variant !== "streetwear" && (
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="shrink-0 mt-0.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-70"
                    style={{
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius,
                      color: theme.colors.textSecondary,
                      backgroundColor: "transparent",
                    }}
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p style={{ color: theme.colors.textSecondary }}>
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
