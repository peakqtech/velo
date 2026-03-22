"use client";

import { useRef } from "react";
// @ts-expect-error — GSAP ships type files as kebab-case but subpaths are PascalCase; TS casing conflict on macOS
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-expect-error — same as above
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import "@/lib/gsap-setup";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Configure ScrollTrigger for mobile
    ScrollTrigger.config({ ignoreMobileResize: true });

    ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: 1.5,
      effects: true,
    });
  }, { scope: wrapperRef });

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
