import type { BaseMetadata, BaseCTA, BaseFooterContent } from "./base";

export interface HavenHeroContent {
  headline: string;
  tagline: string;
  cta: BaseCTA;
  media: { type: "video" | "image"; src: string; poster?: string; alt: string };
  stats: Array<{ value: string; label: string }>;
}

export interface HavenPropertyContent {
  heading: string;
  subtitle: string;
  properties: Array<{
    name: string;
    location: string;
    price: string;
    image: string;
    alt: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    featured?: boolean;
  }>;
}

export interface HavenAmenitiesContent {
  heading: string;
  subtitle: string;
  amenities: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface HavenVirtualTourContent {
  heading: string;
  subtitle: string;
  cta: BaseCTA;
  media: { type: "video" | "image"; src: string; poster?: string; alt: string };
}

export interface HavenNeighborhoodContent {
  heading: string;
  subtitle: string;
  highlights: Array<{
    title: string;
    description: string;
    distance: string;
    icon: string;
  }>;
}

export interface HavenAgentContent {
  heading: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  alt: string;
  phone: string;
  email: string;
  cta: BaseCTA;
  credentials: string[];
}

export interface HavenFooterContent extends BaseFooterContent {}

export interface HavenContent {
  hero: HavenHeroContent;
  properties: HavenPropertyContent;
  amenities: HavenAmenitiesContent;
  virtualTour: HavenVirtualTourContent;
  neighborhood: HavenNeighborhoodContent;
  agent: HavenAgentContent;
  footer: HavenFooterContent;
  metadata: BaseMetadata;
}
