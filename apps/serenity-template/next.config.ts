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
    "@velocity/serenity-hero",
    "@velocity/serenity-services",
    "@velocity/serenity-process",
    "@velocity/serenity-practitioners",
    "@velocity/serenity-testimonials",
    "@velocity/serenity-booking",
    "@velocity/serenity-footer",
  ],
};

export default nextConfig;
