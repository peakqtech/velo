"use client";

import { PrismHero, prismHeroScrollConfig } from "@velo/prism-hero";
import { PrismFeatures, prismFeaturesScrollConfig } from "@velo/prism-features";
import { PrismPricing, prismPricingScrollConfig } from "@velo/prism-pricing";
import { PrismIntegrations, prismIntegrationsScrollConfig } from "@velo/prism-integrations";
import { PrismTestimonials, prismTestimonialsScrollConfig } from "@velo/prism-testimonials";
import { PrismFAQ, prismFAQScrollConfig } from "@velo/prism-faq";
import { PrismFooter, prismFooterScrollConfig } from "@velo/prism-footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { PrismContent } from "@velo/types";
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
