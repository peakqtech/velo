import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  turbopack: { root: monorepoRoot },
  images: { unoptimized: true },
  transpilePackages: [
    "@velocity/types",
    "@velocity/scroll-engine",
    "@velocity/animations",
    "@velocity/motion-components",
    "@velocity/i18n",
    "@velocity/ember-hero",
    "@velocity/ember-menu",
    "@velocity/ember-chef",
    "@velocity/ember-reservation",
    "@velocity/ember-gallery",
    "@velocity/ember-testimonials",
    "@velocity/ember-footer",
  ],
};

export default nextConfig;
