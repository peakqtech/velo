import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { z } from "zod";

const configSchema = z.object({
  tier: z.enum(["STARTER", "GROWTH", "SCALE", "ENTERPRISE"]),
  oversightMode: z
    .enum(["AUTO_PUBLISH", "VETO_WINDOW", "APPROVAL_REQUIRED"])
    .optional(),
  vetoWindowHours: z.number().int().min(1).max(168).optional(),
  channels: z
    .array(z.enum(["BLOG", "GBP", "SOCIAL", "EMAIL"]))
    .min(1),
  cadence: z.record(z.any()),
  competitors: z.array(z.string()).optional(),
  verticalKeywords: z.array(z.string()).optional(),
  geoEnabled: z.boolean().optional(),
  geoQueryPrompts: z.array(z.string()).optional(),
  aiModel: z.enum(["CLAUDE", "OPENAI", "GEMINI"]).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/sites/:id/agent/config
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const config = await prisma.agentConfig.findUnique({
    where: { siteId: id },
  });

  if (!config) {
    return NextResponse.json(null);
  }

  return NextResponse.json(config);
}

// POST /api/sites/:id/agent/config — create or update
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = configSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const config = await prisma.agentConfig.upsert({
    where: { siteId: id },
    create: {
      siteId: id,
      tier: data.tier,
      oversightMode: data.oversightMode ?? "AUTO_PUBLISH",
      vetoWindowHours: data.vetoWindowHours ?? 24,
      channels: data.channels,
      cadence: data.cadence,
      competitors: data.competitors ?? [],
      verticalKeywords: data.verticalKeywords ?? [],
      geoEnabled: data.geoEnabled ?? false,
      geoQueryPrompts: data.geoQueryPrompts ?? [],
      aiModel: data.aiModel ?? "CLAUDE",
      isActive: data.isActive ?? true,
    },
    update: {
      tier: data.tier,
      oversightMode: data.oversightMode,
      vetoWindowHours: data.vetoWindowHours,
      channels: data.channels,
      cadence: data.cadence,
      competitors: data.competitors,
      verticalKeywords: data.verticalKeywords,
      geoEnabled: data.geoEnabled,
      geoQueryPrompts: data.geoQueryPrompts,
      aiModel: data.aiModel,
      isActive: data.isActive,
    },
  });

  return NextResponse.json(config, { status: 200 });
}
