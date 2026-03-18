// apps/peakq/app/page.tsx
import { Hero } from "@/components/sections/hero";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Stats } from "@/components/sections/stats";
import { ServicesPreview } from "@/components/sections/services-preview";
import { PlatformPreview } from "@/components/sections/platform-preview";
import { CompoundingStack } from "@/components/sections/compounding-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/footer";
// DO NOT import Navbar — hero.tsx renders its own nav inline
// DO NOT import IndustryShowcase or PricingPreview — replaced by Stats and Testimonials

export const metadata = {
  title: "PeakQ — AI-Powered Business Operating System",
  description:
    "We don't just build websites. We build revenue machines. AI-powered platform purpose-built for your industry.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <Stats />
      <ServicesPreview />
      <PlatformPreview />
      <CompoundingStack />
      <Testimonials />
      <FinalCta />
      <Footer />
    </>
  );
}
