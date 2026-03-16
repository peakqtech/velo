"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { EmberMenuProps } from "./ember-menu.types";
import { fadeInUp, staggerContainer } from "@velo/animations";

export function EmberMenu({ content }: EmberMenuProps) {
  const { heading, subtitle, categories, items } = content;
  const [active, setActive] = useState(categories[0]);
  const shouldReduceMotion = useReducedMotion();
  const filtered = active === "All" ? items : items.filter((item) => item.category === active);

  return (
    <section className="ember-menu-section py-section px-6 bg-background" aria-label="Menu">
      <div className="max-w-content mx-auto">
        <motion.div className="ember-menu-header text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">{heading}</h2>
          <p className="mt-4 text-lg text-muted italic">{subtitle}</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-6 py-2 font-display text-sm tracking-wider transition-all duration-300 ${active === cat ? "bg-primary text-white" : "text-muted hover:text-foreground border border-foreground/10"}`}>
              {cat}
            </button>
          ))}
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <AnimatePresence mode="wait">
            {filtered.map((item, i) => (
              <motion.div key={item.name} variants={fadeInUp}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="ember-menu-item flex gap-6 p-4 group">
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="96px" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display font-bold text-foreground">{item.name}</h3>
                    <span className="font-display text-primary font-bold">{item.price}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{item.description}</p>
                  {item.badge && <span className="inline-block mt-2 px-3 py-0.5 text-xs bg-primary/10 text-primary font-display">{item.badge}</span>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
