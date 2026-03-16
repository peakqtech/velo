"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SerenityBookingProps } from "./serenity-booking.types";
import { fadeInUp, staggerContainer } from "@velo/animations";

export function SerenityBooking({ content }: SerenityBookingProps) {
  const { heading, subtitle, cta, phone, email, hours } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="serenity-booking-section py-section px-6 md:px-12 bg-primary/5"
      aria-label="Booking"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          className="serenity-booking-header"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted">{subtitle}</p>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <a
            href={cta.href}
            className="inline-block px-10 py-4 bg-primary text-white font-display font-semibold text-lg rounded-2xl hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/20"
          >
            {cta.label}
          </a>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row justify-center gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {hours.map((h, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <p className="font-display font-semibold text-foreground text-sm">
                {h.days}
              </p>
              <p className="text-muted text-sm mt-1">{h.time}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 space-y-1"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <p className="text-sm text-muted">{phone}</p>
          <p className="text-sm text-muted">{email}</p>
        </motion.div>
      </div>
    </section>
  );
}
