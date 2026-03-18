"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Eyebrow */}
        <p className="text-sm uppercase tracking-widest text-green-400 font-medium">
          {BRAND.tagline}
        </p>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight whitespace-pre-line">
          {BRAND.heroHeadline}
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
          {BRAND.heroSubtext}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/templates"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-green-400 text-black font-semibold hover:bg-green-300 transition-colors"
          >
            See It In Action &rarr;
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-green-400 text-green-400 font-semibold hover:bg-green-400/10 transition-colors"
          >
            View Pricing
          </Link>
        </div>

        {/* Subtle Proof */}
        <p className="text-sm text-gray-600 italic">{BRAND.subtleProof}</p>
      </motion.div>
    </section>
  );
}
