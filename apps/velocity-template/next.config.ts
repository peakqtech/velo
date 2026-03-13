import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@velocity/types",
    "@velocity/scroll-engine",
    "@velocity/animations",
    "@velocity/motion-components",
    "@velocity/i18n",
    "@velocity/ui",
    "@velocity/hero",
    "@velocity/product-showcase",
    "@velocity/brand-story",
    "@velocity/product-grid",
    "@velocity/testimonials",
    "@velocity/footer",
  ],
};

export default nextConfig;
