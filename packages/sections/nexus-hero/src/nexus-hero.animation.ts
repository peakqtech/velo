import type { ScrollConfig } from "@velocity/scroll-engine";

export const nexusHeroScrollConfig: ScrollConfig = {
  trigger: ".nexus-hero-section",
  scrub: 1,
  start: "top top",
  end: "+=80%",
  timeline: (tl, el) => {
    const headline = el(".nexus-hero-headline");
    const subheadline = el(".nexus-hero-subheadline");
    const cta = el(".nexus-hero-cta");
    const marquee = el(".nexus-hero-marquee");
    if (headline) tl.to(headline, { opacity: 0, y: -60, scale: 0.95 }, 0);
    if (subheadline) tl.to(subheadline, { opacity: 0, y: -40 }, 0.05);
    if (cta) tl.to(cta, { opacity: 0, y: -30 }, 0.1);
    if (marquee) tl.to(marquee, { opacity: 0 }, 0);
  },
};
