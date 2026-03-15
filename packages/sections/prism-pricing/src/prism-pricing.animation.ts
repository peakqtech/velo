import type { ScrollConfig } from "@velocity/scroll-engine";

export const prismPricingScrollConfig: ScrollConfig = {
  trigger: ".prism-pricing-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
