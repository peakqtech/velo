import type { ScrollConfig } from "@/lib/scroll-engine";

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

    if (bg) {
      tl.to(bg, { y: "30%", scale: 1.1 }, 0);
    }
    if (headline) {
      tl.to(headline, { opacity: 0, y: -50 }, 0);
    }
    if (tagline) {
      tl.to(tagline, { opacity: 0, y: -30 }, 0.1);
    }
    if (cta) {
      tl.to(cta, { opacity: 0, y: -20 }, 0.15);
    }
  },
};
