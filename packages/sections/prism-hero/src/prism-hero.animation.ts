import type { ScrollConfig } from "@velo/scroll-engine";

export const prismHeroScrollConfig: ScrollConfig = {
  trigger: ".prism-hero-section",
  scrub: 1,
  start: "top top",
  end: "+=80%",
  timeline: (tl, el) => {
    const headline = el(".prism-hero-headline");
    const subtitle = el(".prism-hero-subtitle");
    const search = el(".prism-hero-search");
    const trusted = el(".prism-hero-trusted");
    if (headline) tl.to(headline, { opacity: 0, y: -60, scale: 0.95 }, 0);
    if (subtitle) tl.to(subtitle, { opacity: 0, y: -40 }, 0.05);
    if (search) tl.to(search, { opacity: 0, y: -30 }, 0.1);
    if (trusted) tl.to(trusted, { opacity: 0 }, 0);
  },
};
