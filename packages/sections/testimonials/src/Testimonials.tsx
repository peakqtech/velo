"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TestimonialsProps } from "./testimonials.types";

export function Testimonials({ content }: TestimonialsProps) {
  const { heading, testimonials } = content;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const total = testimonials.length;

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

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

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 50) prev();
    else if (info.offset.x < -50) next();
  };

  const testimonial = testimonials[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.95,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section
      className="testimonials-section relative py-section bg-background overflow-hidden"
      aria-label="Testimonials"
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
      />

      <div className="max-w-content mx-auto px-6 relative z-10">
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
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={current}
                className="testimonial-card text-center cursor-grab active:cursor-grabbing"
                custom={direction}
                variants={shouldReduceMotion ? undefined : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                drag={shouldReduceMotion ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
              >
                {/* Decorative quote mark */}
                <div className="quote-mark text-center select-none" aria-hidden="true">&ldquo;</div>

                <p className="text-xl md:text-3xl font-display text-foreground leading-relaxed italic -mt-8">
                  {testimonial.quote}
                </p>

                <footer className="mt-10 flex items-center justify-center gap-4">
                  {/* Avatar with ring */}
                  <motion.div
                    className="relative w-14 h-14"
                    key={`avatar-${current}`}
                    initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-primary/40" />
                    <div className="absolute inset-[3px] rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.avatarAlt}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </motion.div>
                  <div className="text-left">
                    <cite className="not-italic font-bold text-foreground">
                      {testimonial.author}
                    </cite>
                    <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="p-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10 hover:border-primary/30 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Dots with animated indicator */}
            <div className="flex items-center gap-2" role="tablist">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-400 ${
                    i === current
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="p-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10 hover:border-primary/30 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
