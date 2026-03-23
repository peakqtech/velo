import { z } from "zod";
import type { VeloIntegration } from "@velo/integration-registry";

export const analyticsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  provider: z.enum(["plausible", "ga4"]).default("plausible"),
  // Plausible
  plausibleDomain: z.string().optional(),
  plausibleApiHost: z.string().default("https://plausible.io"),
  // GA4
  ga4MeasurementId: z.string().optional(),
  // Shared
  enabledEvents: z.array(z.string()).default(["pageview"]),
}).refine(
  (data) => {
    if (data.provider === "plausible" && !data.plausibleDomain) return false;
    if (data.provider === "ga4" && !data.ga4MeasurementId) return false;
    return true;
  },
  { message: "Provider-specific config is required" }
);

export type AnalyticsConfig = z.infer<typeof analyticsConfigSchema>;

export const analyticsIntegration: VeloIntegration = {
  name: "@velo/integration-analytics",
  displayName: "Analytics",
  description: "Website analytics with Plausible (privacy-friendly) or Google Analytics 4",
  category: "analytics",
  configSchema: analyticsConfigSchema,
  defaultConfig: {
    enabled: true,
    provider: "plausible",
    enabledEvents: ["pageview"],
  },
};
