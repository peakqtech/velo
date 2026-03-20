import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    site: { findFirst: vi.fn() },
    geoScore: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@velo/db", () => ({ prisma: mockPrisma }));

import { GET } from "@/app/api/sites/[id]/geo/scores/route";

const SITE_ID = "site-1";
const USER_ID = "user-1";
const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID }) });

describe("GET /api/sites/:id/geo/scores", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(new Request("http://localhost"), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when site not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue(null);
    const res = await GET(new Request("http://localhost"), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns scores with default limit 12", async () => {
    const scores = [{ id: "s1", period: "2026-W12" }];
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.geoScore.findMany.mockResolvedValue(scores);

    const res = await GET(new Request("http://localhost"), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(scores);
    expect(mockPrisma.geoScore.findMany).toHaveBeenCalledWith({
      where: { siteId: SITE_ID },
      orderBy: { period: "desc" },
      take: 12,
    });
  });

  it("filters by engine param", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.geoScore.findMany.mockResolvedValue([]);

    await GET(new Request("http://localhost?engine=CHATGPT"), makeParams());
    const call = mockPrisma.geoScore.findMany.mock.calls[0][0];
    expect(call.where.engine).toBe("CHATGPT");
  });

  it("caps limit at 52", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.geoScore.findMany.mockResolvedValue([]);

    await GET(new Request("http://localhost?limit=999"), makeParams());
    const call = mockPrisma.geoScore.findMany.mock.calls[0][0];
    expect(call.take).toBe(52);
  });
});
