import type { BaseMetadata, BaseCTA, BaseFooterContent, BaseTestimonialContent } from "./base";

export interface NexusHeroContent {
  headline: string;
  subheadline: string;
  marqueeText: string;
  cta: BaseCTA;
}

export interface NexusServicesContent {
  heading: string;
  subtitle: string;
  services: Array<{
    title: string;
    description: string;
    icon: string;
    stats?: string;
  }>;
}

export interface NexusCaseStudiesContent {
  heading: string;
  studies: Array<{
    title: string;
    client: string;
    category: string;
    image: string;
    alt: string;
    result: string;
    href: string;
  }>;
}

export interface NexusTeamContent {
  heading: string;
  subtitle: string;
  members: Array<{
    name: string;
    role: string;
    image: string;
    alt: string;
    bio: string;
    socials?: Array<{ platform: string; url: string }>;
  }>;
}

export interface NexusStatsContent {
  heading: string;
  stats: Array<{
    value: number;
    suffix?: string;
    label: string;
  }>;
}

export interface NexusContactContent {
  heading: string;
  subtitle: string;
  cta: BaseCTA;
  email: string;
  features: Array<{ text: string }>;
}

export interface NexusFooterContent extends BaseFooterContent {}

export interface NexusContent {
  hero: NexusHeroContent;
  services: NexusServicesContent;
  caseStudies: NexusCaseStudiesContent;
  team: NexusTeamContent;
  stats: NexusStatsContent;
  contact: NexusContactContent;
  footer: NexusFooterContent;
  metadata: BaseMetadata;
}
