import type { ScrollConfig } from "@velo/scroll-engine";

export const serenityTestimonialsScrollConfig: ScrollConfig = {
  trigger: ".serenity-testimonials-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
