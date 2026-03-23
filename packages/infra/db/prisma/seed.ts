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

  // ─── Client 1: Sushi Masa ─────────────────────────────────────────
  const sushiMasa = await prisma.client.upsert({
    where: { id: "client-sushi-masa" },
    update: {
      name: "Sushi Masa",
      contactPerson: "Takeshi Yamamoto",
      email: "takeshi@sushimasa.id",
      phone: "+62 812 3456 7890",
      whatsapp: "+62 812 3456 7890",
      plan: "PREMIUM",
      monthlyPrice: 2000000,
      currency: "IDR",
      paymentStatus: "PAID",
      lastPaymentDate: new Date("2026-03-01"),
      paymentDueDate: new Date("2026-04-01"),
    },
    create: {
      id: "client-sushi-masa",
      name: "Sushi Masa",
      contactPerson: "Takeshi Yamamoto",
      email: "takeshi@sushimasa.id",
      phone: "+62 812 3456 7890",
      whatsapp: "+62 812 3456 7890",
      plan: "PREMIUM",
      monthlyPrice: 2000000,
      currency: "IDR",
      paymentStatus: "PAID",
      lastPaymentDate: new Date("2026-03-01"),
      paymentDueDate: new Date("2026-04-01"),
      notes: "Japanese restaurant in Seminyak. Premium client since Jan 2026.",
    },
  });
  console.log(`✓ Client: ${sushiMasa.name}`);

  // Create demo site linked to Sushi Masa
  const site = await prisma.site.upsert({
    where: { slug: "velocity-demo" },
    update: {
      content: fullVelocityContent(),
      clientId: sushiMasa.id,
    },
    create: {
      name: "Velocity Demo",
      slug: "velocity-demo",
      template: "velocity",
      ownerId: user.id,
      clientId: sushiMasa.id,
      deployStatus: "DEPLOYED",
      content: fullVelocityContent(),
    },
  });
  console.log(`✓ Site: ${site.name} (${site.slug}) → ${sushiMasa.name}`);

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
  const existingQA = await prisma.qAReport.findFirst({ where: { siteId: site.id } });
  if (!existingQA) {
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
  }

  // Sushi Masa change requests
  const sushiChanges = [
    {
      id: "cr-sushi-1",
      title: "Update hero banner with new seasonal menu",
      description: "Replace the current hero image with the spring omakase menu promotion. Client provided new photos via WhatsApp.",
      priority: "normal",
      status: "DONE" as const,
      requestedAt: new Date("2026-02-20"),
      completedAt: new Date("2026-02-22"),
    },
    {
      id: "cr-sushi-2",
      title: "Add reservation deposit feature",
      description: "Client wants to require Rp 100,000 deposit per person for weekend dinner reservations to reduce no-shows.",
      priority: "high",
      status: "IN_PROGRESS" as const,
      requestedAt: new Date("2026-03-10"),
    },
    {
      id: "cr-sushi-3",
      title: "Update footer with new Instagram handle",
      description: "Changed Instagram from @sushimasa to @sushimasa.bali. Update footer social links.",
      priority: "low",
      status: "PENDING" as const,
      requestedAt: new Date("2026-03-14"),
    },
  ];

  for (const cr of sushiChanges) {
    await prisma.changeRequest.upsert({
      where: { id: cr.id },
      update: { status: cr.status, completedAt: cr.completedAt },
      create: {
        id: cr.id,
        clientId: sushiMasa.id,
        siteId: site.id,
        title: cr.title,
        description: cr.description,
        priority: cr.priority,
        status: cr.status,
        requestedAt: cr.requestedAt,
        completedAt: cr.completedAt ?? null,
      },
    });
  }
  console.log(`✓ ${sushiChanges.length} change requests for ${sushiMasa.name}`);

  // Sushi Masa invoices
  const sushiInvoices = [
    {
      id: "inv-sushi-1",
      amount: 2000000,
      currency: "IDR",
      period: "2026-02",
      status: "PAID" as const,
      dueDate: new Date("2026-03-01"),
      paidDate: new Date("2026-03-01"),
    },
    {
      id: "inv-sushi-2",
      amount: 2000000,
      currency: "IDR",
      period: "2026-03",
      status: "SENT" as const,
      dueDate: new Date("2026-04-01"),
      paidDate: null,
    },
  ];

  for (const inv of sushiInvoices) {
    await prisma.invoice.upsert({
      where: { id: inv.id },
      update: { status: inv.status, paidDate: inv.paidDate },
      create: {
        id: inv.id,
        clientId: sushiMasa.id,
        amount: inv.amount,
        currency: inv.currency,
        period: inv.period,
        status: inv.status,
        dueDate: inv.dueDate,
        paidDate: inv.paidDate,
      },
    });
  }
  console.log(`✓ ${sushiInvoices.length} invoices for ${sushiMasa.name}`);

  // ─── Client 2: Bali Zen Spa ───────────────────────────────────────
  const baliZenSpa = await prisma.client.upsert({
    where: { id: "client-bali-zen-spa" },
    update: {
      name: "Bali Zen Spa",
      contactPerson: "Made Suryani",
      email: "suryani@balizenspa.com",
      plan: "BASIC",
      monthlyPrice: 1500000,
      paymentStatus: "PAID",
    },
    create: {
      id: "client-bali-zen-spa",
      name: "Bali Zen Spa",
      contactPerson: "Made Suryani",
      email: "suryani@balizenspa.com",
      phone: "+62 817 5551234",
      whatsapp: "+62 817 5551234",
      plan: "BASIC",
      monthlyPrice: 1500000,
      currency: "IDR",
      paymentStatus: "PAID",
      lastPaymentDate: new Date("2026-03-05"),
      paymentDueDate: new Date("2026-04-05"),
      notes: "Wellness spa in Ubud. New client, building first site.",
    },
  });
  console.log(`✓ Client: ${baliZenSpa.name}`);

  // Bali Zen Spa change request
  await prisma.changeRequest.upsert({
    where: { id: "cr-bali-1" },
    update: {},
    create: {
      id: "cr-bali-1",
      clientId: baliZenSpa.id,
      title: "Design spa treatment menu page",
      description: "Client wants a dedicated page showing all spa treatments with prices, durations, and booking links. Provided a PDF with all treatments.",
      priority: "normal",
      status: "PENDING",
      requestedAt: new Date("2026-03-12"),
    },
  });
  console.log(`✓ 1 change request for ${baliZenSpa.name}`);

  // Bali Zen Spa invoice
  await prisma.invoice.upsert({
    where: { id: "inv-bali-1" },
    update: {},
    create: {
      id: "inv-bali-1",
      clientId: baliZenSpa.id,
      amount: 1500000,
      currency: "IDR",
      period: "2026-03",
      status: "PAID",
      dueDate: new Date("2026-04-05"),
      paidDate: new Date("2026-03-05"),
    },
  });
  console.log(`✓ 1 invoice for ${baliZenSpa.name}`);

  // ─── Client 3: Rumah Impian Properties ────────────────────────────
  const rumahImpian = await prisma.client.upsert({
    where: { id: "client-rumah-impian" },
    update: {
      name: "Rumah Impian Properties",
      contactPerson: "Budi Santoso",
      email: "budi@rumahimpian.co.id",
      plan: "ENTERPRISE",
      monthlyPrice: 5000000,
      paymentStatus: "OVERDUE",
    },
    create: {
      id: "client-rumah-impian",
      name: "Rumah Impian Properties",
      contactPerson: "Budi Santoso",
      email: "budi@rumahimpian.co.id",
      phone: "+62 811 2223344",
      whatsapp: "+62 811 2223344",
      plan: "ENTERPRISE",
      monthlyPrice: 5000000,
      currency: "IDR",
      paymentStatus: "OVERDUE",
      paymentDueDate: new Date("2026-03-01"),
      notes: "Real estate company in Jakarta. Enterprise plan with custom property listing features. Payment overdue — follow up with Budi.",
    },
  });
  console.log(`✓ Client: ${rumahImpian.name}`);

  // Rumah Impian overdue invoice
  await prisma.invoice.upsert({
    where: { id: "inv-rumah-1" },
    update: { status: "OVERDUE" },
    create: {
      id: "inv-rumah-1",
      clientId: rumahImpian.id,
      amount: 5000000,
      currency: "IDR",
      period: "2026-03",
      status: "OVERDUE",
      dueDate: new Date("2026-03-01"),
      paidDate: null,
      notes: "Sent reminder on March 10. Client asked for extension until March 20.",
    },
  });
  console.log(`✓ 1 invoice for ${rumahImpian.name}`);

  console.log("\nDone! Login with: demo@velo.dev / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
