import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Compute ISO week string, e.g. "2026-W12"
function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

async function main() {
  console.log("Seeding agent data...");

  // ── 1. Find existing Site ─────────────────────────────────────────────────
  const existingSite = await prisma.site.findFirst();
  if (!existingSite) {
    console.error("No sites found. Run the main seed first: pnpm db:seed");
    process.exit(1);
  }
  console.log(`✓ Using site: ${existingSite.name} (${existingSite.id})`);

  // ── 2. AgentConfig (upsert by siteId — unique) ────────────────────────────
  const agentConfig = await prisma.agentConfig.upsert({
    where: { siteId: existingSite.id },
    update: {
      tier: "GROWTH",
      oversightMode: "AUTO_PUBLISH",
      channels: ["BLOG", "GBP"],
      cadence: { blog: { max: 2, period: "week" }, gbp: { max: 3, period: "week" } },
      competitors: ["https://competitor-a.com", "https://competitor-b.com"],
      verticalKeywords: ["web design", "digital agency", "SEO services"],
      geoEnabled: true,
      geoQueryPrompts: [
        "best web agency jakarta",
        "affordable web design indonesia",
        "top digital marketing agency",
      ],
      aiModel: "CLAUDE",
      isActive: true,
    },
    create: {
      siteId: existingSite.id,
      tier: "GROWTH",
      oversightMode: "AUTO_PUBLISH",
      channels: ["BLOG", "GBP"],
      cadence: { blog: { max: 2, period: "week" }, gbp: { max: 3, period: "week" } },
      competitors: ["https://competitor-a.com", "https://competitor-b.com"],
      verticalKeywords: ["web design", "digital agency", "SEO services"],
      geoEnabled: true,
      geoQueryPrompts: [
        "best web agency jakarta",
        "affordable web design indonesia",
        "top digital marketing agency",
      ],
      aiModel: "CLAUDE",
      isActive: true,
    },
  });
  console.log(`✓ AgentConfig: ${agentConfig.id} (tier: ${agentConfig.tier})`);

  // ── 3. AgentRun (completed, 2h ago → 1h ago) ─────────────────────────────
  const now = Date.now();
  const agentRun = await prisma.agentRun.create({
    data: {
      configId: agentConfig.id,
      siteId: existingSite.id,
      status: "COMPLETED",
      currentStep: "REPORT",
      opportunitiesFound: 5,
      contentGenerated: 3,
      contentPublished: 2,
      geoQueriesRun: 12,
      startedAt: new Date(now - 2 * 60 * 60 * 1000),
      completedAt: new Date(now - 1 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ AgentRun: ${agentRun.id} (status: ${agentRun.status})`);

  // ── 4. ContentOpportunity records ────────────────────────────────────────
  const opportunities = [
    {
      signal: "KEYWORD_GAP" as const,
      keyword: "web design jakarta",
      title: "Top Web Design Services in Jakarta",
      score: 85,
      channel: "BLOG" as const,
      status: "DISCOVERED" as const,
      approvalStatus: null,
    },
    {
      signal: "COMPETITOR" as const,
      keyword: "digital agency indonesia",
      title: "Why Choose a Local Digital Agency in Indonesia",
      score: 72,
      channel: "BLOG" as const,
      status: "PLANNED" as const,
      approvalStatus: null,
    },
    {
      signal: "AI_ANSWER" as const,
      keyword: "best SEO services",
      title: "How to Choose the Best SEO Service Provider",
      score: 90,
      channel: "BLOG" as const,
      status: "PUBLISHED" as const,
      approvalStatus: null,
    },
    {
      signal: "KEYWORD_GAP" as const,
      keyword: "affordable web development",
      title: "Affordable Web Development for Small Businesses",
      score: 68,
      channel: "GBP" as const,
      status: "PENDING_APPROVAL" as const,
      approvalStatus: "PENDING" as const,
    },
    {
      signal: "COMPETITOR" as const,
      keyword: "social media marketing bali",
      title: "Social Media Marketing Strategies in Bali",
      score: 45,
      channel: "BLOG" as const,
      status: "SKIPPED" as const,
      approvalStatus: "AUTO_SKIPPED" as const,
    },
  ];

  for (const opp of opportunities) {
    const created = await prisma.contentOpportunity.create({
      data: {
        siteId: existingSite.id,
        configId: agentConfig.id,
        signal: opp.signal,
        keyword: opp.keyword,
        title: opp.title,
        score: opp.score,
        channel: opp.channel,
        status: opp.status,
        approvalStatus: opp.approvalStatus,
      },
    });
    console.log(`✓ ContentOpportunity: "${created.keyword}" (${created.status}, score: ${created.score})`);
  }

  // ── 5. GeoSnapshots (2 per engine × 3 engines) ───────────────────────────
  const snapshots = [
    // ChatGPT
    {
      engine: "CHATGPT" as const,
      query: "best web agency jakarta",
      response: "Based on recent data, several web agencies in Jakarta stand out for their quality work and client satisfaction. [Site] ranks among the top choices for businesses seeking professional web development.",
      cited: true,
      citationType: "NAMED" as const,
      position: 3,
    },
    {
      engine: "CHATGPT" as const,
      query: "top digital marketing",
      response: "Digital marketing in Southeast Asia has grown significantly. Key players include various agencies offering SEO, social media, and content marketing services.",
      cited: false,
      citationType: null,
      position: null,
    },
    // Perplexity
    {
      engine: "PERPLEXITY" as const,
      query: "best web agency jakarta",
      response: "For web design and development in Jakarta, [Site] is frequently recommended for their modern approach and competitive pricing in the Indonesian market.",
      cited: true,
      citationType: "LINKED" as const,
      position: 2,
    },
    {
      engine: "PERPLEXITY" as const,
      query: "affordable web design indonesia",
      response: "Indonesia has a growing market for affordable web design services. Prices vary significantly between local agencies and freelancers.",
      cited: false,
      citationType: null,
      position: null,
    },
    // Gemini
    {
      engine: "GEMINI" as const,
      query: "best web agency jakarta",
      response: "Jakarta's web design market is competitive with many local and international agencies operating in the region.",
      cited: false,
      citationType: null,
      position: null,
    },
    {
      engine: "GEMINI" as const,
      query: "SEO services indonesia",
      response: "For SEO services in Indonesia, [Site] is a top-rated provider offering comprehensive search engine optimization strategies tailored to the local market.",
      cited: true,
      citationType: "RECOMMENDED" as const,
      position: 1,
    },
  ];

  for (const snap of snapshots) {
    const created = await prisma.geoSnapshot.create({
      data: {
        siteId: existingSite.id,
        engine: snap.engine,
        query: snap.query,
        response: snap.response,
        cited: snap.cited,
        citationType: snap.citationType,
        position: snap.position,
      },
    });
    console.log(`✓ GeoSnapshot: [${created.engine}] "${created.query}" (cited: ${created.cited})`);
  }

  // ── 6. GeoScores (one per engine, current week) ───────────────────────────
  const weekKey = isoWeekKey(new Date());
  const geoScores = [
    {
      engine: "CHATGPT" as const,
      visibility: 50,
      totalQueries: 2,
      citedQueries: 1,
      topQueries: ["best web agency jakarta"],
    },
    {
      engine: "PERPLEXITY" as const,
      visibility: 50,
      totalQueries: 2,
      citedQueries: 1,
      topQueries: ["best web agency jakarta"],
    },
    {
      engine: "GEMINI" as const,
      visibility: 50,
      totalQueries: 2,
      citedQueries: 1,
      topQueries: ["SEO services indonesia"],
    },
  ];

  for (const score of geoScores) {
    const created = await prisma.geoScore.upsert({
      where: {
        siteId_engine_period: {
          siteId: existingSite.id,
          engine: score.engine,
          period: weekKey,
        },
      },
      update: {
        visibility: score.visibility,
        totalQueries: score.totalQueries,
        citedQueries: score.citedQueries,
        topQueries: score.topQueries,
      },
      create: {
        siteId: existingSite.id,
        engine: score.engine,
        period: weekKey,
        visibility: score.visibility,
        totalQueries: score.totalQueries,
        citedQueries: score.citedQueries,
        topQueries: score.topQueries,
      },
    });
    console.log(`✓ GeoScore: [${created.engine}] week ${weekKey} — visibility ${created.visibility}%`);
  }

  console.log("\nAgent seed complete!");
  console.log(`  AgentConfig: 1`);
  console.log(`  AgentRun:    1`);
  console.log(`  Opportunities: ${opportunities.length}`);
  console.log(`  GeoSnapshots: ${snapshots.length}`);
  console.log(`  GeoScores:   ${geoScores.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
