import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="px-6 py-32">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {BRAND.ctaHeadline}
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          {BRAND.ctaSubtext}
        </p>
        <Link
          href="/get-started"
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-green-400 text-black font-semibold hover:bg-green-300 transition-colors"
        >
          Get Started &rarr;
        </Link>
      </div>
    </section>
  );
}
