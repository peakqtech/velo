import { z } from "zod";
import type { VeloIntegration } from "@velo/integration-registry";

export const cmsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  allowMediaUpload: z.boolean().default(true),
  maxMediaSizeMb: z.number().default(10),
  allowedMediaTypes: z.array(z.string()).default(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]),
  autoSave: z.boolean().default(false),
  autoSaveIntervalMs: z.number().default(30000),
});

export type CmsConfig = z.infer<typeof cmsConfigSchema>;

export const cmsIntegration: VeloIntegration = {
  name: "@velo/integration-cms",
  displayName: "Content Management",
  description: "Visual content editor for your site — edit text, images, and sections from the dashboard",
  category: "content",
  configSchema: cmsConfigSchema,
  defaultConfig: {
    enabled: true,
    allowMediaUpload: true,
    maxMediaSizeMb: 10,
    autoSave: false,
  },
};
