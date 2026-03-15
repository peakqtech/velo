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
    "@velocity/prism-hero",
    "@velocity/prism-features",
    "@velocity/prism-pricing",
    "@velocity/prism-integrations",
    "@velocity/prism-testimonials",
    "@velocity/prism-faq",
    "@velocity/prism-footer",
  ],
};

export default nextConfig;
