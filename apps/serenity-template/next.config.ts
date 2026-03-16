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
    "@velo/serenity-hero",
    "@velo/serenity-services",
    "@velo/serenity-process",
    "@velo/serenity-practitioners",
    "@velo/serenity-testimonials",
    "@velo/serenity-booking",
    "@velo/serenity-footer",
  ],
};

export default nextConfig;
