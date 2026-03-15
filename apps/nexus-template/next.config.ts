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
    "@velocity/nexus-hero",
    "@velocity/nexus-services",
    "@velocity/nexus-case-studies",
    "@velocity/nexus-team",
    "@velocity/nexus-stats",
    "@velocity/nexus-contact",
    "@velocity/nexus-footer",
  ],
};

export default nextConfig;
