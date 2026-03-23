import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites/:id/content
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
    select: { content: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  return NextResponse.json(site.content);
}

// PUT /api/sites/:id/content — update full content
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const content = await req.json();

  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const updated = await prisma.site.update({
    where: { id },
    data: { content },
  });

  return NextResponse.json(updated.content);
}

// PATCH /api/sites/:id/content — update a single section
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { sectionKey, data } = await req.json();

  if (!sectionKey) {
    return NextResponse.json(
      { error: "sectionKey is required" },
      { status: 400 }
    );
  }

  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const currentContent = (site.content as Record<string, unknown>) || {};
  const updatedContent = { ...currentContent, [sectionKey]: data };

  const updated = await prisma.site.update({
    where: { id },
    data: { content: updatedContent },
  });

  return NextResponse.json(updated.content);
}
