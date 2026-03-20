import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    site: { findFirst: vi.fn() },
    agentConfig: { findUnique: vi.fn(), upsert: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@velo/db", () => ({ prisma: mockPrisma }));

import { GET, POST } from "@/app/api/sites/[id]/agent/config/route";

const SITE_ID = "site-1";
const USER_ID = "user-1";
const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID }) });

function makeRequest(body?: Record<string, unknown>, url = "http://localhost") {
  return new Request(url, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

describe("GET /api/sites/:id/agent/config", () => {
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

  it("returns null when config does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentConfig.findUnique.mockResolvedValue(null);
    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toBeNull();
  });

  it("returns config when it exists", async () => {
    const config = { id: "cfg-1", siteId: SITE_ID, tier: "GROWTH" };
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentConfig.findUnique.mockResolvedValue(config);
    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(config);
  });
});

describe("POST /api/sites/:id/agent/config", () => {
  beforeEach(() => vi.clearAllMocks());

  const validBody = {
    tier: "GROWTH",
    channels: ["BLOG"],
    cadence: { weekly: 2 },
  };

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeRequest(validBody), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when site not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue(null);
    const res = await POST(makeRequest(validBody), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 400 on validation error", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    const res = await POST(makeRequest({ tier: "INVALID" }), makeParams());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
  });

  it("returns 400 when channels is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    const res = await POST(
      makeRequest({ tier: "GROWTH", channels: [], cadence: {} }),
      makeParams()
    );
    expect(res.status).toBe(400);
  });

  it("upserts config on valid input", async () => {
    const upserted = { id: "cfg-1", siteId: SITE_ID, ...validBody };
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentConfig.upsert.mockResolvedValue(upserted);
    const res = await POST(makeRequest(validBody), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(upserted);
    expect(mockPrisma.agentConfig.upsert).toHaveBeenCalledOnce();
  });
});
