"use client";

import { Hero, heroScrollConfig } from "@/sections/hero";
import { ProductShowcase, productShowcaseScrollConfig } from "@/sections/product-showcase";
import { BrandStory, brandStoryScrollConfig } from "@/sections/brand-story";
import { ProductGrid, productGridScrollConfig } from "@/sections/product-grid";
import { Testimonials, testimonialsScrollConfig } from "@/sections/testimonials";
import { Footer, footerScrollConfig } from "@/sections/footer";
import { useScrollEngine } from "@/lib/scroll-engine";
import type { VelocityContent } from "@/lib/types";

const scrollConfigs = [
  heroScrollConfig,
  productShowcaseScrollConfig,
  brandStoryScrollConfig,
  productGridScrollConfig,
  testimonialsScrollConfig,
  footerScrollConfig,
];

interface PageClientProps {
  content: VelocityContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);

  return (
    <main>
      <Hero content={content.hero} />
      <ProductShowcase content={content.productShowcase} />
      <BrandStory content={content.brandStory} />
      <ProductGrid content={content.productGrid} />
      <Testimonials content={content.testimonials} />
      <Footer content={content.footer} />
    </main>
  );
}
