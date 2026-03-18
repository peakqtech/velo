import { Hero } from "@/components/sections/hero";
import { IndustryShowcase } from "@/components/sections/industry-showcase";
import { CompoundingStack } from "@/components/sections/compounding-stack";
import { PricingPreview } from "@/components/sections/pricing-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IndustryShowcase />
      <CompoundingStack />
      <PricingPreview />
      <ServicesPreview />
      <FinalCta />
    </>
  );
}
