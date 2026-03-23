"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { demoProducts, formatPrice } from "@/lib/demo-products";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme-context";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = demoProducts.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { theme, variant } = useTheme();

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-20 text-center"
        style={{ backgroundColor: theme.colors.bg }}
      >
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
        >
          Product not found
        </h1>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm hover:opacity-70"
          style={{ color: theme.colors.textSecondary }}
        >
          &larr; Back to products
        </Link>
      </div>
    );
  }

  const relatedProducts = demoProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Fill remaining slots with other products if needed
  const additionalNeeded = 4 - relatedProducts.length;
  if (additionalNeeded > 0) {
    const others = demoProducts
      .filter((p) => p.id !== product.id && !relatedProducts.find((r) => r.id === p.id))
      .slice(0, additionalNeeded);
    relatedProducts.push(...others);
  }

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
    const variantStr = getVariantString();
    const text = encodeURIComponent(
      `Hi! I'm interested in ${product!.name} (${variantStr}) - ${formatPrice(product!.price)}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div style={{ backgroundColor: theme.colors.bg }} className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" style={{ color: theme.colors.textSecondary }}>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:opacity-70 transition-opacity">
            {variant === "streetwear" ? "Drops" : "Products"}
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: theme.colors.text }}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image */}
          <div
            className="relative aspect-[3/4] overflow-hidden"
            style={{
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />

            {product.comparePrice && (
              <span
                className="absolute top-4 right-4 text-xs font-bold px-3 py-1"
                style={{
                  backgroundColor: variant === "streetwear" ? theme.colors.accent : theme.colors.primary,
                  color: variant === "streetwear" ? "#0A0A0A" : "#FFFFFF",
                  borderRadius: theme.borderRadius,
                }}
              >
                {Math.round(
                  ((product.comparePrice - product.price) / product.comparePrice) * 100
                )}% OFF
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <span
              className="text-xs tracking-[0.2em] uppercase font-medium mb-2"
              style={{
                color: variant === "streetwear" ? theme.colors.accent : theme.colors.textSecondary,
              }}
            >
              {product.category}
            </span>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight"
              style={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.text,
                textTransform: variant === "streetwear" ? "uppercase" : "none",
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span
                className="text-xl font-semibold"
                style={{ color: theme.colors.text }}
              >
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span
                  className="text-base line-through"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Divider */}
            <div
              className="my-6"
              style={{ borderBottom: `1px solid ${theme.colors.border}` }}
            />

            <p
              className="text-sm leading-relaxed"
              style={{ color: theme.colors.textSecondary }}
            >
              {product.description}
            </p>

            {/* Variants */}
            <div className="mt-8 space-y-6">
              {product.variants.map((v) => (
                <div key={v.name}>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{
                      color: theme.colors.text,
                      textTransform: variant === "streetwear" ? "uppercase" : "none",
                      letterSpacing: variant === "streetwear" ? "0.05em" : "0",
                    }}
                  >
                    {v.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => {
                      const isSelected =
                        (selectedVariants[v.name] || v.options[0]) === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [v.name]: opt,
                            }))
                          }
                          className="px-4 py-2.5 text-sm transition-all duration-200"
                          style={{
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : "transparent",
                            color: isSelected ? "#FFFFFF" : theme.colors.text,
                            border: isSelected
                              ? `1px solid ${theme.colors.primary}`
                              : `1px solid ${theme.colors.border}`,
                            borderRadius: theme.borderRadius,
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <label
                className="block text-sm font-medium mb-3"
                style={{
                  color: theme.colors.text,
                  textTransform: variant === "streetwear" ? "uppercase" : "none",
                }}
              >
                Quantity
              </label>
              <div
                className="inline-flex items-center"
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius,
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: theme.colors.text }}
                >
                  -
                </button>
                <span
                  className="px-4 py-2.5 text-sm font-medium"
                  style={{
                    color: theme.colors.text,
                    borderLeft: `1px solid ${theme.colors.border}`,
                    borderRight: `1px solid ${theme.colors.border}`,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: theme.colors.text }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock */}
            <p className="mt-3 text-xs" style={{ color: theme.colors.textSecondary }}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 px-6 py-3.5 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "#FFFFFF",
                  borderRadius: theme.borderRadius,
                  textTransform: variant === "streetwear" ? "uppercase" : "none",
                  letterSpacing: variant === "streetwear" ? "0.1em" : "0",
                }}
              >
                {added
                  ? variant === "streetwear"
                    ? "ADDED!"
                    : "Added!"
                  : variant === "streetwear"
                    ? "ADD TO CART"
                    : "Add to Cart"}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 px-6 py-3.5 text-sm font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "transparent",
                  color: "#22c55e",
                  border: "1px solid #22c55e",
                  borderRadius: theme.borderRadius,
                  textTransform: variant === "streetwear" ? "uppercase" : "none",
                }}
              >
                {variant === "streetwear" ? "ORDER VIA WHATSAPP" : "Buy via WhatsApp"}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div
              className="mb-8 pb-4"
              style={{ borderBottom: `1px solid ${theme.colors.border}` }}
            >
              <h2
                className="text-xl sm:text-2xl font-semibold tracking-tight"
                style={{
                  fontFamily: theme.fonts.heading,
                  color: theme.colors.text,
                  textTransform: variant === "streetwear" ? "uppercase" : "none",
                }}
              >
                {variant === "streetwear"
                  ? "You Might Also Cop"
                  : variant === "minimal"
                    ? "Related"
                    : "You May Also Like"}
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.slug}`}
                  className="group block"
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden mb-3"
                    style={{
                      borderRadius: theme.borderRadius,
                      backgroundColor: theme.colors.surface,
                    }}
                  >
                    <Image
                      src={rp.image}
                      alt={rp.name}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        variant === "luxury"
                          ? "group-hover:scale-110"
                          : variant === "streetwear"
                            ? "group-hover:scale-105"
                            : "group-hover:scale-[1.02]"
                      }`}
                      unoptimized
                    />
                  </div>
                  <h3
                    className="text-sm font-medium"
                    style={{
                      color: theme.colors.text,
                      textTransform: variant === "streetwear" ? "uppercase" : "none",
                    }}
                  >
                    {rp.name}
                  </h3>
                  <span className="text-sm mt-1 block" style={{ color: theme.colors.textSecondary }}>
                    {formatPrice(rp.price)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
