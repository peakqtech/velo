import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/integrations
export async function GET(
  req: Request,
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

  const integrations = await prisma.siteIntegration.findMany({
    where: { siteId: id },
  });

  return NextResponse.json(integrations);
}

// POST /api/sites/:id/integrations — enable/configure an integration
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { integration, enabled, config } = await req.json();

  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const result = await prisma.siteIntegration.upsert({
    where: { siteId_integration: { siteId: id, integration } },
    create: {
      siteId: id,
      integration,
      enabled: enabled ?? true,
      config: config || {},
    },
    update: { enabled: enabled ?? true, config: config || {} },
  });

  return NextResponse.json(result);
}
