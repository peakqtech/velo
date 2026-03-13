import { describe, it, expect } from "vitest";
import { isValidLocale, defaultLocale } from "@/content/content.config";

describe("i18n config", () => {
  it("validates known locales", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("id")).toBe(true);
  });

  it("rejects unknown locales", () => {
    expect(isValidLocale("fr")).toBe(false);
    expect(isValidLocale("")).toBe(false);
  });

  it("has English as default locale", () => {
    expect(defaultLocale).toBe("en");
  });
});
