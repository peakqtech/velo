import type { PaymentProviderAdapter, CheckoutParams, CheckoutSession, PaymentEvent, PaymentStatus } from "../types";

export function createMidtransAdapter(config: { clientKey: string; serverKey: string; isProduction: boolean }): PaymentProviderAdapter {
  return {
    name: "midtrans",
    displayName: "Midtrans",
    supportedMethods: ["card", "ewallet", "va", "qris", "bank_transfer"],
    supportedCurrencies: ["IDR"],

    async createCheckout(params: CheckoutParams): Promise<CheckoutSession> {
      throw new Error("Midtrans SDK not configured. Install 'midtrans-client' package and provide API keys.");
    },

    async handleWebhook(payload: unknown, headers: Record<string, string>): Promise<PaymentEvent> {
      throw new Error("Midtrans webhook handler not configured.");
    },

    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
      throw new Error("Midtrans status check not configured.");
    },
  };
}
