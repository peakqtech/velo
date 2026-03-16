"use client";

import Link from "next/link";
import { useState } from "react";
import { demoProducts, formatPrice } from "@/lib/demo-products";
import { useCart } from "@/lib/cart";

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem } = useCart();

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">All Products</h1>
        <p className="mt-2 text-[var(--color-text-muted)] text-sm">
          Browse our curated collection of modern essentials.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        {filtered.map((product) => (
          <div key={product.id} className="group">
            <Link href={`/products/${product.slug}`}>
              {/* Image placeholder */}
              <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 group-hover:from-zinc-200 group-hover:to-zinc-300 transition-colors overflow-hidden relative">
                <span className="absolute bottom-3 left-3 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                  {product.category}
                </span>
                {product.comparePrice && (
                  <span className="absolute top-3 right-3 bg-[var(--color-error)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    SALE
                  </span>
                )}
              </div>
            </Link>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm font-medium hover:underline">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xs text-[var(--color-text-muted)] line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleQuickAdd(product)}
                className="shrink-0 mt-0.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] rounded-md hover:bg-[var(--color-surface)] transition-colors"
              >
                Quick Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
