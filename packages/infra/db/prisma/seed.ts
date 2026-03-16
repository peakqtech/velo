import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function fullVelocityContent() {
  return {
    hero: {
      headline: "Break Every Limit",
      tagline: "Engineered for athletes who refuse to stop.",
      cta: { label: "Shop Now", href: "#products" },
      media: { type: "image", src: "/images/hero-placeholder.jpg", poster: "/images/hero-poster.jpg", alt: "Athlete sprinting in Velocity gear" },
      overlay: { opacity: 0.4, gradient: "linear-gradient(to bottom, transparent, black)" },
    },
    productShowcase: {
      title: "The Apex Runner",
      subtitle: "Our most advanced running shoe yet.",
      products: [{
        name: "Apex Runner Pro", image: "/images/shoe-placeholder.png", alt: "Velocity Apex Runner Pro in black and red",
        features: [
          { label: "Carbon Plate", position: { x: 30, y: 60 } },
          { label: "React Foam", position: { x: 70, y: 80 } },
          { label: "Breathable Mesh", position: { x: 50, y: 30 } },
        ],
      }],
    },
    brandStory: {
      chapters: [
        { heading: "Born on the Track", body: "Velocity started with a simple belief: every athlete deserves equipment that keeps up with their ambition.", media: { type: "image", src: "/images/story-1.jpg", alt: "Track and field at sunrise" }, layout: "left" },
        { heading: "Tested by Champions", body: "From Olympic trials to neighborhood 5Ks, our gear is battle-tested at every level of competition.", media: { type: "image", src: "/images/story-2.jpg", alt: "Athletes competing in Velocity gear" }, layout: "left" },
        { heading: "Built for Tomorrow", body: "Sustainable materials. Zero-waste manufacturing. Performance that does not cost the planet.", media: { type: "image", src: "/images/story-3.jpg", alt: "Sustainable manufacturing facility" }, layout: "full" },
      ],
    },
    productGrid: {
      heading: "Shop the Collection",
      categories: ["All", "Running", "Training", "Lifestyle"],
      products: [
        { name: "Apex Runner Pro", price: { amount: 180, currency: "USD" }, image: "/images/product-1.jpg", alt: "Apex Runner Pro shoe", category: "Running", badge: "New" },
        { name: "Velocity Trainer X", price: { amount: 140, currency: "USD" }, image: "/images/product-2.jpg", alt: "Velocity Trainer X shoe", category: "Training" },
        { name: "Street Glide", price: { amount: 120, currency: "USD" }, image: "/images/product-3.jpg", alt: "Street Glide casual shoe", category: "Lifestyle" },
        { name: "Sprint Elite", price: { amount: 200, currency: "USD" }, image: "/images/product-4.jpg", alt: "Sprint Elite racing shoe", category: "Running", badge: "Pro" },
        { name: "Power Lift", price: { amount: 160, currency: "USD" }, image: "/images/product-5.jpg", alt: "Power Lift training shoe", category: "Training" },
        { name: "Urban Flow", price: { amount: 110, currency: "USD" }, image: "/images/product-6.jpg", alt: "Urban Flow lifestyle sneaker", category: "Lifestyle" },
      ],
    },
    testimonials: {
      heading: "Athletes Speak",
      testimonials: [
        { quote: "The Apex Runner changed my race day. I PR'd by 3 minutes.", author: "Sarah Chen", role: "Marathon Runner", avatar: "/images/avatar-1.jpg", avatarAlt: "Sarah Chen portrait" },
        { quote: "Most comfortable training shoe I have ever worn. Period.", author: "Marcus Williams", role: "CrossFit Athlete", avatar: "/images/avatar-2.jpg", avatarAlt: "Marcus Williams portrait" },
        { quote: "Finally a brand that understands what sprinters need.", author: "Aisha Okafor", role: "100m Sprinter", avatar: "/images/avatar-3.jpg", avatarAlt: "Aisha Okafor portrait" },
      ],
    },
    footer: {
      brand: { name: "Velocity", logo: "/images/velocity-logo.svg" },
      newsletter: { heading: "Stay in the race", placeholder: "Enter your email", cta: "Subscribe" },
      socials: [
        { platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
        { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
        { platform: "YouTube", url: "https://youtube.com", icon: "youtube" },
      ],
      links: [
        { group: "Shop", items: [{ label: "Running", href: "#" }, { label: "Training", href: "#" }, { label: "Lifestyle", href: "#" }] },
        { group: "Company", items: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
        { group: "Support", items: [{ label: "FAQ", href: "#" }, { label: "Shipping", href: "#" }, { label: "Returns", href: "#" }] },
      ],
      legal: "© 2026 Velocity Athletics. All rights reserved.",
    },
    metadata: {
      title: "Velocity — Athletic Performance Redefined",
      description: "Premium athletic wear engineered for peak performance.",
      ogImage: "/images/og-image.jpg",
    },
  };
}

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

  // Create demo site with FULL Velocity content (matches velocity-template/content/en/velocity.ts)
  const site = await prisma.site.upsert({
    where: { slug: "velocity-demo" },
    update: {
      content: fullVelocityContent(),
    },
    create: {
      name: "Velocity Demo",
      slug: "velocity-demo",
      template: "velocity",
      ownerId: user.id,
      deployStatus: "DEPLOYED",
      content: fullVelocityContent(),
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
