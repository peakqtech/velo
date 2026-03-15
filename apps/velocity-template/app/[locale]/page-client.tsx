"use client";

import { Hero, heroScrollConfig } from "@velo/hero";
import { ProductShowcase, productShowcaseScrollConfig } from "@velo/product-showcase";
import { BrandStory, brandStoryScrollConfig } from "@velo/brand-story";
import { ProductGrid, productGridScrollConfig } from "@velo/product-grid";
import { Testimonials, testimonialsScrollConfig } from "@velo/testimonials";
import { Footer, footerScrollConfig } from "@velo/footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { VelocityContent } from "@velo/types";
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
      <Testimonials content={content.testimonials} variant="default" />
      <Footer content={content.footer} variant="default" localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
