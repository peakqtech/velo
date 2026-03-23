import { readdir, readFile } from "fs/promises";
import path from "path";
import { BlogList, parseFrontmatter, calculateReadingTime, slugify } from "@velo/blog";
import type { BlogPost } from "@velo/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let posts: BlogPost[] = [];

  try {
    const files = await readdir(BLOG_DIR);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    const parsed = await Promise.all(
      mdxFiles.map(async (filename) => {
        const raw = await readFile(path.join(BLOG_DIR, filename), "utf-8");
        const { frontmatter, content } = parseFrontmatter(raw);
        const slug = (frontmatter.slug as string | undefined) ?? slugify(filename.replace(/\.mdx?$/, ""));
        const readingTime = calculateReadingTime(content);

        return {
          id: slug,
          slug,
          title: (frontmatter.title as string) ?? "Untitled",
          description: (frontmatter.description as string) ?? "",
          date: (frontmatter.date as string) ?? "",
          image: (frontmatter.image as string | undefined),
          category: (frontmatter.category as string | undefined),
          readingTime,
        } satisfies BlogPost;
      })
    );

    // Sort by date descending
    posts = parsed.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
  } catch {
    // Directory missing or unreadable — return empty list
    posts = [];
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1
        className="mb-10 text-4xl font-extrabold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Blog
      </h1>
      <BlogList posts={posts} locale={locale} />
    </main>
  );
}
