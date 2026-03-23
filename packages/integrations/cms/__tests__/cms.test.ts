import { describe, it, expect } from "vitest";
import {
  inferFieldType,
  keyToLabel,
  generateFieldsFromContent,
  generateSectionsFromContent,
} from "../src/field-types";
import { InMemoryContentStore } from "../src/content-api";
import { cmsIntegration } from "../src/config";

/* -------------------------------------------------------------------------- */
/*  inferFieldType                                                            */
/* -------------------------------------------------------------------------- */

describe("inferFieldType", () => {
  it('returns "image" for keys containing "image"', () => {
    expect(inferFieldType("heroImage", "https://example.com/img.jpg")).toBe("image");
  });

  it('returns "image" for keys containing "logo"', () => {
    expect(inferFieldType("companyLogo", "logo.png")).toBe("image");
  });

  it('returns "image" for keys containing "avatar"', () => {
    expect(inferFieldType("userAvatar", "/avatar.png")).toBe("image");
  });

  it('returns "image" for keys containing "src"', () => {
    expect(inferFieldType("imgSrc", "/photo.jpg")).toBe("image");
  });

  it('returns "url" for keys containing "url"', () => {
    expect(inferFieldType("websiteUrl", "https://example.com")).toBe("url");
  });

  it('returns "url" for keys containing "href"', () => {
    expect(inferFieldType("ctaHref", "/about")).toBe("url");
  });

  it('returns "boolean" for boolean values', () => {
    expect(inferFieldType("isActive", true)).toBe("boolean");
    expect(inferFieldType("hidden", false)).toBe("boolean");
  });

  it('returns "number" for number values', () => {
    expect(inferFieldType("count", 42)).toBe("number");
    expect(inferFieldType("price", 9.99)).toBe("number");
  });

  it('returns "textarea" for strings longer than 200 chars', () => {
    const longString = "a".repeat(201);
    expect(inferFieldType("description", longString)).toBe("textarea");
  });

  it('returns "text" for short strings', () => {
    expect(inferFieldType("title", "Hello World")).toBe("text");
  });

  it('returns "array" for arrays', () => {
    expect(inferFieldType("items", [1, 2, 3])).toBe("array");
  });

  it('returns "object" for objects', () => {
    expect(inferFieldType("settings", { a: 1 })).toBe("object");
  });

  it('returns "text" for null', () => {
    expect(inferFieldType("anything", null)).toBe("text");
  });

  it('returns "text" for undefined', () => {
    expect(inferFieldType("anything", undefined)).toBe("text");
  });

  it('returns "email" for keys containing "email"', () => {
    expect(inferFieldType("contactEmail", "hi@example.com")).toBe("email");
  });

  it('returns "color" for keys containing "color"', () => {
    expect(inferFieldType("backgroundColor", "#ff0000")).toBe("color");
  });
});

/* -------------------------------------------------------------------------- */
/*  keyToLabel                                                                */
/* -------------------------------------------------------------------------- */

describe("keyToLabel", () => {
  it('converts camelCase to "Camel Case"', () => {
    expect(keyToLabel("camelCase")).toBe("Camel Case");
  });

  it('converts "productShowcase" to "Product Showcase"', () => {
    expect(keyToLabel("productShowcase")).toBe("Product Showcase");
  });

  it("handles snake_case", () => {
    expect(keyToLabel("hero_section")).toBe("Hero section");
  });

  it("handles kebab-case", () => {
    expect(keyToLabel("hero-section")).toBe("Hero section");
  });

  it("handles single word", () => {
    expect(keyToLabel("title")).toBe("Title");
  });
});

/* -------------------------------------------------------------------------- */
/*  generateFieldsFromContent                                                 */
/* -------------------------------------------------------------------------- */

describe("generateFieldsFromContent", () => {
  it("generates fields from a flat object", () => {
    const fields = generateFieldsFromContent({
      title: "Hello",
      count: 5,
      active: true,
    });

    expect(fields).toHaveLength(3);
    expect(fields[0]).toEqual({ key: "title", label: "Title", type: "text" });
    expect(fields[1]).toEqual({ key: "count", label: "Count", type: "number" });
    expect(fields[2]).toEqual({ key: "active", label: "Active", type: "boolean" });
  });

  it("generates nested fields for objects", () => {
    const fields = generateFieldsFromContent({
      cta: { text: "Click me", href: "/go" },
    });

    expect(fields).toHaveLength(1);
    expect(fields[0].type).toBe("object");
    expect(fields[0].fields).toHaveLength(2);
    expect(fields[0].fields![0]).toEqual({ key: "text", label: "Text", type: "text" });
    expect(fields[0].fields![1]).toEqual({ key: "href", label: "Href", type: "url" });
  });

  it("generates itemFields for arrays", () => {
    const fields = generateFieldsFromContent({
      items: [{ name: "Item 1", price: 10 }],
    });

    expect(fields).toHaveLength(1);
    expect(fields[0].type).toBe("array");
    expect(fields[0].itemFields).toHaveLength(2);
    expect(fields[0].itemFields![0]).toEqual({ key: "name", label: "Name", type: "text" });
    expect(fields[0].itemFields![1]).toEqual({ key: "price", label: "Price", type: "number" });
  });
});

/* -------------------------------------------------------------------------- */
/*  generateSectionsFromContent                                               */
/* -------------------------------------------------------------------------- */

describe("generateSectionsFromContent", () => {
  it("creates sections from content object", () => {
    const sections = generateSectionsFromContent({
      hero: { title: "Welcome", subtitle: "Hello" },
      footer: { copyright: "2026" },
    });

    expect(sections).toHaveLength(2);
    expect(sections[0].key).toBe("hero");
    expect(sections[0].label).toBe("Hero");
    expect(sections[0].fields).toHaveLength(2);
    expect(sections[1].key).toBe("footer");
  });

  it("excludes metadata", () => {
    const sections = generateSectionsFromContent({
      metadata: { title: "Site Title" },
      hero: { heading: "Hi" },
    });

    expect(sections).toHaveLength(1);
    expect(sections[0].key).toBe("hero");
  });

  it("handles non-object top-level values", () => {
    const sections = generateSectionsFromContent({
      siteName: "My Site",
    });

    expect(sections).toHaveLength(1);
    expect(sections[0].key).toBe("siteName");
    expect(sections[0].fields[0].type).toBe("text");
  });
});

/* -------------------------------------------------------------------------- */
/*  InMemoryContentStore                                                      */
/* -------------------------------------------------------------------------- */

describe("InMemoryContentStore", () => {
  it("getContent returns null for unknown site", async () => {
    const store = new InMemoryContentStore();
    const result = await store.getContent("unknown-site");
    expect(result).toBeNull();
  });

  it("updateContent + getContent roundtrip", async () => {
    const store = new InMemoryContentStore();
    const content = { hero: { title: "Hello" } };
    await store.updateContent("site-1", content);
    const result = await store.getContent("site-1");
    expect(result).toEqual(content);
  });

  it("updateSection merges with existing content", async () => {
    const store = new InMemoryContentStore();
    await store.updateContent("site-1", { hero: { title: "Old" } });
    await store.updateSection("site-1", "footer", { copyright: "2026" });

    const result = await store.getContent("site-1");
    expect(result).toEqual({
      hero: { title: "Old" },
      footer: { copyright: "2026" },
    });
  });

  it("getContentHistory returns versions in reverse order", async () => {
    const store = new InMemoryContentStore();
    await store.updateContent("site-1", { v: 1 });
    await store.updateContent("site-1", { v: 2 });
    await store.updateContent("site-1", { v: 3 });

    const history = await store.getContentHistory("site-1");
    expect(history).toHaveLength(3);
    expect(history[0].content).toEqual({ v: 3 });
    expect(history[1].content).toEqual({ v: 2 });
    expect(history[2].content).toEqual({ v: 1 });
  });

  it("getContentHistory respects limit", async () => {
    const store = new InMemoryContentStore();
    await store.updateContent("site-1", { v: 1 });
    await store.updateContent("site-1", { v: 2 });
    await store.updateContent("site-1", { v: 3 });

    const history = await store.getContentHistory("site-1", 2);
    expect(history).toHaveLength(2);
    expect(history[0].content).toEqual({ v: 3 });
    expect(history[1].content).toEqual({ v: 2 });
  });
});

/* -------------------------------------------------------------------------- */
/*  cmsIntegration                                                            */
/* -------------------------------------------------------------------------- */

describe("cmsIntegration", () => {
  it("has correct name and category", () => {
    expect(cmsIntegration.name).toBe("@velo/integration-cms");
    expect(cmsIntegration.category).toBe("content");
  });
});
