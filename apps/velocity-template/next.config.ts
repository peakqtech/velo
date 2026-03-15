import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  images: {
    unoptimized: true,
  },
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
