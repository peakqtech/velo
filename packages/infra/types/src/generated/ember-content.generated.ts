// Auto-generated from template.json — DO NOT EDIT manually.
// Run `pnpm codegen` to regenerate.

import type { BaseFooterContent, BaseMetadata, BaseTestimonialContent } from "../base";
import type { EmberChefContent, EmberGalleryContent, EmberHeroContent, EmberMenuContent, EmberReservationContent } from "../ember-content";

export interface EmberContent {
  hero: EmberHeroContent;
  menu: EmberMenuContent;
  chef: EmberChefContent;
  reservation: EmberReservationContent;
  gallery: EmberGalleryContent;
  testimonials: BaseTestimonialContent;
  footer: BaseFooterContent;
  metadata: BaseMetadata;
}
