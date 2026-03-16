import type { ScrollConfig } from "@velo/scroll-engine";

export const footerScrollConfig: ScrollConfig = {
  trigger: ".footer-section",
  scrub: 1,
  start: "top bottom",
  end: "top 60%",
  timeline: (tl, el) => {
    const footer = el(".footer-inner");
    if (footer) {
      tl.fromTo(
        footer,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", ease: "none" }
      );
    }
  },
};
