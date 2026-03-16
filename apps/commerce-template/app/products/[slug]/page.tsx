"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { demoProducts, formatPrice } from "@/lib/demo-products";
import { useCart } from "@/lib/cart";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = demoProducts.find((p) => p.slug === slug);
  const { addItem } = useCart();

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm text-[var(--color-text-muted)] hover:underline"
        >
          &larr; Back to products
        </Link>
      </div>
    );
  }

  // Initialize default selections
  const getVariantString = () => {
    return product.variants
      .map((v) => selectedVariants[v.name] || v.options[0])
      .join(" / ");
  };

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product!.id,
        name: product!.name,
        price: product!.price,
        image: product!.image,
        variant: getVariantString(),
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWhatsApp() {
    const variant = getVariantString();
    const text = encodeURIComponent(
      `Hi! I'm interested in ${product!.name} (${variant}) - ${formatPrice(product!.price)}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-[var(--color-text)]">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text)]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-zinc-100 via-zinc-150 to-zinc-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-zinc-300 text-6xl mb-3">&#9634;</div>
            <span className="text-sm text-zinc-400 uppercase tracking-wider font-medium">
              {product.category}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-1">
            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">
              {product.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-base text-[var(--color-text-muted)] line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {product.comparePrice && (
              <span className="text-xs font-bold text-[var(--color-error)] bg-red-50 px-2 py-0.5 rounded-full">
                {Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          <p className="mt-6 text-[var(--color-text-muted)] leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          <div className="mt-8 space-y-6">
            {product.variants.map((variant) => (
              <div key={variant.name}>
                <label className="block text-sm font-medium mb-2">
                  {variant.name}
                </label>
                {variant.name === "Color" ? (
                  <div className="flex gap-2">
                    {variant.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.name]: opt,
                          }))
                        }
                        className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                          (selectedVariants[variant.name] || variant.options[0]) === opt
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <select
                    value={selectedVariants[variant.name] || variant.options[0]}
                    onChange={(e) =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [variant.name]: e.target.value,
                      }))
                    }
                    className="block w-full max-w-xs px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    {variant.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="inline-flex items-center border border-[var(--color-border)] rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-sm hover:bg-[var(--color-surface)] transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-medium border-x border-[var(--color-border)]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-sm hover:bg-[var(--color-surface)] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 px-6 py-3 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 transition-colors"
            >
              Buy via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
