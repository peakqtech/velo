"use client";

import { Hero, heroScrollConfig } from "@velocity/hero";
import { ProductShowcase, productShowcaseScrollConfig } from "@velocity/product-showcase";
import { BrandStory, brandStoryScrollConfig } from "@velocity/brand-story";
import { ProductGrid, productGridScrollConfig } from "@velocity/product-grid";
import { Testimonials, testimonialsScrollConfig } from "@velocity/testimonials";
import { Footer, footerScrollConfig } from "@velocity/footer";
import { useScrollEngine } from "@velocity/scroll-engine";
import type { VelocityContent } from "@velocity/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

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
      <Footer content={content.footer} localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
