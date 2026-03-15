"use client";

import { SerenityHero, serenityHeroScrollConfig } from "@velocity/serenity-hero";
import { SerenityServices, serenityServicesScrollConfig } from "@velocity/serenity-services";
import { SerenityProcess, serenityProcessScrollConfig } from "@velocity/serenity-process";
import { SerenityPractitioners, serenityPractitionersScrollConfig } from "@velocity/serenity-practitioners";
import { SerenityTestimonials, serenityTestimonialsScrollConfig } from "@velocity/serenity-testimonials";
import { SerenityBooking, serenityBookingScrollConfig } from "@velocity/serenity-booking";
import { SerenityFooter, serenityFooterScrollConfig } from "@velocity/serenity-footer";
import { useScrollEngine } from "@velocity/scroll-engine";
import type { SerenityContent } from "@velocity/types";
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
