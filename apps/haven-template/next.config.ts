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
    "@velo/haven-hero",
    "@velo/haven-properties",
    "@velo/haven-amenities",
    "@velo/haven-virtual-tour",
    "@velo/haven-neighborhood",
    "@velo/haven-agent",
    "@velo/haven-footer",
  ],
};

export default nextConfig;
