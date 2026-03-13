// Section content schemas — one interface per section

export interface HeroContent {
  headline: string;
  tagline: string;
  cta: { label: string; href: string };
  media: { type: "video" | "image"; src: string; poster?: string; alt: string };
  overlay: { opacity: number; gradient?: string };
}

export interface ProductShowcaseContent {
  title: string;
  subtitle: string;
  products: Array<{
    name: string;
    image: string;
    alt: string;
    features: Array<{ label: string; position: { x: number; y: number } }>;
  }>;
}

export interface BrandStoryContent {
  chapters: Array<{
    heading: string;
    body: string;
    media: { type: "video" | "image"; src: string; alt: string };
    layout: "left" | "right" | "full";
  }>;
}

export interface ProductGridContent {
  heading: string;
  categories: string[];
  products: Array<{
    name: string;
    price: { amount: number; currency: string };
    image: string;
    alt: string;
    category: string;
    badge?: string;
  }>;
}

export interface TestimonialsContent {
  heading: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    avatar: string;
    avatarAlt: string;
  }>;
}

export interface FooterContent {
  brand: { name: string; logo: string };
  newsletter: { heading: string; placeholder: string; cta: string };
  socials: Array<{ platform: string; url: string; icon: string }>;
  links: Array<{
    group: string;
    items: Array<{ label: string; href: string }>;
  }>;
  legal: string;
}

// Combined content for a full page
export interface VelocityContent {
  hero: HeroContent;
  productShowcase: ProductShowcaseContent;
  brandStory: BrandStoryContent;
  productGrid: ProductGridContent;
  testimonials: TestimonialsContent;
  footer: FooterContent;
  metadata: {
    title: string;
    description: string;
    ogImage: string;
  };
}
