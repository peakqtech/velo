import type { BaseMetadata, BaseCTA, BaseFooterContent, BaseTestimonialContent } from "./base";

export interface EmberHeroContent {
  headline: string;
  tagline: string;
  cta: BaseCTA;
  media: { type: "video" | "image"; src: string; poster?: string; alt: string };
  overlay: { opacity: number; gradient?: string };
}

export interface EmberMenuContent {
  heading: string;
  subtitle: string;
  categories: string[];
  items: Array<{
    name: string;
    description: string;
    price: string;
    image: string;
    alt: string;
    category: string;
    badge?: string;
  }>;
}

export interface EmberChefContent {
  heading: string;
  name: string;
  bio: string;
  philosophy: string;
  image: string;
  alt: string;
  achievements: string[];
}

export interface EmberReservationContent {
  heading: string;
  subtitle: string;
  cta: BaseCTA;
  hours: Array<{ days: string; time: string }>;
  phone: string;
  address: string;
}

export interface EmberGalleryContent {
  heading: string;
  images: Array<{ src: string; alt: string; span?: "wide" | "tall" | "normal" }>;
}

export interface EmberTestimonialsContent extends BaseTestimonialContent {}

export interface EmberFooterContent extends BaseFooterContent {}

export interface EmberContent {
  hero: EmberHeroContent;
  menu: EmberMenuContent;
  chef: EmberChefContent;
  reservation: EmberReservationContent;
  gallery: EmberGalleryContent;
  testimonials: EmberTestimonialsContent;
  footer: EmberFooterContent;
  metadata: BaseMetadata;
}
