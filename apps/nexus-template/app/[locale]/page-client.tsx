"use client";

import { NexusHero, nexusHeroScrollConfig } from "@velocity/nexus-hero";
import { NexusServices, nexusServicesScrollConfig } from "@velocity/nexus-services";
import { NexusCaseStudies, nexusCaseStudiesScrollConfig } from "@velocity/nexus-case-studies";
import { NexusTeam, nexusTeamScrollConfig } from "@velocity/nexus-team";
import { NexusStats, nexusStatsScrollConfig } from "@velocity/nexus-stats";
import { NexusContact, nexusContactScrollConfig } from "@velocity/nexus-contact";
import { NexusFooter, nexusFooterScrollConfig } from "@velocity/nexus-footer";
import { useScrollEngine } from "@velocity/scroll-engine";
import type { NexusContent } from "@velocity/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  nexusHeroScrollConfig,
  nexusServicesScrollConfig,
  nexusCaseStudiesScrollConfig,
  nexusTeamScrollConfig,
  nexusStatsScrollConfig,
  nexusContactScrollConfig,
  nexusFooterScrollConfig,
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
      <NexusFooter content={content.footer} localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
