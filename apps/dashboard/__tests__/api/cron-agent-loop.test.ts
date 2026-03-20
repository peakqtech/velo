import { describe, it, expect, vi, beforeEach } from "vitest";

// Must set env BEFORE module import since the route captures it at module level
vi.hoisted(() => {
  process.env.CRON_SECRET = "test-secret";
});

const { mockPrisma, mockRun, mockRunEscalation } = vi.hoisted(() => {
  const mockRun = vi.fn();
  const mockRunEscalation = vi.fn().mockResolvedValue({ escalated: 0, skipped: 0 });
  return {
    mockPrisma: {
      agentConfig: { findMany: vi.fn() },
    },
    mockRun,
    mockRunEscalation,
  };
});

vi.mock("@velo/db", () => ({ prisma: mockPrisma }));
vi.mock("@velo/seo-agent", () => {
  return {
    AgentLoop: class {
      run = mockRun;
    },
    LockManager: class {},
    EscalationManager: class {
      runEscalation = mockRunEscalation;
    },
  };
});

import { POST } from "@/app/api/cron/agent-loop/route";

describe("POST /api/cron/agent-loop", () => {
  beforeEach(() => vi.clearAllMocks());

  const makeRequest = (token?: string, queryParams = "") =>
    new Request(`http://localhost/api/cron/agent-loop${queryParams}`, {
      method: "POST",
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });

  it("returns 401 without authorization header", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 401 with wrong secret", async () => {
    const res = await POST(makeRequest("wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("returns message when no active configs", async () => {
    mockPrisma.agentConfig.findMany.mockResolvedValue([]);
    const res = await POST(makeRequest("test-secret"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("No active configs found");
    expect(body.runs).toEqual([]);
  });

  it("processes active configs and returns summary", async () => {
    const configs = [
      { id: "cfg-1", siteId: "site-1", site: { id: "site-1", name: "Test Site", domain: "test.com" } },
    ];
    mockPrisma.agentConfig.findMany.mockResolvedValue(configs);
    mockRun.mockResolvedValue({ opportunitiesFound: 3 });

    const res = await POST(makeRequest("test-secret"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Processed 1 site(s)");
    expect(body.runs).toHaveLength(1);
    expect(body.runs[0].siteId).toBe("site-1");
    expect(body.runs[0].status).toBe("fulfilled");
    expect(body.escalation).toBeDefined();
  });

  it("handles failed agent runs gracefully", async () => {
    const configs = [
      { id: "cfg-1", siteId: "site-1", site: { id: "site-1", name: "Fail Site", domain: "fail.com" } },
    ];
    mockPrisma.agentConfig.findMany.mockResolvedValue(configs);
    mockRun.mockRejectedValue(new Error("Agent crashed"));

    const res = await POST(makeRequest("test-secret"));
    const body = await res.json();
    expect(body.runs[0].status).toBe("rejected");
    expect(body.runs[0].error).toContain("Agent crashed");
  });

  it("filters by siteId query param", async () => {
    mockPrisma.agentConfig.findMany.mockResolvedValue([]);
    await POST(makeRequest("test-secret", "?siteId=site-42"));
    const call = mockPrisma.agentConfig.findMany.mock.calls[0][0];
    expect(call.where.siteId).toBe("site-42");
  });
});
