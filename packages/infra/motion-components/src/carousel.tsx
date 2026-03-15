"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface CarouselProps {
  children: ReactNode[];
  className?: string;
  gap?: number;
}

export function Carousel({ children, className = "", gap = 24 }: CarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      setDragConstraints({ left: -(scrollWidth - clientWidth), right: 0 });
    }
  }, [children]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        ref={containerRef}
        className="flex cursor-grab active:cursor-grabbing"
        style={{ gap }}
        drag={shouldReduceMotion ? false : "x"}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      >
        {children.map((child, i) => (
          <motion.div key={i} className="flex-shrink-0">
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
