export type { TestimonialsContent } from "@velo/types";

export type TestimonialsVariant = "default" | "ember" | "prism" | "serenity";

export interface TestimonialsProps {
  content: import("@velo/types").BaseTestimonialContent;
  variant?: TestimonialsVariant;
}
