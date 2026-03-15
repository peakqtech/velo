"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@velo/animations";
import type { TestimonialsProps } from "./testimonials.types";
import { getTestimonialsVariantStyles } from "./testimonials-variants";

function CarouselTestimonials({ content }: TestimonialsProps) {
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

function GridTestimonials({ content, variant = "ember" }: TestimonialsProps) {
  const { heading, testimonials } = content;
  const shouldReduceMotion = useReducedMotion();
  const styles = getTestimonialsVariantStyles(variant!);

  return (
    <section
      className={`testimonials-section ${styles.section}`}
      aria-label="Testimonials"
    >
      <div className="max-w-content mx-auto">
        {styles.headingWrapper ? (
          <motion.div
            className={`testimonials-heading ${styles.headingWrapper}`}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {variant === "ember" && <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />}
            <h2 className={styles.heading}>{heading}</h2>
          </motion.div>
        ) : (
          <motion.h2
            className={`testimonials-heading ${styles.heading}`}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {heading}
          </motion.h2>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeInUp} className={`testimonial-card ${styles.card}`}>
              {styles.showStars && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-4 h-4 text-accent"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              )}
              {styles.quoteMark && (
                <div className={styles.quoteMark}>&ldquo;</div>
              )}
              <p className={styles.quoteText}>{t.quote}</p>
              <div className={`flex items-center gap-3 mt-6 ${variant === "ember" ? "flex-col" : ""}`}>
                <Image
                  src={t.avatar}
                  alt={t.avatarAlt}
                  width={48}
                  height={48}
                  className={`${styles.avatarSize} rounded-full object-cover`}
                />
                <div className={variant === "ember" ? "text-center" : ""}>
                  <p className={styles.authorName}>{t.author}</p>
                  <p className={styles.authorRole}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function Testimonials({ content, variant = "default" }: TestimonialsProps) {
  if (variant === "default") {
    return <CarouselTestimonials content={content} variant={variant} />;
  }
  return <GridTestimonials content={content} variant={variant} />;
}
