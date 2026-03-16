import { describe, it, expect } from "vitest";
import {
  getPlausibleScript,
  getGA4Script,
  getAnalyticsScript,
  analyticsConfigSchema,
  analyticsIntegration,
} from "../src";
import type { AnalyticsConfig } from "../src";

const plausibleConfig: AnalyticsConfig = {
  enabled: true,
  provider: "plausible",
  plausibleDomain: "example.com",
  plausibleApiHost: "https://plausible.io",
  enabledEvents: ["pageview"],
};

const ga4Config: AnalyticsConfig = {
  enabled: true,
  provider: "ga4",
  ga4MeasurementId: "G-XXXXXXXXXX",
  plausibleApiHost: "https://plausible.io",
  enabledEvents: ["pageview"],
};

describe("getPlausibleScript", () => {
  it("generates correct script tag", () => {
    const script = getPlausibleScript(plausibleConfig);
    expect(script).toContain('data-domain="example.com"');
    expect(script).toContain("plausible.io/js/script.js");
  });
});

describe("getGA4Script", () => {
  it("generates correct script tag", () => {
    const script = getGA4Script(ga4Config);
    expect(script).toContain("G-XXXXXXXXXX");
    expect(script).toContain("googletagmanager.com/gtag/js");
    expect(script).toContain("gtag('config'");
  });
});

describe("getAnalyticsScript", () => {
  it("returns plausible script for plausible provider", () => {
    const script = getAnalyticsScript(plausibleConfig);
    expect(script).toContain("plausible.io");
  });

  it("returns GA4 script for ga4 provider", () => {
    const script = getAnalyticsScript(ga4Config);
    expect(script).toContain("googletagmanager.com");
  });
});

describe("analyticsConfigSchema", () => {
  it("validates plausible config", () => {
    const result = analyticsConfigSchema.safeParse({
      provider: "plausible",
      plausibleDomain: "example.com",
    });
    expect(result.success).toBe(true);
  });

  it("validates ga4 config", () => {
    const result = analyticsConfigSchema.safeParse({
      provider: "ga4",
      ga4MeasurementId: "G-XXXXXXXXXX",
    });
    expect(result.success).toBe(true);
  });

  it("rejects plausible without domain", () => {
    const result = analyticsConfigSchema.safeParse({
      provider: "plausible",
    });
    expect(result.success).toBe(false);
  });

  it("rejects ga4 without measurement ID", () => {
    const result = analyticsConfigSchema.safeParse({
      provider: "ga4",
    });
    expect(result.success).toBe(false);
  });
});

describe("analyticsIntegration", () => {
  it("has correct name and category", () => {
    expect(analyticsIntegration.name).toBe("@velo/integration-analytics");
    expect(analyticsIntegration.category).toBe("analytics");
  });
});
