import type { ScrollConfig } from "@velo/scroll-engine";

export const emberTestimonialsScrollConfig: ScrollConfig = {
  trigger: ".ember-testimonials-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
