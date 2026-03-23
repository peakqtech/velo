"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/demo-products";

const SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 25000;

type PaymentMethod = "cod" | "bank_transfer" | "ewallet";

interface OrderConfirmation {
  orderNumber: string;
  total: number;
}

export default function CheckoutPage() {
  const { items, total, clearCart, itemCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            variant: i.variant,
            quantity: i.quantity,
          })),
          paymentMethod,
          subtotal: total,
          shipping,
          total: grandTotal,
        }),
      });

      const data = await res.json();
      clearCart();
      setConfirmation({
        orderNumber: data.orderNumber,
        total: grandTotal,
      });
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Confirmation screen
  if (confirmation) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-[var(--color-success)] text-5xl mb-4">&#10003;</div>
        <h1 className="text-2xl font-semibold">Order Confirmed!</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Thank you for your purchase.
        </p>
        <div className="mt-6 bg-[var(--color-surface)] rounded-lg p-6 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--color-text-muted)]">Order Number</span>
            <span className="font-mono font-medium">
              {confirmation.orderNumber}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">Total</span>
            <span className="font-medium">
              {formatPrice(confirmation.total)}
            </span>
          </div>
        </div>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm text-[var(--color-text-muted)] hover:underline"
        >
          &larr; Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+62"
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={form.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  required
                  value={form.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "ewallet", label: "E-Wallet" },
                  { value: "cod", label: "Cash on Delivery" },
                ] as const
              ).map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`p-4 text-sm font-medium rounded-lg border-2 transition-colors ${
                    paymentMethod === method.value
                      ? "border-[var(--color-primary)] bg-zinc-50"
                      : "border-[var(--color-border)] hover:border-zinc-300"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface)] rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">
              Order Summary ({itemCount})
            </h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variant}`}
                  className="flex justify-between text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate">{item.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.variant} x{item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 ml-4 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
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
              <div className="border-t border-[var(--color-border)] pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
