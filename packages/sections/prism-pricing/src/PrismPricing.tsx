"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { PrismPricingProps } from "./prism-pricing.types";
import { fadeInUp, staggerContainer } from "@velocity/animations";

export function PrismPricing({ content }: PrismPricingProps) {
  const { heading, subtitle, plans } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="prism-pricing-section py-section px-6 bg-white" aria-label="Pricing">
      <div className="max-w-content mx-auto">
        <motion.div className="prism-pricing-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {plans.map((plan, i) => (
            <motion.div key={i} variants={fadeInUp}
              className={`prism-pricing-card relative p-8 rounded-2xl border ${plan.highlighted ? "border-primary shadow-lg shadow-primary/10 scale-105" : "border-foreground/10 bg-background"}`}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">Popular</div>
              )}
              <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-display font-bold text-foreground">${plan.price.amount}</span>
                <span className="text-muted">/{plan.price.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href={plan.cta.href}
                className={`mt-8 block text-center py-3 px-6 rounded-xl font-display font-semibold transition-all duration-300 ${plan.highlighted ? "bg-primary text-white hover:bg-primary-light" : "bg-foreground/5 text-foreground hover:bg-foreground/10"}`}>
                {plan.cta.label}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
