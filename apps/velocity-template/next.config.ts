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
    "@velo/types",
    "@velo/scroll-engine",
    "@velo/animations",
    "@velo/motion-components",
    "@velo/i18n",
    "@velo/ui",
    "@velo/hero",
    "@velo/product-showcase",
    "@velo/brand-story",
    "@velo/product-grid",
    "@velo/testimonials",
    "@velo/footer",
    "@velo/blog",
  ],
};

export default nextConfig;
