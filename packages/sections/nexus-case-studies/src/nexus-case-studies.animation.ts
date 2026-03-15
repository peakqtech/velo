import type { ScrollConfig } from "@velo/scroll-engine";

export const nexusCaseStudiesScrollConfig: ScrollConfig = {
  trigger: ".nexus-case-studies-section",
  scrub: 1,
  start: "top 80%",
  end: "+=60%",
  timeline: () => {
    // Entrance animations handled by Framer Motion whileInView
  },
};
