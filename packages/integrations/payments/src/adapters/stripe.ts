import type { PaymentProviderAdapter, CheckoutParams, CheckoutSession, PaymentEvent, PaymentStatus } from "../types";

export function createStripeAdapter(config: { publishableKey: string; secretKey: string; webhookSecret: string }): PaymentProviderAdapter {
  return {
    name: "stripe",
    displayName: "Stripe",
    supportedMethods: ["card", "subscription"],
    supportedCurrencies: ["USD", "SGD", "MYR", "PHP", "THB", "IDR"],

    async createCheckout(params: CheckoutParams): Promise<CheckoutSession> {
      // In production: use stripe.checkout.sessions.create()
      throw new Error("Stripe SDK not configured. Install 'stripe' package and provide API keys.");
    },

    async handleWebhook(payload: unknown, headers: Record<string, string>): Promise<PaymentEvent> {
      throw new Error("Stripe webhook handler not configured.");
    },

    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
      throw new Error("Stripe status check not configured.");
    },

    async createBillingPortal(customerId: string, returnUrl: string): Promise<string> {
      throw new Error("Stripe billing portal not configured.");
    },
  };
}
