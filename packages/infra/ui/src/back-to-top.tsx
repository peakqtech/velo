"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BackToTopProps {
  className?: string;
}

export function BackToTop({ className = "rounded-full" }: BackToTopProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-40 p-3 bg-primary text-white shadow-lg hover:bg-primary-light transition-all duration-300 ${className}`}
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </motion.button>
  );
}
