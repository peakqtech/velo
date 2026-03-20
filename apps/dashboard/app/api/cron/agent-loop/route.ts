import { NextResponse } from "next/server";
import { prisma } from "@velo/db";
import { AgentLoop, LockManager } from "@velo/seo-agent";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

// POST /api/cron/agent-loop — secured cron trigger
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const singleSiteId = url.searchParams.get("siteId");

  try {
    const configs = await prisma.agentConfig.findMany({
      where: {
        isActive: true,
        ...(singleSiteId ? { siteId: singleSiteId } : {}),
      },
      include: { site: { select: { id: true, name: true, domain: true } } },
    });

    if (configs.length === 0) {
      return NextResponse.json({ message: "No active configs found", runs: [] });
    }

    const lockManager = new LockManager(prisma);

    const results = await Promise.allSettled(
      configs.map(async (config) => {
        const loop = new AgentLoop({
          prisma,
          lockManager,
          siteId: config.siteId,
          configId: config.id,
        });
        return loop.run();
      })
    );

    const summary = results.map((result, i) => ({
      siteId: configs[i].siteId,
      siteName: configs[i].site.name,
      status: result.status,
      ...(result.status === "fulfilled"
        ? { result: result.value }
        : { error: String(result.reason) }),
    }));

    return NextResponse.json({
      message: `Processed ${configs.length} site(s)`,
      runs: summary,
    });
  } catch (error) {
    console.error("[cron/agent-loop] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
