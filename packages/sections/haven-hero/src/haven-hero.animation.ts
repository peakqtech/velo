import type { ScrollConfig } from "@velo/scroll-engine";

export const havenHeroScrollConfig: ScrollConfig = {
  trigger: ".haven-hero-section",
  scrub: 1,
  start: "top top",
  end: "+=50%",
  timeline: (tl, el) => {
    const bg = el(".haven-hero-bg");
    if (bg) tl.to(bg, { scale: 1.1, opacity: 0.8 }, 0);
  },
};
