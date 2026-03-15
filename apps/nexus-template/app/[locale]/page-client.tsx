"use client";

import { NexusHero, nexusHeroScrollConfig } from "@velo/nexus-hero";
import { NexusServices, nexusServicesScrollConfig } from "@velo/nexus-services";
import { NexusCaseStudies, nexusCaseStudiesScrollConfig } from "@velo/nexus-case-studies";
import { NexusTeam, nexusTeamScrollConfig } from "@velo/nexus-team";
import { NexusStats, nexusStatsScrollConfig } from "@velo/nexus-stats";
import { NexusContact, nexusContactScrollConfig } from "@velo/nexus-contact";
import { Footer, footerScrollConfig } from "@velo/footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { NexusContent } from "@velo/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  nexusHeroScrollConfig,
  nexusServicesScrollConfig,
  nexusCaseStudiesScrollConfig,
  nexusTeamScrollConfig,
  nexusStatsScrollConfig,
  nexusContactScrollConfig,
  footerScrollConfig,
];

interface PageClientProps {
  content: NexusContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);
  return (
    <main>
      <NexusHero content={content.hero} />
      <NexusServices content={content.services} />
      <NexusCaseStudies content={content.caseStudies} />
      <NexusTeam content={content.team} />
      <NexusStats content={content.stats} />
      <NexusContact content={content.contact} />
      <Footer content={content.footer} variant="nexus" localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
