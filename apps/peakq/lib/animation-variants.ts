// apps/peakq/lib/animation-variants.ts
import type { Variants } from "framer-motion";

export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

/** Clip-path word reveal — wrap each line in overflow:hidden, apply to inner span */
export const revealVariants: Variants = {
  hidden: { y: "106%" },
  visible: (i: number = 0) => ({
    y: 0,
    transition: {
      duration: 0.75,
      delay: i * 0.13,
      ease: EASE_CINEMATIC,
    },
  }),
};

/** Fade + slight upward drift — for body text, pills, CTAs */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: EASE_CINEMATIC,
    },
  }),
};

/** Horizontal expand — for decorative ruled lines */
export const expandLineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: EASE_CINEMATIC },
  },
};

/** Container that triggers children with useInView */
export const inViewContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
