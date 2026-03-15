"use client";

import { PrismHero, prismHeroScrollConfig } from "@velo/prism-hero";
import { PrismFeatures, prismFeaturesScrollConfig } from "@velo/prism-features";
import { PrismPricing, prismPricingScrollConfig } from "@velo/prism-pricing";
import { PrismIntegrations, prismIntegrationsScrollConfig } from "@velo/prism-integrations";
import { Testimonials, testimonialsScrollConfig } from "@velo/testimonials";
import { PrismFAQ, prismFAQScrollConfig } from "@velo/prism-faq";
import { Footer, footerScrollConfig } from "@velo/footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { PrismContent } from "@velo/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  prismHeroScrollConfig,
  prismFeaturesScrollConfig,
  prismPricingScrollConfig,
  prismIntegrationsScrollConfig,
  testimonialsScrollConfig,
  prismFAQScrollConfig,
  footerScrollConfig,
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
      <Testimonials content={content.testimonials} variant="prism" />
      <PrismFAQ content={content.faq} />
      <Footer content={content.footer} variant="prism" localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
