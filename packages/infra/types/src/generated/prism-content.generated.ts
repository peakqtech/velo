// Auto-generated from template.json — DO NOT EDIT manually.
// Run `pnpm codegen` to regenerate.

import type { BaseFooterContent, BaseMetadata, BaseTestimonialContent } from "../base";
import type { PrismFAQContent, PrismFeaturesContent, PrismHeroContent, PrismIntegrationsContent, PrismPricingContent } from "../prism-content";

export interface PrismContent {
  hero: PrismHeroContent;
  features: PrismFeaturesContent;
  pricing: PrismPricingContent;
  integrations: PrismIntegrationsContent;
  testimonials: BaseTestimonialContent;
  faq: PrismFAQContent;
  footer: BaseFooterContent;
  metadata: BaseMetadata;
}
