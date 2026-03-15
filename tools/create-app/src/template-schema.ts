import { z } from "zod";

const sectionSchema = z.object({
  component: z.string(),
  configExport: z.string(),
  contentKey: z.string(),
  extraProps: z.record(z.unknown()).optional(),
});

export const templateManifestSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  businessType: z.string(),
  style: z.string(),
  contentType: z.string(),
  sections: z.record(z.string(), sectionSchema).refine(
    (sections) => Object.keys(sections).length > 0,
    { message: "Template must have at least one section" }
  ),
});

export type TemplateManifest = z.infer<typeof templateManifestSchema>;
