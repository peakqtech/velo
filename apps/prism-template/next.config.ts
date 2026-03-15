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
    "@velo/prism-hero",
    "@velo/prism-features",
    "@velo/prism-pricing",
    "@velo/prism-integrations",
    "@velo/prism-testimonials",
    "@velo/prism-faq",
    "@velo/prism-footer",
  ],
};

export default nextConfig;
