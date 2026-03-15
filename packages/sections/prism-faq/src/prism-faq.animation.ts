import type { ScrollConfig } from "@velocity/scroll-engine";

export const prismFAQScrollConfig: ScrollConfig = {
  trigger: ".prism-faq-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
