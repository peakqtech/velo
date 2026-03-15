import type { ScrollConfig } from "@velocity/scroll-engine";

export const emberChefScrollConfig: ScrollConfig = {
  trigger: ".ember-chef-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
