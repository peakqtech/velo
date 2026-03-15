"use client";

import { HavenHero, havenHeroScrollConfig } from "@velocity/haven-hero";
import { HavenProperties, havenPropertiesScrollConfig } from "@velocity/haven-properties";
import { HavenAmenities, havenAmenitiesScrollConfig } from "@velocity/haven-amenities";
import { HavenVirtualTour, havenVirtualTourScrollConfig } from "@velocity/haven-virtual-tour";
import { HavenNeighborhood, havenNeighborhoodScrollConfig } from "@velocity/haven-neighborhood";
import { HavenAgent, havenAgentScrollConfig } from "@velocity/haven-agent";
import { HavenFooter, havenFooterScrollConfig } from "@velocity/haven-footer";
import { useScrollEngine } from "@velocity/scroll-engine";
import type { HavenContent } from "@velocity/types";
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
