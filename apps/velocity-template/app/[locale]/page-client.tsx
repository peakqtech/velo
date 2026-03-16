"use client";

import { useState, useEffect, useCallback } from "react";
import { Hero, heroScrollConfig } from "@velo/hero";
import { ProductShowcase, productShowcaseScrollConfig } from "@velo/product-showcase";
import { BrandStory, brandStoryScrollConfig } from "@velo/brand-story";
import { ProductGrid, productGridScrollConfig } from "@velo/product-grid";
import { Testimonials, testimonialsScrollConfig } from "@velo/testimonials";
import { Footer, footerScrollConfig } from "@velo/footer";
import { useScrollEngine } from "@velo/scroll-engine";
import type { VelocityContent } from "@velo/types";
import { LocaleSwitcher } from "@/components/locale-switcher";

const scrollConfigs = [
  heroScrollConfig,
  productShowcaseScrollConfig,
  brandStoryScrollConfig,
  productGridScrollConfig,
  testimonialsScrollConfig,
  footerScrollConfig,
];

interface PageClientProps {
  content: VelocityContent;
}

/**
 * Listen for postMessage from dashboard editor for live preview.
 * Messages: { type: "velo:content-update", content: VelocityContent }
 *           { type: "velo:section-update", section: string, data: unknown }
 *           { type: "velo:scroll-to", section: string }
 */
function usePreviewMode(initialContent: VelocityContent) {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // Only enable preview mode when loaded in an iframe
    if (window.self === window.top) return;

    setIsPreview(true);

    const handler = (event: MessageEvent) => {
      const { data } = event;
      if (!data || typeof data !== "object") return;

      if (data.type === "velo:content-update" && data.content) {
        setContent(data.content as VelocityContent);
      }

      if (data.type === "velo:section-update" && data.section && data.data) {
        setContent((prev) => ({
          ...prev,
          [data.section]: data.data,
        }) as VelocityContent);
      }

      if (data.type === "velo:scroll-to" && data.section) {
        const el = document.querySelector(`.${data.section}-section`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", handler);

    // Notify parent that preview is ready
    window.parent.postMessage({ type: "velo:preview-ready" }, "*");

    return () => window.removeEventListener("message", handler);
  }, []);

  return { content, isPreview };
}

export function PageClient({ content: initialContent }: PageClientProps) {
  const { content, isPreview } = usePreviewMode(initialContent);
  useScrollEngine(scrollConfigs);

  return (
    <main>
      <Hero content={content.hero} />
      <ProductShowcase content={content.productShowcase} />
      <BrandStory content={content.brandStory} />
      <ProductGrid content={content.productGrid} />
      <Testimonials content={content.testimonials} variant="default" />
      <Footer content={content.footer} variant="default" localeSwitcher={isPreview ? undefined : <LocaleSwitcher />} />
    </main>
  );
}
