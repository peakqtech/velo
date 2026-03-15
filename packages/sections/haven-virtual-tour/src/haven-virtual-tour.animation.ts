import type { ScrollConfig } from "@velo/scroll-engine";

export const havenVirtualTourScrollConfig: ScrollConfig = {
  trigger: ".haven-virtual-tour-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
