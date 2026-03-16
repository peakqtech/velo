import type { PaymentProviderAdapter } from "./types";
import type { PaymentsConfig } from "./config";
import { createStripeAdapter } from "./adapters/stripe";
import { createXenditAdapter } from "./adapters/xendit";
import { createDurianpayAdapter } from "./adapters/durianpay";
import { createMidtransAdapter } from "./adapters/midtrans";

export function createPaymentAdapter(config: PaymentsConfig): PaymentProviderAdapter {
  switch (config.provider) {
    case "stripe":
      if (!config.stripe) throw new Error("Stripe configuration is required");
      return createStripeAdapter(config.stripe);
    case "xendit":
      if (!config.xendit) throw new Error("Xendit configuration is required");
      return createXenditAdapter(config.xendit);
    case "durianpay":
      if (!config.durianpay) throw new Error("Durianpay configuration is required");
      return createDurianpayAdapter(config.durianpay);
    case "midtrans":
      if (!config.midtrans) throw new Error("Midtrans configuration is required");
      return createMidtransAdapter(config.midtrans);
    default:
      throw new Error(`Unknown payment provider: ${config.provider}`);
  }
}
