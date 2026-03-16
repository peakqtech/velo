import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  turbopack: { root: monorepoRoot },
  images: { unoptimized: true },
  transpilePackages: [
    "@velo/types",
    "@velo/scroll-engine",
    "@velo/animations",
    "@velo/motion-components",
    "@velo/i18n",
    "@velo/ember-hero",
    "@velo/ember-menu",
    "@velo/ember-chef",
    "@velo/ember-reservation",
    "@velo/ember-gallery",
    "@velo/ember-testimonials",
    "@velo/ember-footer",
  ],
};

export default nextConfig;
