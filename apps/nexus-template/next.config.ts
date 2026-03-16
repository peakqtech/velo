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
    "@velo/nexus-hero",
    "@velo/nexus-services",
    "@velo/nexus-case-studies",
    "@velo/nexus-team",
    "@velo/nexus-stats",
    "@velo/nexus-contact",
    "@velo/nexus-footer",
  ],
};

export default nextConfig;
