import { describe, it, expect } from "vitest";
import { createLighthouseAudit } from "../src/audits/lighthouse";
import { createA11yAudit } from "../src/audits/accessibility";
import { createLinkChecker } from "../src/audits/links";
import { createMetaAudit } from "../src/audits/meta";

describe("audit module constructors", () => {
  it("lighthouse audit has correct name", () => {
    const audit = createLighthouseAudit();
    expect(audit.name).toBe("lighthouse");
  });

  it("accessibility audit has correct name", () => {
    const audit = createA11yAudit();
    expect(audit.name).toBe("accessibility");
  });

  it("link checker has correct name", () => {
    const audit = createLinkChecker();
    expect(audit.name).toBe("links");
  });

  it("meta audit has correct name", () => {
    const audit = createMetaAudit();
    expect(audit.name).toBe("meta");
  });

  it("all audits have run method", () => {
    expect(typeof createLighthouseAudit().run).toBe("function");
    expect(typeof createA11yAudit().run).toBe("function");
    expect(typeof createLinkChecker().run).toBe("function");
    expect(typeof createMetaAudit().run).toBe("function");
  });
});

describe("createMetaAudit", () => {
  it("checks for required meta tags in HTML", async () => {
    const audit = createMetaAudit();
    // Pass HTML content directly for unit testing
    const result = await audit.run("https://example.com", {
      html: `
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Test Page</title>
            <meta name="description" content="A test page">
            <meta name="viewport" content="width=device-width">
            <meta property="og:title" content="Test">
            <meta property="og:description" content="A test page">
            <meta property="og:image" content="/og.jpg">
          </head>
          <body></body>
        </html>
      `,
    });

    expect(result.score).toBe(100);
    expect(result.name).toBe("meta");
  });

  it("reports missing meta description", async () => {
    const audit = createMetaAudit();
    const result = await audit.run("https://example.com", {
      html: `<html><head><title>Test</title></head><body></body></html>`,
    });

    expect(result.score).toBeLessThan(100);
    const messages = result.issues.map((i) => i.message);
    expect(messages.some((m) => m.toLowerCase().includes("description"))).toBe(true);
  });

  it("reports missing og:image", async () => {
    const audit = createMetaAudit();
    const result = await audit.run("https://example.com", {
      html: `
        <html>
          <head>
            <title>Test</title>
            <meta name="description" content="ok">
          </head>
          <body></body>
        </html>
      `,
    });

    const messages = result.issues.map((i) => i.message);
    expect(messages.some((m) => m.toLowerCase().includes("og:image"))).toBe(true);
  });

  it("reports missing viewport meta", async () => {
    const audit = createMetaAudit();
    const result = await audit.run("https://example.com", {
      html: `<html><head><title>Test</title></head><body></body></html>`,
    });

    const messages = result.issues.map((i) => i.message);
    expect(messages.some((m) => m.toLowerCase().includes("viewport"))).toBe(true);
  });
});
