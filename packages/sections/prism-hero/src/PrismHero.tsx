"use client";

import React, { ReactNode } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { PrismHeroProps } from "./prism-hero.types";

// ---------------------------------------------------------------------------
// AnimatedGroup (inlined from 21st.dev ibelick/animated-group)
// ---------------------------------------------------------------------------

function AnimatedGroup({
  children,
  className = "",
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
}) {
  const containerVariants: Variants = variants?.container ?? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants: Variants = variants?.item ?? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Transition variants
// ---------------------------------------------------------------------------

const blurInVariants = {
  container: {
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
  },
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1, filter: "blur(0px)", y: 0,
      transition: { type: "spring" as const, bounce: 0.3, duration: 1.5 },
    },
  },
} satisfies { container?: import("framer-motion").Variants; item?: import("framer-motion").Variants };

// ---------------------------------------------------------------------------
// PrismHero
// ---------------------------------------------------------------------------

export function PrismHero({ content }: PrismHeroProps) {
  const { headline, subtitle, announcement, screenshotSrc, cta, secondaryCta, trustedBy } = content;
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? { container: {}, item: { hidden: {}, visible: {} } }
    : blurInVariants;

  return (
    <section className="prism-hero-section relative overflow-hidden bg-background !pt-0 !pb-0" aria-label="Hero">
      {/* Radial light decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 isolate opacity-50 hidden lg:block">
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(260,80%,85%,.08)_0,hsla(260,40%,55%,.02)_50%,hsla(260,20%,45%,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(260,80%,85%,.06)_0,hsla(260,20%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
      </div>

      <div className="relative pt-24 md:pt-36">
        {/* Background image (faded) */}
        <AnimatedGroup
          variants={{
            container: { visible: { transition: { delayChildren: 1 } } },
            item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.3, duration: 2 } } },
          }}
          className="absolute inset-0 -z-20"
        >
          <div className="absolute inset-x-0 top-56 -z-20 lg:top-32">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>
        </AnimatedGroup>

        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto">
            <AnimatedGroup variants={variants}>
              {/* Announcement pill */}
              {announcement && (
                <a href="#features"
                  className="mx-auto flex w-fit items-center gap-4 rounded-full border border-foreground/10 bg-foreground/5 p-1 pl-4 shadow-sm transition-all duration-300 hover:bg-foreground/10">
                  <span className="text-foreground text-sm">{announcement}</span>
                  <span className="block h-4 w-0.5 bg-foreground/20" />
                  <div className="bg-primary size-6 overflow-hidden rounded-full">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6 items-center justify-center">
                        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </a>
              )}

              {/* Headline */}
              <h1 className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-6xl lg:mt-16 xl:text-[5.25rem] font-display font-bold tracking-tight text-foreground">
                {headline}
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted">
                {subtitle}
              </p>
            </AnimatedGroup>

            {/* CTA Buttons */}
            <AnimatedGroup
              variants={{
                container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } },
                item: variants.item,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-3 md:flex-row"
            >
              <div className="bg-primary/10 rounded-[14px] border border-primary/20 p-0.5">
                <a href={cta.href}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light transition-colors">
                  {cta.label}
                </a>
              </div>
              {secondaryCta && (
                <a href={secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/5 transition-colors">
                  {secondaryCta.label}
                </a>
              )}
            </AnimatedGroup>
          </div>
        </div>

        {/* Dashboard screenshot */}
        {screenshotSrc && (
          <AnimatedGroup
            variants={{
              container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } },
              item: variants.item,
            }}
          >
            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div aria-hidden className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%" />
              <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 p-4 shadow-lg shadow-foreground/5">
                <Image
                  className="rounded-2xl w-full"
                  src={screenshotSrc}
                  alt="App dashboard"
                  width={2700}
                  height={1440}
                  style={{ aspectRatio: "15/8", objectFit: "cover" }}
                />
              </div>
            </div>
          </AnimatedGroup>
        )}
      </div>

      {/* Customer logos */}
      <div className="bg-background pb-16 pt-16 md:pb-32">
        <div className="group relative m-auto max-w-5xl px-6">
          <div className="mx-auto grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-14 transition-all duration-500 group-hover:opacity-50 group-hover:blur-sm">
            {trustedBy.map((company, i) => (
              <div key={i} className="flex">
                <Image src={company.logo} alt={company.name} width={100} height={28}
                  className="mx-auto h-5 w-fit opacity-60" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
            <span className="text-sm text-foreground font-medium">
              Meet Our Customers
              <svg className="ml-1 inline-block size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
