import Link from "next/link";
import { demoProducts, formatPrice } from "@/lib/demo-products";

const featured = demoProducts.slice(0, 4);

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest text-[var(--color-text-muted)] uppercase">
              New Collection
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Modern Essentials
              <br />
              for Everyday
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-muted)] max-w-lg">
              Thoughtfully designed clothing that balances quality, comfort, and
              timeless style. Made to last, priced to be fair.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-200/50 to-transparent pointer-events-none" />
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              {/* Image placeholder */}
              <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 group-hover:from-zinc-200 group-hover:to-zinc-300 transition-colors overflow-hidden flex items-end p-4">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium">{product.name}</h3>
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
            </Link>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-[var(--color-border)] bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-sm font-semibold">Free Shipping</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                On orders over Rp 500.000
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Easy Returns</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                30-day return policy
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Secure Checkout</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                100% secure payment
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
