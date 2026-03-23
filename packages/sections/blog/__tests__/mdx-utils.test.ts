import { describe, it, expect } from "vitest";
import { parseFrontmatter, calculateReadingTime, slugify } from "../src/mdx-utils";

describe("parseFrontmatter", () => {
  it("parses YAML frontmatter from MDX string", () => {
    const mdx = `---
title: Hello World
date: 2026-01-01
author: Jane Doe
---

# Hello World

Some content here.`;

    const { frontmatter, content } = parseFrontmatter(mdx);

    expect(frontmatter.title).toBe("Hello World");
    expect(frontmatter.date).toBeInstanceOf(Date);
    expect(frontmatter.author).toBe("Jane Doe");
    expect(content.trim()).toContain("# Hello World");
  });

  it("returns empty frontmatter for content without frontmatter", () => {
    const mdx = `# Just a heading

No frontmatter here.`;

    const { frontmatter, content } = parseFrontmatter(mdx);

    expect(frontmatter).toEqual({});
    expect(content.trim()).toContain("# Just a heading");
  });
});

describe("calculateReadingTime", () => {
  it("returns 1 minute for short text", () => {
    const shortText = "This is a very short text with just a few words.";
    expect(calculateReadingTime(shortText)).toBe(1);
  });

  it("returns correct reading time for long text", () => {
    // Generate ~400 words → should be 2 minutes
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });

  it("returns 1 minimum even for empty string", () => {
    expect(calculateReadingTime("")).toBe(1);
  });
});

describe("slugify", () => {
  it("converts titles to URL-safe slugs", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("lowercases all characters", () => {
    expect(slugify("My AWESOME Post")).toBe("my-awesome-post");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World! This is a test.")).toBe("hello-world-this-is-a-test");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("Hello---World")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });
});
