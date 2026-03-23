import { z } from "zod";
import type { VeloIntegration } from "@velo/integration-registry";

export const paymentsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  provider: z.enum(["stripe", "xendit", "durianpay", "midtrans"]),
  currency: z.enum(["USD", "IDR", "SGD", "MYR", "PHP", "THB"]).default("USD"),
  // Provider-specific keys (stored encrypted in SiteIntegration.config)
  stripe: z.object({
    publishableKey: z.string(),
    secretKey: z.string(),
    webhookSecret: z.string(),
  }).optional(),
  xendit: z.object({
    publicKey: z.string(),
    secretKey: z.string(),
    webhookToken: z.string(),
  }).optional(),
  durianpay: z.object({
    accessKey: z.string(),
    secretKey: z.string(),
  }).optional(),
  midtrans: z.object({
    clientKey: z.string(),
    serverKey: z.string(),
    isProduction: z.boolean().default(false),
  }).optional(),
}).refine(
  (data) => {
    // Ensure the selected provider has its config
    return data[data.provider] !== undefined;
  },
  { message: "Configuration for the selected payment provider is required" }
);

export type PaymentsConfig = z.infer<typeof paymentsConfigSchema>;

export const paymentsIntegration: VeloIntegration = {
  name: "@velo/integration-payments",
  displayName: "Payments",
  description: "Accept payments via Stripe (global), Xendit (SE Asia), Durianpay, or Midtrans (Indonesia)",
  category: "payments",
  configSchema: paymentsConfigSchema,
  defaultConfig: {
    enabled: true,
    provider: "stripe",
    currency: "USD",
  },
};
