"use client";

import { SerenityHero, serenityHeroScrollConfig } from "@velo/serenity-hero";
import { SerenityServices, serenityServicesScrollConfig } from "@velo/serenity-services";
import { SerenityProcess, serenityProcessScrollConfig } from "@velo/serenity-process";
import { SerenityPractitioners, serenityPractitionersScrollConfig } from "@velo/serenity-practitioners";
import { SerenityTestimonials, serenityTestimonialsScrollConfig } from "@velo/serenity-testimonials";
import { SerenityBooking, serenityBookingScrollConfig } from "@velo/serenity-booking";
import { SerenityFooter, serenityFooterScrollConfig } from "@velo/serenity-footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { SerenityContent } from "@velo/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  serenityHeroScrollConfig,
  serenityServicesScrollConfig,
  serenityProcessScrollConfig,
  serenityPractitionersScrollConfig,
  serenityTestimonialsScrollConfig,
  serenityBookingScrollConfig,
  serenityFooterScrollConfig,
];

interface PageClientProps {
  content: SerenityContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);

  return (
    <main>
      <SerenityHero content={content.hero} />
      <SerenityServices content={content.services} />
      <SerenityProcess content={content.process} />
      <SerenityPractitioners content={content.practitioners} />
      <SerenityTestimonials content={content.testimonials} />
      <SerenityBooking content={content.booking} />
      <SerenityFooter content={content.footer} localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
