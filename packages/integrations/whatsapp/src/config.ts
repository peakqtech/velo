import { z } from "zod";
import type { VeloIntegration } from "@velo/integration-registry";

export const whatsappConfigSchema = z.object({
  enabled: z.boolean().default(true),
  phoneNumber: z.string().min(10, "Phone number is required"),
  defaultMessage: z.string().default("Hello! I'm interested in your services."),
  position: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
  showOnMobile: z.boolean().default(true),
  businessHours: z.object({
    enabled: z.boolean().default(false),
    timezone: z.string().default("Asia/Jakarta"),
    schedule: z.array(z.object({
      days: z.array(z.number().min(0).max(6)),
      start: z.string(),
      end: z.string(),
    })).default([]),
  }).default({}),
  offlineMessage: z.string().default("We're currently offline. Leave us a message!"),
});

export type WhatsAppConfig = z.infer<typeof whatsappConfigSchema>;

export const whatsappIntegration: VeloIntegration = {
  name: "@velo/integration-whatsapp",
  displayName: "WhatsApp Business",
  description: "Chat widget for customer communication via WhatsApp",
  category: "communication",
  configSchema: whatsappConfigSchema,
  defaultConfig: {
    enabled: true,
    defaultMessage: "Hello! I'm interested in your services.",
    position: "bottom-right",
    showOnMobile: true,
  },
};
