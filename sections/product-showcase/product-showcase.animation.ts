import type { ScrollConfig } from "@/lib/scroll-engine";

export const productShowcaseScrollConfig: ScrollConfig = {
  trigger: ".product-showcase-section",
  pin: true,
  scrub: 1,
  start: "top top",
  end: "+=150%",
  timeline: (tl, el) => {
    const product = el(".showcase-product");
    const features = el(".showcase-features");
    const title = el(".showcase-title");

    // Product entrance + float
    if (product) {
      tl.fromTo(product, { y: 100, opacity: 0 }, { y: -20, opacity: 1, duration: 1 }, 0);
      tl.to(product, { y: -40, rotation: 3, duration: 1 }, 1);
    }

    // Title fade in
    if (title) {
      tl.fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3);
    }

    // Features stagger in
    if (features) {
      const featureEls = features.querySelectorAll(".feature-callout");
      if (featureEls.length > 0) {
        tl.fromTo(
          featureEls,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, stagger: 0.15, duration: 0.4 },
          0.6
        );
      }
    }
  },
};
