"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(containerRef.current.scrollWidth / 2);
    }
  }, [children]);

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="flex gap-8">{children}</div>
      </div>
    );
  }

  const duration = contentWidth / speed;
  const x = direction === "left" ? [0, -contentWidth] : [-contentWidth, 0];

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <motion.div
        ref={containerRef}
        className={`flex gap-8 w-max ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        animate={{ x }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        {...(pauseOnHover && { whileHover: { animationPlayState: "paused" } })}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
