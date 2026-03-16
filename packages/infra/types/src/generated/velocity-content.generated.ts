// Auto-generated from template.json — DO NOT EDIT manually.
// Run `pnpm codegen` to regenerate.

import type { BaseFooterContent, BaseMetadata, BaseTestimonialContent } from "../base";
import type { BrandStoryContent, HeroContent, ProductGridContent, ProductShowcaseContent } from "../content";

export interface VelocityContent {
  hero: HeroContent;
  productShowcase: ProductShowcaseContent;
  brandStory: BrandStoryContent;
  productGrid: ProductGridContent;
  testimonials: BaseTestimonialContent;
  footer: BaseFooterContent;
  metadata: BaseMetadata;
}
