import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { ClaudeAdapter, VerticalKeywordProvider } from "@velo/seo-engine";

// GET /api/sites/:id/seo/keywords?vertical=restaurant&location=Bali
export async function GET(
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

  const { searchParams } = new URL(request.url);
  const vertical = searchParams.get("vertical") ?? site.template;
  const location = searchParams.get("location") ?? "";
  const channelsParam = searchParams.get("channels");
  const channels = channelsParam ? channelsParam.split(",") : ["BLOG", "GBP", "SOCIAL"];

  if (!vertical) {
    return NextResponse.json(
      { error: "vertical query param is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 503 }
    );
  }
  const model = new ClaudeAdapter(apiKey);
  const provider = new VerticalKeywordProvider(model);

  const keywords = await provider.getKeywords(vertical, location, channels);

  return NextResponse.json(keywords);
}
