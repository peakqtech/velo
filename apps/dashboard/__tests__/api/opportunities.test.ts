import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    site: { findFirst: vi.fn() },
    contentOpportunity: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@velo/db", () => ({ prisma: mockPrisma }));
vi.mock("@prisma/client", () => ({ Prisma: {} }));

import { GET } from "@/app/api/sites/[id]/opportunities/route";
import { PATCH } from "@/app/api/sites/[id]/opportunities/[oid]/route";

const SITE_ID = "site-1";
const USER_ID = "user-1";
const OID = "opp-1";

describe("GET /api/sites/:id/opportunities", () => {
  beforeEach(() => vi.clearAllMocks());

  const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID }) });

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

  it("returns paginated opportunities", async () => {
    const opps = [{ id: "o1" }, { id: "o2" }];
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findMany.mockResolvedValue(opps);
    mockPrisma.contentOpportunity.count.mockResolvedValue(2);

    const res = await GET(new Request("http://localhost"), makeParams());
    const body = await res.json();
    expect(body.data).toHaveLength(2);
    expect(body.total).toBe(2);
    expect(body.limit).toBe(50);
    expect(body.offset).toBe(0);
  });

  it("respects filter params", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findMany.mockResolvedValue([]);
    mockPrisma.contentOpportunity.count.mockResolvedValue(0);

    const url = "http://localhost?signal=KEYWORD_GAP&channel=BLOG&status=DISCOVERED&limit=10&offset=5";
    await GET(new Request(url), makeParams());

    const call = mockPrisma.contentOpportunity.findMany.mock.calls[0][0];
    expect(call.where.signal).toBe("KEYWORD_GAP");
    expect(call.where.channel).toBe("BLOG");
    expect(call.where.status).toBe("DISCOVERED");
    expect(call.take).toBe(10);
    expect(call.skip).toBe(5);
  });

  it("caps limit at 100", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findMany.mockResolvedValue([]);
    mockPrisma.contentOpportunity.count.mockResolvedValue(0);

    await GET(new Request("http://localhost?limit=999"), makeParams());
    const call = mockPrisma.contentOpportunity.findMany.mock.calls[0][0];
    expect(call.take).toBe(100);
  });
});

describe("PATCH /api/sites/:id/opportunities/:oid", () => {
  beforeEach(() => vi.clearAllMocks());

  const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID, oid: OID }) });
  const makeRequest = (body: Record<string, unknown>) =>
    new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await PATCH(makeRequest({ status: "PLANNED" }), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when site not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue(null);
    const res = await PATCH(makeRequest({ status: "PLANNED" }), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 404 when opportunity not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findFirst.mockResolvedValue(null);
    const res = await PATCH(makeRequest({ status: "PLANNED" }), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 400 on invalid status", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findFirst.mockResolvedValue({ id: OID });
    const res = await PATCH(makeRequest({ status: "BOGUS" }), makeParams());
    expect(res.status).toBe(400);
  });

  it("updates opportunity on valid input", async () => {
    const updated = { id: OID, status: "PLANNED" };
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findFirst.mockResolvedValue({ id: OID });
    mockPrisma.contentOpportunity.update.mockResolvedValue(updated);

    const res = await PATCH(makeRequest({ status: "PLANNED" }), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(updated);
  });
});
