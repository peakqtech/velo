import type { BaseMetadata, BaseCTA, BaseFooterContent, BaseTestimonialContent } from "./base";

export interface SerenityHeroContent {
  headline: string;
  tagline: string;
  cta: BaseCTA;
  media: { type: "image"; src: string; alt: string };
  badges: Array<{ label: string; icon: string }>;
}

export interface SerenityServicesContent {
  heading: string;
  subtitle: string;
  services: Array<{
    title: string;
    description: string;
    icon: string;
    duration: string;
    price: string;
  }>;
}

export interface SerenityProcessContent {
  heading: string;
  subtitle: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface SerenityPractitionersContent {
  heading: string;
  subtitle: string;
  practitioners: Array<{
    name: string;
    specialty: string;
    image: string;
    alt: string;
    bio: string;
    credentials: string[];
  }>;
}

export interface SerenityTestimonialsContent extends BaseTestimonialContent {}

export interface SerenityBookingContent {
  heading: string;
  subtitle: string;
  cta: BaseCTA;
  phone: string;
  email: string;
  hours: Array<{ days: string; time: string }>;
}

export interface SerenityFooterContent extends BaseFooterContent {}

export interface SerenityContent {
  hero: SerenityHeroContent;
  services: SerenityServicesContent;
  process: SerenityProcessContent;
  practitioners: SerenityPractitionersContent;
  testimonials: SerenityTestimonialsContent;
  booking: SerenityBookingContent;
  footer: SerenityFooterContent;
  metadata: BaseMetadata;
}
