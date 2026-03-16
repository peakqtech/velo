import { describe, it, expect } from "vitest";
import {
  buildWhatsAppUrl,
  isWithinBusinessHours,
  whatsappConfigSchema,
  whatsappIntegration,
} from "../src";

describe("buildWhatsAppUrl", () => {
  it("generates correct URL", () => {
    expect(buildWhatsAppUrl("6281234567890")).toBe(
      "https://wa.me/6281234567890"
    );
  });

  it("with message encodes properly", () => {
    const url = buildWhatsAppUrl("6281234567890", "Hello World");
    expect(url).toBe("https://wa.me/6281234567890?text=Hello%20World");
  });

  it("strips non-numeric chars", () => {
    expect(buildWhatsAppUrl("+62-812-3456-7890")).toBe(
      "https://wa.me/6281234567890"
    );
  });
});

describe("whatsappConfigSchema", () => {
  it("validates valid config", () => {
    const result = whatsappConfigSchema.safeParse({
      phoneNumber: "6281234567890",
    });
    expect(result.success).toBe(true);
  });

  it("requires phoneNumber", () => {
    const result = whatsappConfigSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("whatsappIntegration", () => {
  it("has correct name and category", () => {
    expect(whatsappIntegration.name).toBe("@velo/integration-whatsapp");
    expect(whatsappIntegration.category).toBe("communication");
  });
});

describe("isWithinBusinessHours", () => {
  it("returns true when no schedule (always open)", () => {
    expect(isWithinBusinessHours([], "Asia/Jakarta")).toBe(true);
  });
});
