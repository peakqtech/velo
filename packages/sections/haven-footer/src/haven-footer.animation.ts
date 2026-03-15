import type { ScrollConfig } from "@velocity/scroll-engine";

export const havenFooterScrollConfig: ScrollConfig = {
  trigger: ".haven-footer-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
