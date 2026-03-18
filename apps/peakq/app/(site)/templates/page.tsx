import type { Metadata } from "next";
import Link from "next/link";
import { TemplateGallery } from "@/components/template-gallery";

export const metadata: Metadata = {
  title: "Industry Solutions — PeakQ",
  description:
    "See what your business could look like. Every template comes with industry-specific intelligence built in.",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header section */}
      <section className="pt-24 pb-12 px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-4">
          Industry Solutions
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          See What Your Business Could Look Like
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Every template comes with industry-specific intelligence built in.
          Pick your industry, launch in minutes.
        </p>
      </section>

      {/* Gallery */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <TemplateGallery />
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-900 border-t border-gray-800 py-16 px-6 text-center">
        <p className="text-sm text-gray-500 uppercase tracking-widest font-medium mb-4">
          Found Your Industry?
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl mx-auto">
          Every template includes the full AI-Powered Business Operating System.
        </h2>
        <p className="text-gray-400 mb-8">Start in minutes.</p>
        <Link
          href="/get-started"
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-gray-950 transition-all duration-200 hover:opacity-90 hover:scale-105"
          style={{ backgroundColor: "#4ade80" }}
        >
          Get Started →
        </Link>
      </section>
    </main>
  );
}
