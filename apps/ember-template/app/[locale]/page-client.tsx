"use client";

import { EmberHero, emberHeroScrollConfig } from "@velocity/ember-hero";
import { EmberMenu, emberMenuScrollConfig } from "@velocity/ember-menu";
import { EmberChef, emberChefScrollConfig } from "@velocity/ember-chef";
import { EmberReservation, emberReservationScrollConfig } from "@velocity/ember-reservation";
import { EmberGallery, emberGalleryScrollConfig } from "@velocity/ember-gallery";
import { EmberTestimonials, emberTestimonialsScrollConfig } from "@velocity/ember-testimonials";
import { EmberFooter, emberFooterScrollConfig } from "@velocity/ember-footer";
import { useScrollEngine } from "@velocity/scroll-engine";
import type { EmberContent } from "@velocity/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  emberHeroScrollConfig,
  emberMenuScrollConfig,
  emberChefScrollConfig,
  emberReservationScrollConfig,
  emberGalleryScrollConfig,
  emberTestimonialsScrollConfig,
  emberFooterScrollConfig,
];

interface PageClientProps {
  content: EmberContent;
}

export function PageClient({ content }: PageClientProps) {
  useScrollEngine(scrollConfigs);
  return (
    <main>
      <EmberHero content={content.hero} />
      <EmberMenu content={content.menu} />
      <EmberChef content={content.chef} />
      <EmberReservation content={content.reservation} />
      <EmberGallery content={content.gallery} />
      <EmberTestimonials content={content.testimonials} />
      <EmberFooter content={content.footer} localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
