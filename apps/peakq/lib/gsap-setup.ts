import gsap from "gsap";
// @ts-expect-error — GSAP ships type files as kebab-case but subpaths are PascalCase; TS casing conflict on macOS
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-expect-error — same as above
import { ScrollSmoother } from "gsap/ScrollSmoother";
// @ts-expect-error — same as above
import { SplitText } from "gsap/SplitText";
// @ts-expect-error — same as above
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
// @ts-expect-error — same as above
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// @ts-expect-error — same as above
import { Flip } from "gsap/Flip";
// @ts-expect-error — same as above
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
