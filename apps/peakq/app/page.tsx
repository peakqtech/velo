export const metadata = {
  title: "PeakQ — AI-Powered Business Operating System",
  description: "We don't just build websites. We build revenue machines. AI-powered platform purpose-built for your industry.",
};

import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { CompoundingStack } from "@/components/sections/compounding-stack";
import { PricingPreview } from "@/components/sections/pricing-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <CompoundingStack />
      <PricingPreview />
      <ServicesPreview />
      <FinalCta />
    </>
  );
}
