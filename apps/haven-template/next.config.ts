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
    "@velocity/haven-hero",
    "@velocity/haven-properties",
    "@velocity/haven-amenities",
    "@velocity/haven-virtual-tour",
    "@velocity/haven-neighborhood",
    "@velocity/haven-agent",
    "@velocity/haven-footer",
  ],
};

export default nextConfig;
