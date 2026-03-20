import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    site: { findFirst: vi.fn() },
    agentConfig: { findUnique: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@velo/db", () => ({ prisma: mockPrisma }));

import { POST } from "@/app/api/sites/[id]/agent/toggle/route";

const SITE_ID = "site-1";
const USER_ID = "user-1";
const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID }) });
const makeRequest = () => new Request("http://localhost", { method: "POST" });

describe("POST /api/sites/:id/agent/toggle", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when site not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue(null);
    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 404 when config not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentConfig.findUnique.mockResolvedValue(null);
    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain("Agent config not found");
  });

  it("toggles isActive from false to true", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentConfig.findUnique.mockResolvedValue({ isActive: false });
    mockPrisma.agentConfig.update.mockResolvedValue({ isActive: true });
    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ isActive: true });
    expect(mockPrisma.agentConfig.update).toHaveBeenCalledWith({
      where: { siteId: SITE_ID },
      data: { isActive: true },
    });
  });

  it("toggles isActive from true to false", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.agentConfig.findUnique.mockResolvedValue({ isActive: true });
    mockPrisma.agentConfig.update.mockResolvedValue({ isActive: false });
    const res = await POST(makeRequest(), makeParams());
    expect(await res.json()).toEqual({ isActive: false });
  });
});
