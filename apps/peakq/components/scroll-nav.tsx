// apps/peakq/components/scroll-nav.tsx
"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { useActiveSection } from "@/hooks/use-active-section";

export interface SectionDef {
  id: string;
  label: string;
}

interface ScrollNavProps {
  sections: SectionDef[];
}

export function ScrollNav({ sections }: ScrollNavProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const activeId = useActiveSection(sections.map((s) => s.id));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Top scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px origin-left z-[300]"
        style={{
          scaleX: shouldReduceMotion ? 1 : scaleX,
          background: "linear-gradient(90deg, #3b82f6, rgba(99,102,241,0.6))",
        }}
      />

      {/* Right-side dot navigation — hidden on mobile */}
      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-[200] hidden md:flex flex-col gap-3.5 items-end"
        aria-label="Section navigation"
      >
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="flex items-center gap-2.5 group"
              aria-label={`Go to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Label — visible when active */}
              <span
                className="text-[8px] uppercase tracking-[0.12em] font-mono whitespace-nowrap transition-all duration-200"
                style={{
                  color: isActive
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0)",
                  transform: isActive ? "translateX(0)" : "translateX(4px)",
                }}
              >
                {section.label}
              </span>

              {/* Dot */}
              <motion.div
                className="rounded-full flex-shrink-0"
                animate={{
                  width: isActive ? 8 : 6,
                  height: isActive ? 8 : 6,
                  backgroundColor: isActive ? "#3b82f6" : "rgba(255,255,255,0.2)",
                  boxShadow: isActive ? "0 0 8px rgba(59,130,246,0.6)" : "none",
                }}
                transition={{ duration: 0.2 }}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
