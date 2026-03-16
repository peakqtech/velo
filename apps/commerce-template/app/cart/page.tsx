"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/demo-products";

const SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 25000;

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-zinc-300 text-6xl mb-4">&#128722;</div>
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variant}`}
              className="flex gap-4 p-4 border border-[var(--color-border)] rounded-lg"
            >
              {/* Image placeholder */}
              <div className="w-20 h-24 rounded-md bg-gradient-to-br from-zinc-100 to-zinc-200 shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {item.variant}
                    </p>
                  </div>
                  <span className="text-sm font-medium shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="inline-flex items-center border border-[var(--color-border)] rounded-md">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variant,
                          item.quantity - 1
                        )
                      }
                      className="px-2.5 py-1 text-xs hover:bg-[var(--color-surface)] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-medium border-x border-[var(--color-border)]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variant,
                          item.quantity + 1
                        )
                      }
                      className="px-2.5 py-1 text-xs hover:bg-[var(--color-surface)] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variant)}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface)] rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[var(--color-success)]">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Free shipping on orders over {formatPrice(SHIPPING_THRESHOLD)}
                </p>
              )}
              <div className="border-t border-[var(--color-border)] pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full block text-center px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
