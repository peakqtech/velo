// Auto-generated from template.json — DO NOT EDIT manually.
// Run `pnpm codegen` to regenerate.

import type { BaseFooterContent, BaseMetadata, BaseTestimonialContent } from "../base";
import type { SerenityBookingContent, SerenityHeroContent, SerenityPractitionersContent, SerenityProcessContent, SerenityServicesContent } from "../serenity-content";

export interface SerenityContent {
  hero: SerenityHeroContent;
  services: SerenityServicesContent;
  process: SerenityProcessContent;
  practitioners: SerenityPractitionersContent;
  testimonials: BaseTestimonialContent;
  booking: SerenityBookingContent;
  footer: BaseFooterContent;
  metadata: BaseMetadata;
}
