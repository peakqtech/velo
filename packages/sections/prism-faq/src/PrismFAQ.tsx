"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { PrismFAQProps } from "./prism-faq.types";
import { Accordion } from "@velo/motion-components";
import { fadeInUp } from "@velo/animations";

export function PrismFAQ({ content }: PrismFAQProps) {
  const { heading, subtitle, questions } = content;
  const shouldReduceMotion = useReducedMotion();

  const items = questions.map((q, i) => ({
    id: `faq-${i}`,
    trigger: q.question,
    content: <p className="leading-relaxed">{q.answer}</p>,
  }));

  return (
    <section className="prism-faq-section py-section px-6 bg-background" aria-label="FAQ">
      <div className="max-w-3xl mx-auto">
        <motion.div className="prism-faq-header text-center mb-12"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
          <p className="mt-4 text-lg text-muted">{subtitle}</p>
        </motion.div>
        <Accordion items={items} />
      </div>
    </section>
  );
}
