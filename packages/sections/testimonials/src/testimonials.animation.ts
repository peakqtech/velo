import type { ScrollConfig } from "@velocity/scroll-engine";

export const testimonialsScrollConfig: ScrollConfig = {
  trigger: ".testimonials-section",
  scrub: false,
  start: "top 70%",
  timeline: (tl, el) => {
    const heading = el(".testimonials-heading");
    const cards = el(".testimonials-section")?.querySelectorAll(".testimonial-card");

    if (heading) {
      tl.fromTo(heading, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 });
    }

    if (cards && cards.length > 0) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 },
        0.2
      );
    }
  },
};
