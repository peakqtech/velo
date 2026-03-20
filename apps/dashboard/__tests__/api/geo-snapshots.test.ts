import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    site: { findFirst: vi.fn() },
    geoSnapshot: { findMany: vi.fn(), count: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@velo/db", () => ({ prisma: mockPrisma }));

import { GET } from "@/app/api/sites/[id]/geo/snapshots/route";

const SITE_ID = "site-1";
const USER_ID = "user-1";
const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID }) });

describe("GET /api/sites/:id/geo/snapshots", () => {
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

  it("returns paginated snapshots", async () => {
    const snaps = [{ id: "snap-1" }];
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.geoSnapshot.findMany.mockResolvedValue(snaps);
    mockPrisma.geoSnapshot.count.mockResolvedValue(1);

    const res = await GET(new Request("http://localhost"), makeParams());
    const body = await res.json();
    expect(body.data).toEqual(snaps);
    expect(body.total).toBe(1);
    expect(body.limit).toBe(50);
    expect(body.offset).toBe(0);
  });

  it("filters by engine, query, and cited params", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.geoSnapshot.findMany.mockResolvedValue([]);
    mockPrisma.geoSnapshot.count.mockResolvedValue(0);

    const url = "http://localhost?engine=PERPLEXITY&query=seo&cited=true";
    await GET(new Request(url), makeParams());
    const call = mockPrisma.geoSnapshot.findMany.mock.calls[0][0];
    expect(call.where.engine).toBe("PERPLEXITY");
    expect(call.where.query).toEqual({ contains: "seo", mode: "insensitive" });
    expect(call.where.cited).toBe(true);
  });

  it("handles cited=false", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.geoSnapshot.findMany.mockResolvedValue([]);
    mockPrisma.geoSnapshot.count.mockResolvedValue(0);

    await GET(new Request("http://localhost?cited=false"), makeParams());
    const call = mockPrisma.geoSnapshot.findMany.mock.calls[0][0];
    expect(call.where.cited).toBe(false);
  });

  it("caps limit at 200", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.geoSnapshot.findMany.mockResolvedValue([]);
    mockPrisma.geoSnapshot.count.mockResolvedValue(0);

    await GET(new Request("http://localhost?limit=999"), makeParams());
    const call = mockPrisma.geoSnapshot.findMany.mock.calls[0][0];
    expect(call.take).toBe(200);
  });
});
