// apps/peakq/hooks/use-active-section.ts
"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Determines which section is currently active based on scroll position.
 * Uses a scroll-position approach instead of IntersectionObserver to handle
 * gaps between tracked sections (e.g. LogoMarquee, Stats have no IDs).
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  const handleScroll = useCallback(() => {
    // Activation line: 30% from top of viewport
    const trigger = window.innerHeight * 0.3;
    let current = sectionIds[0] ?? "";

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      // The last section whose top has scrolled above the trigger line wins
      if (top <= trigger) {
        current = id;
      }
    }

    setActiveId(current);
  }, [sectionIds]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return activeId;
}
