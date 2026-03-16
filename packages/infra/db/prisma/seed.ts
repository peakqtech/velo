import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const passwordHash = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@velo.dev" },
    update: {},
    create: {
      email: "demo@velo.dev",
      name: "Yohanes",
      passwordHash,
      role: "OWNER",
    },
  });
  console.log(`✓ User: ${user.email}`);

  // Create demo site with Velocity content
  const site = await prisma.site.upsert({
    where: { slug: "velocity-demo" },
    update: {},
    create: {
      name: "Velocity Demo",
      slug: "velocity-demo",
      template: "velocity",
      ownerId: user.id,
      deployStatus: "DEPLOYED",
      content: {
        hero: {
          headline: "Run Faster. Go Further.",
          tagline: "Premium athletic wear engineered for peak performance",
          cta: { label: "Shop Now", href: "/shop" },
          media: { type: "video", src: "/videos/hero.mp4", poster: "/images/hero-poster.jpg", alt: "Athletes running" },
          overlay: { opacity: 0.4, gradient: "linear-gradient(to bottom, transparent, black)" },
        },
        productShowcase: {
          title: "Featured Collection",
          subtitle: "Engineered for champions",
          products: [
            { name: "Velocity Pro", image: "/images/shoe-1.jpg", alt: "Running shoe", features: [] },
            { name: "Aero Jacket", image: "/images/jacket-1.jpg", alt: "Lightweight jacket", features: [] },
          ],
        },
        testimonials: {
          heading: "What Athletes Say",
          testimonials: [
            { quote: "Best running gear I've ever owned.", author: "Sarah K.", role: "Marathon Runner", avatar: "/images/avatar-1.jpg", avatarAlt: "Sarah" },
            { quote: "The quality is unmatched.", author: "Marcus L.", role: "Sprinter", avatar: "/images/avatar-2.jpg", avatarAlt: "Marcus" },
          ],
        },
        footer: {
          brand: { name: "Velocity", logo: "/images/velocity-logo.svg" },
          newsletter: { heading: "Stay in the race", placeholder: "Enter your email", cta: "Subscribe" },
          socials: [
            { platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
            { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
          ],
          links: [
            { group: "Shop", items: [{ label: "Running", href: "/running" }, { label: "Training", href: "/training" }] },
            { group: "Company", items: [{ label: "About", href: "/about" }, { label: "Careers", href: "/careers" }] },
          ],
          legal: "© 2026 Velocity Athletics",
        },
        metadata: {
          title: "Velocity — Premium Athletic Wear",
          description: "Premium athletic wear engineered for peak performance",
          ogImage: "/images/og-image.jpg",
        },
      },
    },
  });
  console.log(`✓ Site: ${site.name} (${site.slug})`);

  // Enable some integrations
  const integrations = [
    { integration: "@velo/integration-analytics", config: { provider: "plausible", plausibleDomain: "velocity-demo.velo.dev" } },
    { integration: "@velo/integration-forms", config: { notificationEmail: "demo@velo.dev", submitSuccessMessage: "Thanks! We'll be in touch." } },
    { integration: "@velo/integration-whatsapp", config: { phoneNumber: "+6281234567890", defaultMessage: "Hi! I'm interested in your products." } },
  ];

  for (const integ of integrations) {
    await prisma.siteIntegration.upsert({
      where: { siteId_integration: { siteId: site.id, integration: integ.integration } },
      update: { config: integ.config },
      create: { siteId: site.id, integration: integ.integration, enabled: true, config: integ.config },
    });
    console.log(`✓ Integration: ${integ.integration}`);
  }

  // Add a demo QA report
  await prisma.qAReport.create({
    data: {
      siteId: site.id,
      healthScore: 87,
      report: {
        url: "https://velocity-demo.velo.dev",
        timestamp: new Date().toISOString(),
        healthScore: 87,
        totalIssues: 4,
        audits: [
          { name: "lighthouse", score: 92, issues: [] },
          { name: "accessibility", score: 85, issues: [{ severity: "warning", message: "Low contrast ratio on footer links" }] },
          { name: "links", score: 95, issues: [] },
          { name: "meta", score: 75, issues: [{ severity: "warning", message: "Missing og:description" }, { severity: "info", message: "Consider adding structured data" }] },
        ],
      },
    },
  });
  console.log("✓ QA Report seeded");

  console.log("\nDone! Login with: demo@velo.dev / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
