"use client";

import { EmberHero, emberHeroScrollConfig } from "@velo/ember-hero";
import { EmberMenu, emberMenuScrollConfig } from "@velo/ember-menu";
import { EmberChef, emberChefScrollConfig } from "@velo/ember-chef";
import { EmberReservation, emberReservationScrollConfig } from "@velo/ember-reservation";
import { EmberGallery, emberGalleryScrollConfig } from "@velo/ember-gallery";
import { EmberTestimonials, emberTestimonialsScrollConfig } from "@velo/ember-testimonials";
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
  emberTestimonialsScrollConfig,
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
      <EmberTestimonials content={content.testimonials} />
      <Footer content={content.footer} variant="ember" localeSwitcher={<LocaleSwitcher />} />
    </main>
  );
}
