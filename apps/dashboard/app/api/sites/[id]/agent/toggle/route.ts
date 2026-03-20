import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// POST /api/sites/:id/agent/toggle — toggle isActive
export async function POST(
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
    return NextResponse.json(
      { error: "Agent config not found. Configure the agent first." },
      { status: 404 }
    );
  }

  const updated = await prisma.agentConfig.update({
    where: { siteId: id },
    data: { isActive: !config.isActive },
  });

  return NextResponse.json({ isActive: updated.isActive });
}
