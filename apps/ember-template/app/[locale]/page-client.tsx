"use client";

import { EmberHero, emberHeroScrollConfig } from "@velo/ember-hero";
import { EmberMenu, emberMenuScrollConfig } from "@velo/ember-menu";
import { EmberChef, emberChefScrollConfig } from "@velo/ember-chef";
import { EmberReservation, emberReservationScrollConfig } from "@velo/ember-reservation";
import { EmberGallery, emberGalleryScrollConfig } from "@velo/ember-gallery";
import { Testimonials, testimonialsScrollConfig } from "@velo/testimonials";
import { Footer, footerScrollConfig } from "@velo/footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { EmberContent } from "@velo/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  emberHeroScrollConfig,
  emberMenuScrollConfig,
  emberChefScrollConfig,
  emberReservationScrollConfig,
  emberGalleryScrollConfig,
  testimonialsScrollConfig,
  footerScrollConfig,
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
      <Testimonials content={content.testimonials} variant="ember" />
      <Footer content={content.footer} variant="ember" localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
