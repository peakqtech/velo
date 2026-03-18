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

const MAX_BATCH_SIZE = 20;

interface SiteContext {
  name: string;
}

function getFormatterForChannel(channel: string): ChannelFormatter | null {
  switch (channel) {
    case "BLOG":
      return new BlogFormatter();
    case "GBP":
      return new GBPFormatter();
    case "SOCIAL":
      return new SocialFormatter();
    case "EMAIL":
      return new EmailFormatter();
    default:
      return null;
  }
}

async function processBatchAsync(
  pieceIds: string[],
  _apiKey: string,
  siteContext: SiteContext
): Promise<void> {
  const model = createModel();
  const generator = new ContentGenerator(model);

  for (const pieceId of pieceIds) {
    try {
      const piece = await prisma.contentPiece.findUnique({
        where: { id: pieceId },
      });

      if (!piece || piece.status !== "GENERATING") {
        continue;
      }

      const formatter = getFormatterForChannel(piece.channel);
      if (!formatter) {
        await prisma.contentPiece.update({
          where: { id: pieceId },
          data: { status: "FAILED" },
        });
        continue;
      }

      const result = await generator.generate({
        formatter,
        context: {
          title: piece.title,
          targetKeyword: piece.targetKeyword ?? undefined,
          outline: piece.outline ?? undefined,
          businessName: siteContext.name,
          businessType: "",
          location: "",
        },
      });

      if (result.valid) {
        await prisma.contentPiece.update({
          where: { id: pieceId },
          data: {
            status: "DRAFT",
            content: result.content as object,
            modelUsed: result.modelUsed,
            tokenCount: result.tokenCount ?? null,
            generatedAt: new Date(),
          },
        });
      } else {
        await prisma.contentPiece.update({
          where: { id: pieceId },
          data: { status: "FAILED" },
        });
      }
    } catch {
      await prisma.contentPiece.update({
        where: { id: pieceId },
        data: { status: "FAILED" },
      });
    }
  }
}

// POST /api/sites/:id/seo/campaigns/:cid/generate-batch
// Async — returns 202 immediately and processes pieces in the background.
export async function POST(
  _request: Request,
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

  try {
    createModel(); // validate that a model provider is configured
  } catch {
    return NextResponse.json(
      { error: "AI service not configured. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_AI_API_KEY." },
      { status: 500 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.OPENAI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? "";
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Find PLANNED pieces scheduled within the next 7 days, cap at MAX_BATCH_SIZE
  const plannedPieces = await prisma.contentPiece.findMany({
    where: {
      campaignId: cid,
      siteId: id,
      status: "PLANNED",
      scheduledFor: {
        lte: sevenDaysFromNow,
      },
    },
    orderBy: { scheduledFor: "asc" },
    take: MAX_BATCH_SIZE,
    select: { id: true },
  });

  if (plannedPieces.length === 0) {
    return NextResponse.json(
      { message: "No PLANNED pieces scheduled within the next 7 days", pieceIds: [] },
      { status: 200 }
    );
  }

  const pieceIds = plannedPieces.map((p) => p.id);

  // Mark all selected pieces as GENERATING
  await prisma.contentPiece.updateMany({
    where: { id: { in: pieceIds } },
    data: { status: "GENERATING" },
  });

  // Spawn background processing (fire and forget, sequential)
  processBatchAsync(pieceIds, apiKey, { name: site.name }).catch(console.error);

  return NextResponse.json({ accepted: true, pieceIds }, { status: 202 });
}
