import type { ScrollConfig } from "@velo/scroll-engine";

export const serenityFooterScrollConfig: ScrollConfig = {
  trigger: ".serenity-footer-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
