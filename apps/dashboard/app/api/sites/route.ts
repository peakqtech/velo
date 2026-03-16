import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

// GET /api/sites — list user's sites
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sites = await prisma.site.findMany({
    where: { ownerId: session.user.id },
    include: {
      integrations: true,
      _count: { select: { qaReports: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(sites);
}

// POST /api/sites — create a new site
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, template, content } = await req.json();

  if (!name || !template) {
    return NextResponse.json(
      { error: "Name and template are required" },
      { status: 400 }
    );
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existingSlug = await prisma.site.findUnique({ where: { slug } });
  if (existingSlug) {
    return NextResponse.json(
      { error: "A site with this name already exists" },
      { status: 409 }
    );
  }

  const site = await prisma.site.create({
    data: {
      name,
      slug,
      template,
      content: content || {},
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(site, { status: 201 });
}
