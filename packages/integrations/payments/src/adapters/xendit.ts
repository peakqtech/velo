import type { PaymentProviderAdapter, CheckoutParams, CheckoutSession, PaymentEvent, PaymentStatus } from "../types";

export function createXenditAdapter(config: { publicKey: string; secretKey: string; webhookToken: string }): PaymentProviderAdapter {
  return {
    name: "xendit",
    displayName: "Xendit",
    supportedMethods: ["card", "ewallet", "va", "qris"],
    supportedCurrencies: ["IDR", "PHP", "SGD", "MYR", "THB"],

    async createCheckout(params: CheckoutParams): Promise<CheckoutSession> {
      throw new Error("Xendit SDK not configured. Install 'xendit-node' package and provide API keys.");
    },

    async handleWebhook(payload: unknown, headers: Record<string, string>): Promise<PaymentEvent> {
      throw new Error("Xendit webhook handler not configured.");
    },

    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
      throw new Error("Xendit status check not configured.");
    },
  };
}
