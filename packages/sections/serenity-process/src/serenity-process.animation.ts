import type { ScrollConfig } from "@velo/scroll-engine";

export const serenityProcessScrollConfig: ScrollConfig = {
  trigger: ".serenity-process-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
