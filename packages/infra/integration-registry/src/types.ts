import { z } from "zod";
import type { ComponentType } from "react";

/** Payment methods supported by payment providers */
export type PaymentMethod = "card" | "ewallet" | "va" | "qris" | "bank_transfer" | "subscription";

/** Base configuration schema that all integrations must satisfy */
export const baseIntegrationConfigSchema = z.object({
  enabled: z.boolean().default(true),
});

/** The contract every integration package must export */
export interface VeloIntegration {
  /** Package name, e.g. "@velo/integration-stripe" */
  name: string;
  /** Human-readable name, e.g. "Stripe Payments" */
  displayName: string;
  /** Short description */
  description: string;
  /** Category for grouping in dashboard */
  category: IntegrationCategory;
  /** Zod schema for validating this integration's config */
  configSchema: z.ZodSchema;
  /** API route handlers keyed by path */
  routes?: Record<string, IntegrationRouteHandler>;
  /** React components this integration provides */
  components?: Record<string, ComponentType<any>>;
  /** Dashboard settings panel component */
  dashboardModule?: ComponentType<any>;
  /** Default config values */
  defaultConfig?: Record<string, unknown>;
}

export type IntegrationCategory =
  | "payments"
  | "forms"
  | "analytics"
  | "content"
  | "communication"
  | "booking"
  | "commerce"
  | "marketing";

export interface IntegrationRouteHandler {
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: (req: Request) => Promise<Response>;
}

/** Integration manifest in template.json */
export interface IntegrationManifestEntry {
  features?: string[];
  config?: Record<string, unknown>;
}
