"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { EmberReservationProps } from "./ember-reservation.types";
import { fadeInUp, staggerContainer } from "@velo/animations";

export function EmberReservation({ content }: EmberReservationProps) {
  const { heading, subtitle, cta, hours, phone, address } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="ember-reservation-section py-section px-6 bg-background" aria-label="Reservation">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div className="ember-reservation-header"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
          <p className="mt-4 text-lg text-muted italic">{subtitle}</p>
        </motion.div>

        <motion.div className="mt-12 flex flex-col sm:flex-row justify-center gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {hours.map((h, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <p className="font-display font-bold text-foreground text-sm uppercase tracking-wider">{h.days}</p>
              <p className="text-muted mt-1">{h.time}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-12"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <a href={cta.href}
            className="inline-block px-10 py-4 bg-primary text-white font-display text-lg tracking-wider hover:bg-primary-light transition-all duration-300">
            {cta.label}
          </a>
        </motion.div>

        <motion.div className="mt-8 space-y-2"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <p className="text-sm text-muted">{phone}</p>
          <p className="text-sm text-muted">{address}</p>
        </motion.div>
      </div>
    </section>
  );
}
