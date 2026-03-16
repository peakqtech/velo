"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { NexusTeamProps } from "./nexus-team.types";
import { fadeInUp, staggerContainer } from "@velo/animations";

export function NexusTeam({ content }: NexusTeamProps) {
  const { heading, subtitle, members } = content;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="nexus-team-section py-section px-6 md:px-12 bg-background" aria-label="Team">
      <div className="max-w-content mx-auto">
        <motion.div
          className="nexus-team-header mb-16"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-foreground uppercase">{heading}</h2>
          <p className="mt-4 text-lg text-muted max-w-xl">{subtitle}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {members.map((member, i) => (
            <motion.div key={i} variants={fadeInUp} className="nexus-team-member group">
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <Image
                  src={member.image}
                  alt={member.alt}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>
              <h3 className="font-display font-bold text-foreground uppercase tracking-wide">{member.name}</h3>
              <p className="text-sm text-primary font-medium">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
