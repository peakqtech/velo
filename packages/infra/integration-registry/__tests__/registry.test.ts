import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";
import { IntegrationRegistry } from "../src/registry";
import type { VeloIntegration } from "../src/types";

const mockConfigSchema = z.object({
  apiKey: z.string(),
  sandbox: z.boolean().default(true),
});

function createMockIntegration(overrides: Partial<VeloIntegration> = {}): VeloIntegration {
  return {
    name: "@velo/integration-stripe",
    displayName: "Stripe Payments",
    description: "Accept payments via Stripe",
    category: "payments",
    configSchema: mockConfigSchema,
    ...overrides,
  };
}

describe("IntegrationRegistry", () => {
  let registry: IntegrationRegistry;

  beforeEach(() => {
    registry = new IntegrationRegistry();
  });

  it("register() adds an integration", () => {
    const integration = createMockIntegration();
    registry.register(integration);

    expect(registry.get(integration.name)).toBe(integration);
  });

  it("register() throws on duplicate name", () => {
    const integration = createMockIntegration();
    registry.register(integration);

    expect(() => registry.register(integration)).toThrow(
      'Integration "@velo/integration-stripe" is already registered',
    );
  });

  it("get() returns integration by name", () => {
    const integration = createMockIntegration();
    registry.register(integration);

    expect(registry.get("@velo/integration-stripe")).toBe(integration);
  });

  it("get() returns undefined for unknown name", () => {
    expect(registry.get("@velo/integration-unknown")).toBeUndefined();
  });

  it("getAll() returns all registered integrations", () => {
    const stripe = createMockIntegration();
    const analytics = createMockIntegration({
      name: "@velo/integration-analytics",
      displayName: "Analytics",
      description: "Track page views",
      category: "analytics",
    });

    registry.register(stripe);
    registry.register(analytics);

    const all = registry.getAll();
    expect(all).toHaveLength(2);
    expect(all).toContain(stripe);
    expect(all).toContain(analytics);
  });

  it("getByCategory() filters by category", () => {
    const stripe = createMockIntegration();
    const paypal = createMockIntegration({
      name: "@velo/integration-paypal",
      displayName: "PayPal",
      description: "Accept payments via PayPal",
      category: "payments",
    });
    const analytics = createMockIntegration({
      name: "@velo/integration-analytics",
      displayName: "Analytics",
      description: "Track page views",
      category: "analytics",
    });

    registry.register(stripe);
    registry.register(paypal);
    registry.register(analytics);

    const payments = registry.getByCategory("payments");
    expect(payments).toHaveLength(2);
    expect(payments).toContain(stripe);
    expect(payments).toContain(paypal);

    const analyticsCategory = registry.getByCategory("analytics");
    expect(analyticsCategory).toHaveLength(1);
    expect(analyticsCategory).toContain(analytics);
  });

  it("has() returns true for registered integration", () => {
    registry.register(createMockIntegration());

    expect(registry.has("@velo/integration-stripe")).toBe(true);
  });

  it("has() returns false for unregistered integration", () => {
    expect(registry.has("@velo/integration-unknown")).toBe(false);
  });

  it("size returns correct count", () => {
    expect(registry.size).toBe(0);

    registry.register(createMockIntegration());
    expect(registry.size).toBe(1);

    registry.register(
      createMockIntegration({ name: "@velo/integration-paypal" }),
    );
    expect(registry.size).toBe(2);
  });

  it("validateConfig() passes valid config", () => {
    registry.register(createMockIntegration());

    const result = registry.validateConfig("@velo/integration-stripe", {
      apiKey: "sk_test_123",
      sandbox: true,
    });

    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("validateConfig() fails invalid config with error messages", () => {
    registry.register(createMockIntegration());

    const result = registry.validateConfig("@velo/integration-stripe", {
      sandbox: "not-a-boolean",
    });

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
    expect(result.errors!.some((e) => e.includes("apiKey"))).toBe(true);
  });

  it("validateConfig() fails for unknown integration", () => {
    const result = registry.validateConfig("@velo/integration-unknown", {});

    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['Integration "@velo/integration-unknown" not found']);
  });
});
