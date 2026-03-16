import { z } from "zod";
import type { VeloIntegration } from "@velo/integration-registry";

export const formsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  notificationEmail: z.string().email().optional(),
  submitSuccessMessage: z.string().default("Thank you! We'll be in touch."),
  honeypotField: z.string().default("_hp"),
  recaptchaSiteKey: z.string().optional(),
});

export type FormsConfig = z.infer<typeof formsConfigSchema>;

export const formsIntegration: VeloIntegration = {
  name: "@velo/integration-forms",
  displayName: "Forms & Lead Capture",
  description: "Contact forms, lead capture, and newsletter signup with email notifications",
  category: "forms",
  configSchema: formsConfigSchema,
  defaultConfig: {
    enabled: true,
    submitSuccessMessage: "Thank you! We'll be in touch.",
    honeypotField: "_hp",
  },
};
