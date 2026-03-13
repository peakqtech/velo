import type { ScrollConfig } from "@/lib/scroll-engine";

export const productGridScrollConfig: ScrollConfig = {
  trigger: ".product-grid-section",
  scrub: false,
  start: "top 80%",
  end: "top 20%",
  timeline: (tl, el) => {
    const cards = el(".product-grid-section")?.querySelectorAll(".product-card");
    if (!cards || cards.length === 0) return;

    tl.fromTo(
      cards,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }
    );
  },
};
