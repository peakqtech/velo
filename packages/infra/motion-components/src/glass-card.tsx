"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@velocity/animations";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = "", hoverEffect = true }: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      whileHover={hoverEffect && !shouldReduceMotion ? { y: -8, transition: { duration: 0.3 } } : undefined}
      className={`
        rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
