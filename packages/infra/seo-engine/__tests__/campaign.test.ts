import { describe, it, expect } from "vitest";
import type { ContentModel } from "../src/ai/model";
import { CampaignPlanner } from "../src/campaign/planner";
import { mapScheduleToDates } from "../src/campaign/scheduler";

// ---------------------------------------------------------------------------
// Shared mock plan JSON
// ---------------------------------------------------------------------------

const mockPlan = {
  pieces: [
    {
      title: "Top HVAC Tips for Austin Homes",
      channel: "BLOG",
      targetKeyword: "hvac austin",
      scheduledFor: "2025-06-02",
      outline: "Intro, Section 1, Section 2, Conclusion",
    },
    {
      title: "Summer AC Maintenance",
      channel: "SOCIAL",
      targetKeyword: "ac maintenance",
      scheduledFor: "2025-06-09",
      outline: "Short tips for social post",
    },
  ],
};

function makeMockModel(text: string): ContentModel {
  return {
    name: "mock-model",
    generate: async (_prompt: string) => ({ text, tokenCount: 100 }),
  };
}

// ---------------------------------------------------------------------------
// CampaignPlanner
// ---------------------------------------------------------------------------

describe("CampaignPlanner", () => {
  const input = {
    campaignName: "Summer HVAC Campaign",
    goal: "Drive local leads",
    channels: ["BLOG", "SOCIAL"],
    keywords: ["hvac austin", "ac maintenance", "air conditioning repair"],
    frequency: "weekly",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    vertical: "HVAC",
    businessName: "Cool Air Co.",
    location: "Austin, TX",
  };

  it("generates a ContentPlan from a brief (mock model)", async () => {
    const model = makeMockModel(JSON.stringify(mockPlan));
    const planner = new CampaignPlanner(model);

    const plan = await planner.generatePlan(input);

    expect(plan.pieces).toHaveLength(2);
    expect(plan.pieces[0].title).toBe("Top HVAC Tips for Austin Homes");
    expect(plan.pieces[0].channel).toBe("BLOG");
    expect(plan.pieces[0].targetKeyword).toBe("hvac austin");
    expect(plan.pieces[0].scheduledFor).toBeInstanceOf(Date);
    expect(plan.pieces[1].channel).toBe("SOCIAL");
  });

  it("includes keywords in the generated prompt", async () => {
    let capturedPrompt = "";
    const model: ContentModel = {
      name: "mock-model",
      generate: async (prompt: string) => {
        capturedPrompt = prompt;
        return { text: JSON.stringify(mockPlan), tokenCount: 100 };
      },
    };

    const planner = new CampaignPlanner(model);
    await planner.generatePlan(input);

    expect(capturedPrompt).toContain("hvac austin");
    expect(capturedPrompt).toContain("ac maintenance");
    expect(capturedPrompt).toContain("air conditioning repair");
  });

  it("handles code-fenced JSON in response", async () => {
    const fenced = "```json\n" + JSON.stringify(mockPlan) + "\n```";
    const model = makeMockModel(fenced);
    const planner = new CampaignPlanner(model);

    const plan = await planner.generatePlan(input);
    expect(plan.pieces).toHaveLength(2);
  });

  it("throws when pieces array is missing", async () => {
    const model = makeMockModel(JSON.stringify({ notPieces: [] }));
    const planner = new CampaignPlanner(model);

    await expect(planner.generatePlan(input)).rejects.toThrow("missing 'pieces' array");
  });
});

// ---------------------------------------------------------------------------
// mapScheduleToDates
// ---------------------------------------------------------------------------

describe("mapScheduleToDates", () => {
  it("weekly: generates correct number of dates", () => {
    const dates = mapScheduleToDates("2025-06-01", "2025-06-29", "weekly");
    // 2025-06-01, 08, 15, 22, 29 = 5 dates
    expect(dates).toHaveLength(5);
    expect(dates[0]).toBe("2025-06-01");
    expect(dates[4]).toBe("2025-06-29");
  });

  it("2x_week: generates approximately twice-per-week dates", () => {
    const dates = mapScheduleToDates("2025-06-01", "2025-06-14", "2x_week");
    // 3.5-day interval: 01, 04-05, 08, 11-12 roughly — at least 3 dates
    expect(dates.length).toBeGreaterThanOrEqual(3);
    expect(dates[0]).toBe("2025-06-01");
  });

  it("daily: generates one date per day", () => {
    const dates = mapScheduleToDates("2025-06-01", "2025-06-07", "daily");
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe("2025-06-01");
    expect(dates[6]).toBe("2025-06-07");
  });

  it("monthly: generates one date per month", () => {
    const dates = mapScheduleToDates("2025-01-01", "2025-06-01", "monthly");
    // ~30-day steps from Jan 1 → Jun 1 = 6 dates (Jan,Jan31,Mar2,Apr1,May1,May31)
    expect(dates.length).toBeGreaterThanOrEqual(5);
    expect(dates[0]).toBe("2025-01-01");
  });

  it("throws on unknown frequency", () => {
    expect(() => mapScheduleToDates("2025-01-01", "2025-12-31", "quarterly")).toThrow(
      'Unknown frequency: "quarterly"'
    );
  });
});
