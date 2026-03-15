import type { BaseMetadata, BaseCTA, BaseFooterContent, BaseTestimonialContent } from "./base";

export interface PrismHeroContent {
  headline: string;
  subtitle: string;
  searchPlaceholder: string;
  announcement?: string;
  screenshotSrc?: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  trustedBy: Array<{ name: string; logo: string }>;
}

export interface PrismFeaturesContent {
  heading: string;
  subtitle: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface PrismPricingContent {
  heading: string;
  subtitle: string;
  plans: Array<{
    name: string;
    price: { amount: number; period: string; currency: string };
    description: string;
    features: string[];
    cta: BaseCTA;
    highlighted?: boolean;
  }>;
}

export interface PrismIntegrationsContent {
  heading: string;
  integrations: Array<{
    name: string;
    logo: string;
    category: string;
  }>;
}

export interface PrismTestimonialsContent extends BaseTestimonialContent {}

export interface PrismFAQContent {
  heading: string;
  subtitle: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface PrismFooterContent extends BaseFooterContent {}

export interface PrismContent {
  hero: PrismHeroContent;
  features: PrismFeaturesContent;
  pricing: PrismPricingContent;
  integrations: PrismIntegrationsContent;
  testimonials: PrismTestimonialsContent;
  faq: PrismFAQContent;
  footer: PrismFooterContent;
  metadata: BaseMetadata;
}
