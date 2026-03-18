import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import {
  generateMDX,
  commitMDXToGitHub,
  writeMDXLocal,
  decrypt,
} from "@velo/seo-engine";
import type { BlogContent } from "@velo/seo-engine";

// POST /api/sites/:id/seo/content/:pid/publish
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; pid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, pid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const piece = await prisma.contentPiece.findFirst({
    where: { id: pid, siteId: id },
    include: { campaign: true },
  });
  if (!piece) {
    return NextResponse.json({ error: "Content piece not found" }, { status: 404 });
  }

  if (piece.status !== "APPROVED") {
    return NextResponse.json(
      { error: "Content piece must be APPROVED before publishing" },
      { status: 422 }
    );
  }

  let publishUrl: string | undefined;

  if (piece.channel === "BLOG") {
    // Ensure content exists
    if (!piece.content) {
      return NextResponse.json(
        { error: "Content piece has no generated content" },
        { status: 422 }
      );
    }

    const blogContent = piece.content as unknown as BlogContent;

    // Generate slug from title if not set
    const slug =
      piece.slug ??
      piece.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Generate MDX string
    const mdx = generateMDX(blogContent);

    if (site.repoUrl && site.repoBranch && site.repoToken) {
      // Decrypt the repo token before use
      const encryptionKey = process.env.ENCRYPTION_KEY;
      let token: string;
      if (encryptionKey) {
        try {
          token = decrypt(site.repoToken, encryptionKey);
        } catch {
          token = site.repoToken; // fallback if not encrypted
        }
      } else {
        token = site.repoToken;
      }

      const result = await commitMDXToGitHub(
        mdx,
        slug,
        piece.title,
        site.repoUrl,
        site.repoBranch,
        token
      );

      if (!result.success) {
        return NextResponse.json(
          { error: `GitHub publish failed: ${result.error}` },
          { status: 502 }
        );
      }

      publishUrl = result.url;
    } else {
      // Write locally (for development / sites without a GitHub repo)
      const appDir = process.cwd();
      const result = writeMDXLocal(mdx, slug, appDir);

      if (!result.success) {
        return NextResponse.json(
          { error: `Local write failed: ${result.error}` },
          { status: 500 }
        );
      }

      publishUrl = result.url;
    }

    // Update slug on the piece if it was auto-generated
    if (!piece.slug) {
      await prisma.contentPiece.update({
        where: { id: pid },
        data: { slug },
      });
    }
  }

  // Update piece status and publishedAt for all channels
  const updated = await prisma.contentPiece.update({
    where: { id: pid },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // Increment campaign publishedCount
  await prisma.campaign.update({
    where: { id: piece.campaignId },
    data: { publishedCount: { increment: 1 } },
  });

  return NextResponse.json({
    success: true,
    piece: updated,
    ...(publishUrl ? { url: publishUrl } : {}),
  });
}
