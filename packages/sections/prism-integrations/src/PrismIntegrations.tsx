"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { PrismIntegrationsProps } from "./prism-integrations.types";
import { Marquee } from "@velocity/motion-components";
import { fadeInUp } from "@velocity/animations";

export function PrismIntegrations({ content }: PrismIntegrationsProps) {
  const { heading, integrations } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="prism-integrations-section py-section px-6 bg-background" aria-label="Integrations">
      <div className="max-w-content mx-auto">
        <motion.h2 className="prism-integrations-heading text-4xl md:text-6xl font-display font-bold text-foreground text-center mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          {heading}
        </motion.h2>
      </div>

      <Marquee speed={25} pauseOnHover className="py-8">
        {integrations.map((integration, i) => (
          <div key={i} className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl border border-foreground/5 shadow-sm">
            <Image src={integration.logo} alt={integration.name} width={32} height={32} className="w-8 h-8" />
            <span className="font-display font-medium text-foreground whitespace-nowrap">{integration.name}</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
