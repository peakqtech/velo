import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    Flip,
    Observer
  );
}

// Export to prevent tree-shaking from eliminating this side-effect module
export const gsapReady = true;
