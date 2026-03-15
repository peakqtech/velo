import type { ScrollConfig } from "@velocity/scroll-engine";

export const heroScrollConfig: ScrollConfig = {
  trigger: ".hero-section",
  scrub: 1,
  start: "top top",
  end: "+=80%",
  timeline: (tl, el) => {
    const bg = el(".hero-bg");
    const headline = el(".hero-headline");
    const tagline = el(".hero-tagline");
    const cta = el(".hero-cta");
    const scrollIndicator = el(".hero-scroll-indicator");

    if (bg) {
      tl.to(bg, { y: "30%", scale: 1.15, filter: "blur(4px)" }, 0);
    }
    if (headline) {
      tl.to(headline, { opacity: 0, y: -60, scale: 0.95 }, 0);
    }
    if (tagline) {
      tl.to(tagline, { opacity: 0, y: -40 }, 0.05);
    }
    if (cta) {
      tl.to(cta, { opacity: 0, y: -30 }, 0.1);
    }
    if (scrollIndicator) {
      tl.to(scrollIndicator, { opacity: 0 }, 0);
    }
  },
};
