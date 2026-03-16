"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@velo/animations";
import type { ReactNode } from "react";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  variants?: typeof fadeInUp;
}

export function MotionSection({ children, className = "", variants = fadeInUp }: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
