import matter from "gray-matter";

export interface FrontmatterResult {
  frontmatter: Record<string, unknown>;
  content: string;
}

/**
 * Parses YAML frontmatter from an MDX string using gray-matter.
 */
export function parseFrontmatter(mdx: string): FrontmatterResult {
  const { data, content } = matter(mdx);
  return {
    frontmatter: data as Record<string, unknown>,
    content,
  };
}

/**
 * Calculates estimated reading time in minutes.
 * Assumes 200 words per minute, minimum 1 minute.
 */
export function calculateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Converts a title string to a URL-safe slug.
 * Lowercases, removes special characters, replaces spaces/underscores with hyphens,
 * and collapses multiple consecutive hyphens into one.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
