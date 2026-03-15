"use client";

import { HavenHero, havenHeroScrollConfig } from "@velo/haven-hero";
import { HavenProperties, havenPropertiesScrollConfig } from "@velo/haven-properties";
import { HavenAmenities, havenAmenitiesScrollConfig } from "@velo/haven-amenities";
import { HavenVirtualTour, havenVirtualTourScrollConfig } from "@velo/haven-virtual-tour";
import { HavenNeighborhood, havenNeighborhoodScrollConfig } from "@velo/haven-neighborhood";
import { HavenAgent, havenAgentScrollConfig } from "@velo/haven-agent";
import { HavenFooter, havenFooterScrollConfig } from "@velo/haven-footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { HavenContent } from "@velo/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  havenHeroScrollConfig,
  havenPropertiesScrollConfig,
  havenAmenitiesScrollConfig,
  havenVirtualTourScrollConfig,
  havenNeighborhoodScrollConfig,
  havenAgentScrollConfig,
  havenFooterScrollConfig,
];

interface PageClientProps {
  content: HavenContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);
  return (
    <main>
      <HavenHero content={content.hero} />
      <HavenProperties content={content.properties} />
      <HavenAmenities content={content.amenities} />
      <HavenVirtualTour content={content.virtualTour} />
      <HavenNeighborhood content={content.neighborhood} />
      <HavenAgent content={content.agent} />
      <HavenFooter content={content.footer} localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
