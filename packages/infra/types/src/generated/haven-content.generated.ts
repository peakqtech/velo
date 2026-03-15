// Auto-generated from template.json — DO NOT EDIT manually.
// Run `pnpm codegen` to regenerate.

import type { BaseFooterContent, BaseMetadata } from "../base";
import type { HavenAgentContent, HavenAmenitiesContent, HavenHeroContent, HavenNeighborhoodContent, HavenPropertiesContent, HavenVirtualTourContent } from "../haven-content";

export interface HavenContent {
  hero: HavenHeroContent;
  properties: HavenPropertiesContent;
  amenities: HavenAmenitiesContent;
  virtualTour: HavenVirtualTourContent;
  neighborhood: HavenNeighborhoodContent;
  agent: HavenAgentContent;
  footer: BaseFooterContent;
  metadata: BaseMetadata;
}
