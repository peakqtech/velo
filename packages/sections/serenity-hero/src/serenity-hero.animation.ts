import type { ScrollConfig } from "@velocity/scroll-engine";

export const serenityHeroScrollConfig: ScrollConfig = {
  trigger: ".serenity-hero-section",
  scrub: 1,
  start: "top top",
  end: "+=80%",
  timeline: (tl, el) => {
    const headline = el(".serenity-hero-headline");
    const tagline = el(".serenity-hero-tagline");
    const badges = el(".serenity-hero-badges");
    const cta = el(".serenity-hero-cta");
    if (headline) tl.to(headline, { opacity: 0, y: -60, scale: 0.95 }, 0);
    if (tagline) tl.to(tagline, { opacity: 0, y: -40 }, 0.05);
    if (badges) tl.to(badges, { opacity: 0 }, 0);
    if (cta) tl.to(cta, { opacity: 0, y: -30 }, 0.1);
  },
};
