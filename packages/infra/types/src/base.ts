// Shared base types used across templates

export interface BaseMetadata {
  title: string;
  description: string;
  ogImage: string;
}

export interface BaseCTA {
  label: string;
  href: string;
}

export interface BaseFooterContent {
  brand: { name: string; logo: string };
  newsletter: { heading: string; placeholder: string; cta: string };
  socials: Array<{ platform: string; url: string; icon: string }>;
  links: Array<{ group: string; items: Array<{ label: string; href: string }> }>;
  legal: string;
}

export interface BaseTestimonialContent {
  heading: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    avatar: string;
    avatarAlt: string;
  }>;
}
