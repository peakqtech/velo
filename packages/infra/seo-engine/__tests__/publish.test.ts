import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "../src/publish/crypto";
import { generateMDX } from "../src/publish/mdx-writer";
import type { BlogContent } from "../src/types/content";

// AES-256-GCM requires a 32-byte key
const TEST_KEY = "12345678901234567890123456789012"; // 32 chars

describe("crypto", () => {
  it("encrypt/decrypt roundtrip returns original plaintext", () => {
    const plaintext = "ghp_supersecrettoken";
    const ciphertext = encrypt(plaintext, TEST_KEY);
    const recovered = decrypt(ciphertext, TEST_KEY);
    expect(recovered).toBe(plaintext);
  });

  it("produces different ciphertexts for the same input (random IV)", () => {
    const plaintext = "same-input-every-time";
    const ct1 = encrypt(plaintext, TEST_KEY);
    const ct2 = encrypt(plaintext, TEST_KEY);
    expect(ct1).not.toBe(ct2);
  });

  it("ciphertext contains three colon-separated segments (iv:tag:data)", () => {
    const ciphertext = encrypt("hello", TEST_KEY);
    const parts = ciphertext.split(":");
    expect(parts).toHaveLength(3);
    // iv is 16 bytes → 32 hex chars; tag is 16 bytes → 32 hex chars
    expect(parts[0]).toHaveLength(32);
    expect(parts[1]).toHaveLength(32);
  });

  it("throws when decrypting with the wrong key", () => {
    const ciphertext = encrypt("secret", TEST_KEY);
    const wrongKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // 32 chars, wrong key
    expect(() => decrypt(ciphertext, wrongKey)).toThrow();
  });
});

describe("generateMDX", () => {
  const baseContent: BlogContent = {
    frontmatter: {
      title: "Hello World",
      description: "An introductory post",
      date: "2026-04-01",
      keywords: ["hello", "world"],
      author: "Yohanes",
      readingTime: 3,
    },
    markdown: "# Hello World\n\nThis is a blog post.",
  };

  it("generates valid MDX with YAML frontmatter block", () => {
    const mdx = generateMDX(baseContent);
    expect(mdx).toMatch(/^---\n/);
    expect(mdx).toContain("---\n");
    expect(mdx).toContain('title: "Hello World"');
    expect(mdx).toContain('description: "An introductory post"');
    expect(mdx).toContain('date: "2026-04-01"');
    expect(mdx).toContain('author: "Yohanes"');
    expect(mdx).toContain("readingTime: 3");
  });

  it("includes the markdown body after the frontmatter", () => {
    const mdx = generateMDX(baseContent);
    expect(mdx).toContain("# Hello World");
    expect(mdx).toContain("This is a blog post.");
  });

  it("renders keywords as a YAML list", () => {
    const mdx = generateMDX(baseContent);
    expect(mdx).toContain('  - "hello"');
    expect(mdx).toContain('  - "world"');
  });

  it("escapes double-quotes inside frontmatter values", () => {
    const content: BlogContent = {
      ...baseContent,
      frontmatter: {
        ...baseContent.frontmatter,
        title: 'He said "Hello"',
        description: 'A post with "quotes"',
      },
    };
    const mdx = generateMDX(content);
    expect(mdx).toContain('title: "He said \\"Hello\\""');
    expect(mdx).toContain('description: "A post with \\"quotes\\""');
  });

  it("includes optional image and category when provided", () => {
    const content: BlogContent = {
      ...baseContent,
      frontmatter: {
        ...baseContent.frontmatter,
        image: "/images/hello.jpg",
        category: "Engineering",
      },
    };
    const mdx = generateMDX(content);
    expect(mdx).toContain('image: "/images/hello.jpg"');
    expect(mdx).toContain('category: "Engineering"');
  });

  it("omits image and category when not provided", () => {
    const mdx = generateMDX(baseContent);
    expect(mdx).not.toContain("image:");
    expect(mdx).not.toContain("category:");
  });
});
