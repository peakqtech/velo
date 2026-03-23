import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockPrisma: {
    site: { findFirst: vi.fn() },
    contentOpportunity: { findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@velo/db", () => ({ prisma: mockPrisma }));

import { GET } from "@/app/api/sites/[id]/approvals/route";
import { POST } from "@/app/api/sites/[id]/approvals/[oid]/route";

const SITE_ID = "site-1";
const USER_ID = "user-1";
const OID = "opp-1";

describe("GET /api/sites/:id/approvals", () => {
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

  it("returns pending approvals", async () => {
    const items = [{ id: "a1", status: "PENDING_APPROVAL" }];
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findMany.mockResolvedValue(items);
    const res = await GET(new Request("http://localhost"), makeParams());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(items);
    expect(mockPrisma.contentOpportunity.findMany).toHaveBeenCalledWith({
      where: { siteId: SITE_ID, status: "PENDING_APPROVAL", approvalStatus: "PENDING" },
      orderBy: [{ vetoDeadline: "asc" }, { score: "desc" }],
      include: {
        contentPiece: { select: { id: true, title: true, channel: true, status: true } },
      },
    });
  });
});

describe("POST /api/sites/:id/approvals/:oid", () => {
  beforeEach(() => vi.clearAllMocks());

  const makeParams = () => ({ params: Promise.resolve({ id: SITE_ID, oid: OID }) });
  const makeRequest = (body: Record<string, unknown>) =>
    new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({ action: "approve" }), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when site not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue(null);
    const res = await POST(makeRequest({ action: "approve" }), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 404 when opportunity not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findFirst.mockResolvedValue(null);
    const res = await POST(makeRequest({ action: "approve" }), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 400 on invalid action", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findFirst.mockResolvedValue({ id: OID });
    const res = await POST(makeRequest({ action: "invalid" }), makeParams());
    expect(res.status).toBe(400);
  });

  it.each([
    ["approve", "APPROVED", "APPROVED"],
    ["reject", "REJECTED", "SKIPPED"],
    ["veto", "VETOED", "SKIPPED"],
  ] as const)("action '%s' sets approvalStatus=%s, status=%s", async (action, expectedApproval, expectedStatus) => {
    const updated = { id: OID, approvalStatus: expectedApproval, status: expectedStatus };
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findFirst.mockResolvedValue({ id: OID });
    mockPrisma.contentOpportunity.update.mockResolvedValue(updated);

    const res = await POST(makeRequest({ action, note: "test note" }), makeParams());
    expect(res.status).toBe(200);
    expect(mockPrisma.contentOpportunity.update).toHaveBeenCalledWith({
      where: { id: OID },
      data: {
        approvalStatus: expectedApproval,
        status: expectedStatus,
        approvalNote: "test note",
      },
    });
  });

  it("sets approvalNote to null when note not provided", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockPrisma.site.findFirst.mockResolvedValue({ id: SITE_ID });
    mockPrisma.contentOpportunity.findFirst.mockResolvedValue({ id: OID });
    mockPrisma.contentOpportunity.update.mockResolvedValue({ id: OID });

    await POST(makeRequest({ action: "approve" }), makeParams());
    const call = mockPrisma.contentOpportunity.update.mock.calls[0][0];
    expect(call.data.approvalNote).toBeNull();
  });
});
