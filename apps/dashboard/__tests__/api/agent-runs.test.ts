import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    site: { findFirst: vi.fn() },
    agentRun: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@velo/db", () => ({ prisma: mockPrisma }));

import { GET } from "@/app/api/sites/[id]/agent/runs/route";

const SITE_ID = "site-1";
const USER_ID = "user-1";
const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID }) });
const makeRequest = () => new Request("http://localhost");

describe("GET /api/sites/:id/agent/runs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when site not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue(null);
    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns last 10 runs", async () => {
    const runs = Array.from({ length: 10 }, (_, i) => ({
      id: `run-${i}`,
      siteId: SITE_ID,
    }));
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentRun.findMany.mockResolvedValue(runs);
    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(10);
    expect(mockPrisma.agentRun.findMany).toHaveBeenCalledWith({
      where: { siteId: SITE_ID },
      orderBy: { startedAt: "desc" },
      take: 10,
    });
  });

  it("returns empty array when no runs", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentRun.findMany.mockResolvedValue([]);
    const res = await GET(makeRequest(), makeParams());
    expect(await res.json()).toEqual([]);
  });
});
