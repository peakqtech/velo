"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { demoProducts, formatPrice } from "@/lib/demo-products";
import { useTheme } from "@/lib/theme-context";

const featured = demoProducts.slice(0, 4);

const values = [
  {
    title: "Sustainable",
    description: "Ethically sourced materials with minimal environmental footprint.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9 9 0 0 1 3 12c0-1.47.353-2.856.978-4.082" />
      </svg>
    ),
  },
  {
    title: "Handcrafted",
    description: "Every piece is made with meticulous attention to detail and quality.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    title: "Timeless",
    description: "Designs that transcend trends and remain relevant season after season.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { theme, variant } = useTheme();
  const [email, setEmail] = useState("");

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      {variant === "luxury" && <LuxuryHero theme={theme} />}
      {variant === "streetwear" && <StreetwearHero theme={theme} />}
      {variant === "minimal" && <MinimalHero theme={theme} />}

      {/* ===== FEATURED PRODUCTS ===== */}
      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        style={{ backgroundColor: theme.colors.bg }}
      >
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {variant === "streetwear" ? "DROP LIST" : variant === "minimal" ? "Curated Selection" : "Featured Collection"}
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: theme.colors.textSecondary }}
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} variant={variant} theme={theme} />
          ))}
        </div>
      </section>

      {/* ===== BRAND VALUES ===== */}
      <section
        className="border-t"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-12"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {variant === "streetwear" ? "WHY US" : "Our Values"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: theme.colors.cardBg,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: variant === "minimal" ? "2px" : variant === "streetwear" ? "0" : "0",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                  style={{
                    backgroundColor: variant === "streetwear"
                      ? "rgba(255,51,51,0.1)"
                      : variant === "minimal"
                        ? "rgba(184,134,11,0.08)"
                        : "rgba(197,165,114,0.12)",
                    color: theme.colors.accent,
                  }}
                >
                  {value.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.text,
                    textTransform: variant === "streetwear" ? "uppercase" : "none",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section
        className="border-t"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.bg,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-xl mx-auto text-center">
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4"
              style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            >
              {variant === "streetwear"
                ? "GET EARLY ACCESS"
                : variant === "minimal"
                  ? "Stay Connected"
                  : "Join the Atelier"}
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: theme.colors.textSecondary }}
            >
              {variant === "streetwear"
                ? "Be first to cop new drops and exclusive collabs."
                : "Receive curated updates on new arrivals, stories, and exclusive offers."}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-sm outline-none"
                style={{
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius,
                  color: theme.colors.text,
                }}
              />
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: variant === "streetwear" ? theme.colors.primary : theme.colors.primary,
                  color: "#FFFFFF",
                  borderRadius: theme.borderRadius,
                }}
              >
                {variant === "streetwear" ? "SIGN UP" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- HERO VARIANTS ---------- */

function LuxuryHero({ theme }: { theme: typeof import("@/lib/themes").themes.luxury }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <Image
        src={theme.hero.image}
        alt="Luxury store interior"
        fill
        className="object-cover"
        unoptimized
        priority
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${theme.hero.overlayOpacity})` }}
      />
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <p
          className="text-sm tracking-[0.3em] uppercase mb-6"
          style={{ color: theme.colors.accent }}
        >
          New Collection 2026
        </p>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-6 text-white"
          style={{ fontFamily: theme.fonts.heading }}
        >
          The Art of
          <br />
          Refined Living
        </h1>
        <p className="text-lg text-white/80 max-w-lg mx-auto mb-10">
          Timeless pieces crafted with intention. Where elegance meets everyday.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: theme.colors.accent,
            color: "#1A1A1A",
            borderRadius: theme.borderRadius,
          }}
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}

function StreetwearHero({ theme }: { theme: typeof import("@/lib/themes").themes.streetwear }) {
  return (
    <section className="relative min-h-[100vh] flex items-end overflow-hidden">
      <Image
        src={theme.hero.image}
        alt="Streetwear fashion"
        fill
        className="object-cover"
        unoptimized
        priority
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,${theme.hero.overlayOpacity}) 50%, transparent 100%)`,
        }}
      />
      <div className="relative z-10 px-6 sm:px-12 pb-20 sm:pb-28 max-w-4xl">
        <div
          className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase mb-6"
          style={{
            backgroundColor: theme.colors.primary,
            color: "#FFFFFF",
          }}
        >
          New Drop
        </div>
        <h1
          className="text-6xl sm:text-8xl lg:text-9xl font-bold leading-[0.9] mb-6 text-white uppercase"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Define
          <br />
          <span style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
            Your
          </span>
          <br />
          Style
        </h1>
        <p className="text-base sm:text-lg text-white/60 max-w-md mb-10">
          Limited edition drops. No restocks. No compromises.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:translate-x-2"
          style={{
            backgroundColor: theme.colors.primary,
            color: "#FFFFFF",
            borderRadius: theme.borderRadius,
          }}
        >
          Shop Now
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function MinimalHero({ theme }: { theme: typeof import("@/lib/themes").themes.minimal }) {
  return (
    <section
      className="min-h-[85vh] flex items-center"
      style={{ backgroundColor: theme.colors.bg }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text side */}
          <div className="order-2 lg:order-1">
            <p
              className="text-xs tracking-[0.25em] uppercase mb-6"
              style={{ color: theme.colors.textSecondary }}
            >
              Spring / Summer 2026
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.15] mb-6"
              style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            >
              Less, but
              <br />
              better.
            </h1>
            <p
              className="text-base leading-relaxed mb-10 max-w-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Essential pieces designed with purpose. Quality over quantity,
              simplicity over excess.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-medium tracking-wide border-b-2 pb-1 transition-all duration-300 hover:pb-2"
              style={{
                color: theme.colors.text,
                borderColor: theme.colors.accent,
              }}
            >
              View Collection
            </Link>
          </div>

          {/* Image side */}
          <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
            <Image
              src={theme.hero.image}
              alt="Minimal fashion"
              fill
              className="object-cover"
              style={{ borderRadius: theme.borderRadius }}
              unoptimized
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PRODUCT CARD ---------- */

function ProductCard({
  product,
  variant,
  theme,
}: {
  product: (typeof demoProducts)[number];
  variant: string;
  theme: import("@/lib/themes").ThemeConfig;
}) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
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
          className={`object-cover transition-transform duration-500 ${
            variant === "luxury"
              ? "group-hover:scale-110"
              : variant === "streetwear"
                ? "group-hover:scale-105"
                : "group-hover:scale-[1.03]"
          }`}
          unoptimized
        />

        {/* Luxury overlay */}
        {variant === "luxury" && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              View
            </span>
          </div>
        )}

        {/* Streetwear border glow */}
        {variant === "streetwear" && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 2px ${theme.colors.primary}, 0 0 20px rgba(255,51,51,0.3)`,
            }}
          />
        )}

        {/* Sale badge */}
        {product.comparePrice && (
          <span
            className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5"
            style={{
              backgroundColor: variant === "streetwear" ? theme.colors.accent : theme.colors.primary,
              color: variant === "streetwear" ? "#0A0A0A" : "#FFFFFF",
              borderRadius: theme.borderRadius,
            }}
          >
            SALE
          </span>
        )}
      </div>

      {/* Info */}
      <div>
        <p
          className="text-[10px] tracking-wider uppercase mb-1"
          style={{ color: theme.colors.textSecondary }}
        >
          {product.category}
        </p>
        <h3
          className="text-sm font-medium"
          style={{
            color: theme.colors.text,
            textTransform: variant === "streetwear" ? "uppercase" : "none",
          }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span
              className="text-xs line-through"
              style={{ color: theme.colors.textSecondary }}
            >
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
