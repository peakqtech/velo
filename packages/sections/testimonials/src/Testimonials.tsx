"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TestimonialsProps } from "./testimonials.types";

export function Testimonials({ content }: TestimonialsProps) {
  const { heading, testimonials } = content;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const total = testimonials.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, shouldReduceMotion, next]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const testimonial = testimonials[current];

  return (
    <section
      className="testimonials-section relative py-section bg-background overflow-hidden"
      aria-label="Testimonials"
    >
      <div className="max-w-content mx-auto px-6">
        <h2 className="testimonials-heading text-3xl md:text-5xl font-display font-bold text-foreground text-center mb-16">
          {heading}
        </h2>

        {/* Carousel */}
        <div
          className="relative max-w-3xl mx-auto"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current}
                className="testimonial-card text-center"
                initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xl md:text-3xl font-display text-foreground leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <footer className="mt-8 flex items-center justify-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.avatarAlt}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="text-left">
                    <cite className="not-italic font-bold text-foreground">
                      {testimonial.author}
                    </cite>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="p-2 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2" role="tablist">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-primary" : "bg-foreground/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="p-2 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
