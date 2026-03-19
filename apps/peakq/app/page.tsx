// apps/peakq/app/page.tsx
import { EtherealBackground } from "@/components/ethereal-background";
import { ScrollNav } from "@/components/scroll-nav";
import { Hero } from "@/components/sections/hero";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Stats } from "@/components/sections/stats";
import { ServicesPreview } from "@/components/sections/services-preview";
import { TemplatesShowcase } from "@/components/sections/templates-showcase";
import { PlatformPreview } from "@/components/sections/platform-preview";
import { CompoundingStack } from "@/components/sections/compounding-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "PeakQ — Websites, Blogs, Ads & Digital Presence. Handled.",
  description:
    "Your website, blog, ads, and entire digital presence — built, managed, and grown by one system. No agency. No freelancers.",
};

const SECTIONS = [
  { id: "hero",      label: "Home" },
  { id: "services",  label: "Services" },
  { id: "templates", label: "Templates" },
  { id: "platform",  label: "Platform" },
  { id: "how",       label: "How It Works" },
  { id: "results",   label: "Results" },
  { id: "cta",       label: "Get Started" },
];

export default function HomePage() {
  return (
    <>
      <EtherealBackground />
      <ScrollNav sections={SECTIONS} />
      <Hero id="hero" />
      <LogoMarquee />
      <Stats />
      <ServicesPreview id="services" />
      <TemplatesShowcase id="templates" />
      <PlatformPreview id="platform" />
      <CompoundingStack id="how" />
      <Testimonials id="results" />
      <FinalCta id="cta" />
      <Footer />
    </>
  );
}
