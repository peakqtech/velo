import type { PaymentProviderAdapter, CheckoutParams, CheckoutSession, PaymentEvent, PaymentStatus } from "../types";

export function createDurianpayAdapter(config: { accessKey: string; secretKey: string }): PaymentProviderAdapter {
  return {
    name: "durianpay",
    displayName: "Durianpay",
    supportedMethods: ["card", "ewallet", "va", "qris", "bank_transfer"],
    supportedCurrencies: ["IDR"],

    async createCheckout(params: CheckoutParams): Promise<CheckoutSession> {
      throw new Error("Durianpay SDK not configured. Provide API keys.");
    },

    async handleWebhook(payload: unknown, headers: Record<string, string>): Promise<PaymentEvent> {
      throw new Error("Durianpay webhook handler not configured.");
    },

    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
      throw new Error("Durianpay status check not configured.");
    },
  };
}
