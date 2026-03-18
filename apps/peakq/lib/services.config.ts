export interface ServiceConfig {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  capabilities: string[];
}

export const services: ServiceConfig[] = [
  {
    slug: "qa-testing",
    name: "QA & Testing",
    shortDescription: "Comprehensive quality assurance for software products",
    description:
      "Our roots are in quality. We offer functional testing, automation testing, performance testing, and security testing — with the same rigor we apply to our own platform.",
    capabilities: [
      "Functional Testing",
      "Test Automation",
      "Performance Testing",
      "Security Testing",
      "QA Strategy Consulting",
    ],
  },
  {
    slug: "custom-development",
    name: "Custom Development",
    shortDescription: "Tailored integrations and platform extensions",
    description:
      "Need something beyond what the platform offers out of the box? Our team builds custom integrations, workflows, and features on top of the PeakQ platform.",
    capabilities: [
      "Custom Integrations",
      "API Development",
      "Platform Extensions",
      "Data Migration",
      "Third-party Connectors",
    ],
  },
  {
    slug: "managed-services",
    name: "Managed Services",
    shortDescription: "Hands-off management of your entire platform",
    description:
      "We built the platform — we know it inside out. Let our team manage your content, SEO, and campaigns so you can focus on running your business.",
    capabilities: [
      "Content Management",
      "SEO Campaign Management",
      "Analytics & Reporting",
      "Platform Monitoring",
      "Ongoing Optimization",
    ],
  },
];
