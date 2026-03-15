"use client";

import { PrismHero, prismHeroScrollConfig } from "@velocity/prism-hero";
import { PrismFeatures, prismFeaturesScrollConfig } from "@velocity/prism-features";
import { PrismPricing, prismPricingScrollConfig } from "@velocity/prism-pricing";
import { PrismIntegrations, prismIntegrationsScrollConfig } from "@velocity/prism-integrations";
import { PrismTestimonials, prismTestimonialsScrollConfig } from "@velocity/prism-testimonials";
import { PrismFAQ, prismFAQScrollConfig } from "@velocity/prism-faq";
import { PrismFooter, prismFooterScrollConfig } from "@velocity/prism-footer";
import { useScrollEngine } from "@velocity/scroll-engine";
import type { PrismContent } from "@velocity/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  prismHeroScrollConfig,
  prismFeaturesScrollConfig,
  prismPricingScrollConfig,
  prismIntegrationsScrollConfig,
  prismTestimonialsScrollConfig,
  prismFAQScrollConfig,
  prismFooterScrollConfig,
];

interface PageClientProps {
  content: PrismContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);

  return (
    <main>
      <PrismHero content={content.hero} />
      <PrismFeatures content={content.features} />
      <PrismPricing content={content.pricing} />
      <PrismIntegrations content={content.integrations} />
      <PrismTestimonials content={content.testimonials} />
      <PrismFAQ content={content.faq} />
      <PrismFooter content={content.footer} localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
