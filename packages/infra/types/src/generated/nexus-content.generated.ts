// Auto-generated from template.json — DO NOT EDIT manually.
// Run `pnpm codegen` to regenerate.

import type { BaseFooterContent, BaseMetadata } from "../base";
import type { NexusCaseStudiesContent, NexusContactContent, NexusHeroContent, NexusServicesContent, NexusStatsContent, NexusTeamContent } from "../nexus-content";

export interface NexusContent {
  hero: NexusHeroContent;
  services: NexusServicesContent;
  caseStudies: NexusCaseStudiesContent;
  team: NexusTeamContent;
  stats: NexusStatsContent;
  contact: NexusContactContent;
  footer: BaseFooterContent;
  metadata: BaseMetadata;
}
