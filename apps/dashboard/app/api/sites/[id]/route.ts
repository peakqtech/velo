import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id
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
    include: { integrations: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  return NextResponse.json(site);
}

// PUT /api/sites/:id — update site settings
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const updated = await prisma.site.update({
    where: { id },
    data: {
      name: body.name ?? site.name,
      domain: body.domain ?? site.domain,
      siteUrl: body.siteUrl !== undefined ? body.siteUrl : site.siteUrl,
      deployStatus: body.deployStatus ?? site.deployStatus,
      themeOverrides: body.themeOverrides ?? site.themeOverrides,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/sites/:id
export async function DELETE(
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

  await prisma.site.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
