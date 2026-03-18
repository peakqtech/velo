import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import {
  createModel,
  ContentGenerator,
  BlogFormatter,
  GBPFormatter,
  SocialFormatter,
  EmailFormatter,
} from "@velo/seo-engine";
import type { ChannelFormatter } from "@velo/seo-engine";

// POST /api/sites/:id/seo/content/:pid/generate
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

  // Set status to GENERATING immediately and return 202
  await prisma.contentPiece.update({
    where: { id: pid },
    data: { status: "GENERATING" },
  });

  // Fire-and-forget async generation
  void (async () => {
    try {
      // Find ContentTemplate matching site template (vertical) and piece channel
      const contentTemplate = await prisma.contentTemplate.findFirst({
        where: {
          vertical: site.template,
          channel: piece.channel,
        },
      });

      // Create the appropriate channel formatter
      let formatter: ChannelFormatter;
      switch (piece.channel) {
        case "GBP":
          formatter = new GBPFormatter();
          break;
        case "SOCIAL":
          formatter = new SocialFormatter();
          break;
        case "EMAIL":
          formatter = new EmailFormatter();
          break;
        case "BLOG":
        default:
          formatter = new BlogFormatter();
          break;
      }

      // Build prompt context from piece + site
      const siteContent = site.content as Record<string, unknown> | null;
      const businessName =
        (siteContent?.businessName as string) ??
        (siteContent?.name as string) ??
        site.name;
      const businessType =
        (siteContent?.businessType as string) ??
        site.template;
      const location =
        (siteContent?.location as string) ??
        (siteContent?.city as string) ??
        "";

      const model = createModel();
      const generator = new ContentGenerator(model);

      const result = await generator.generate({
        formatter,
        context: {
          title: piece.title,
          targetKeyword: piece.targetKeyword ?? undefined,
          outline: piece.outline ?? undefined,
          businessName,
          businessType,
          location,
          tone: contentTemplate?.tone ?? undefined,
        },
      });

      if (result.valid) {
        await prisma.contentPiece.update({
          where: { id: pid },
          data: {
            content: result.content as object,
            modelUsed: result.modelUsed,
            tokenCount: result.tokenCount ?? null,
            generatedAt: new Date(),
            contentTemplateId: contentTemplate?.id ?? null,
            status: "DRAFT",
            reviewNote: null,
          },
        });
      } else {
        const errorMsg = result.errors?.join("; ") ?? "Unknown generation error";
        await prisma.contentPiece.update({
          where: { id: pid },
          data: {
            status: "FAILED",
            reviewNote: `Generation failed: ${errorMsg}`,
          },
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await prisma.contentPiece.update({
        where: { id: pid },
        data: {
          status: "FAILED",
          reviewNote: `Generation error: ${message}`,
        },
      });
    }
  })();

  return NextResponse.json({ status: "GENERATING", pieceId: pid }, { status: 202 });
}
