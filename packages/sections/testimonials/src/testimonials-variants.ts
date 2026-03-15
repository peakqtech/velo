import type { TestimonialsVariant } from "./testimonials.types";

export interface TestimonialsVariantStyles {
  displayMode: "carousel" | "grid";
  section: string;
  headingWrapper: string;
  heading: string;
  card: string;
  quoteMark: string;
  quoteText: string;
  avatarSize: string;
  authorName: string;
  authorRole: string;
  showStars: boolean;
}

const baseStyles: TestimonialsVariantStyles = {
  displayMode: "carousel",
  section: "py-section bg-background overflow-hidden",
  headingWrapper: "",
  heading: "text-3xl md:text-5xl font-display font-bold text-foreground text-center mb-16",
  card: "text-center p-8",
  quoteMark: "text-5xl text-primary/30 font-serif mb-4",
  quoteText: "text-foreground italic leading-relaxed",
  avatarSize: "w-12 h-12",
  authorName: "font-display font-bold text-foreground text-sm",
  authorRole: "text-xs text-muted",
  showStars: false,
};

const variants: Record<TestimonialsVariant, Partial<TestimonialsVariantStyles>> = {
  default: {
    displayMode: "carousel",
  },
  ember: {
    displayMode: "grid",
    section: "py-section px-6 bg-background",
    headingWrapper: "text-center mb-16",
    heading: "text-4xl md:text-6xl font-display font-bold text-foreground",
    card: "text-center p-8",
    quoteMark: "text-5xl text-primary/30 font-serif mb-4",
    quoteText: "text-foreground italic leading-relaxed",
    avatarSize: "w-12 h-12",
    authorName: "font-display font-bold text-foreground text-sm",
    authorRole: "text-xs text-muted",
  },
  prism: {
    displayMode: "grid",
    section: "py-section px-6 bg-white",
    heading: "text-4xl md:text-6xl font-display font-bold text-foreground text-center mb-16",
    card: "p-8 rounded-2xl bg-background border border-foreground/5",
    quoteMark: "text-primary text-4xl mb-4",
    quoteText: "text-foreground leading-relaxed",
    avatarSize: "w-10 h-10",
    authorName: "font-display font-semibold text-foreground text-sm",
    authorRole: "text-xs text-muted",
  },
  serenity: {
    displayMode: "grid",
    section: "py-section px-6 md:px-12 bg-secondary",
    heading: "text-3xl md:text-5xl font-display font-bold text-foreground text-center mb-16",
    card: "p-8 rounded-3xl bg-white shadow-sm border border-foreground/5",
    quoteMark: "",
    quoteText: "text-foreground leading-relaxed",
    avatarSize: "w-10 h-10",
    authorName: "font-display font-semibold text-foreground text-sm",
    authorRole: "text-xs text-muted",
    showStars: true,
  },
};

export function getTestimonialsVariantStyles(variant: TestimonialsVariant): TestimonialsVariantStyles {
  return { ...baseStyles, ...variants[variant] };
}
