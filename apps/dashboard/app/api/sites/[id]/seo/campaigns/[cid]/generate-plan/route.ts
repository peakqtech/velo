import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { ClaudeAdapter, CampaignPlanner } from "@velo/seo-engine";

// POST /api/sites/:id/seo/campaigns/:cid/generate-plan
// Synchronous — user waits in the wizard for the plan to be returned.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; cid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, cid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: cid, siteId: id },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { keywords, vertical, businessName, location } = body;

  const schedule = campaign.schedule as {
    startDate?: string;
    endDate?: string;
    frequency?: string;
  };

  try {
    const adapter = new ClaudeAdapter(apiKey);
    const planner = new CampaignPlanner(adapter);

    const plan = await planner.generatePlan({
      campaignName: campaign.name,
      goal: campaign.goal ?? "",
      channels: campaign.channels as string[],
      keywords: Array.isArray(keywords) ? keywords : [],
      frequency: schedule.frequency ?? "WEEKLY",
      startDate: schedule.startDate ?? new Date().toISOString().split("T")[0],
      endDate: schedule.endDate ?? "",
      vertical: vertical ?? "",
      businessName: businessName ?? site.name,
      location: location ?? "",
    });

    return NextResponse.json(plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to generate plan", details: message },
      { status: 500 }
    );
  }
}
