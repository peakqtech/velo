import { readdir, readFile } from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BlogPostLayout,
  parseFrontmatter,
  calculateReadingTime,
  slugify,
} from "@velo/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

async function getMdxFiles(): Promise<string[]> {
  try {
    const files = await readdir(BLOG_DIR);
    return files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch {
    return [];
  }
}

async function getPostBySlug(slug: string) {
  const files = await getMdxFiles();

  for (const filename of files) {
    const raw = await readFile(path.join(BLOG_DIR, filename), "utf-8");
    const { frontmatter, content } = parseFrontmatter(raw);
    const postSlug =
      (frontmatter.slug as string | undefined) ??
      slugify(filename.replace(/\.mdx?$/, ""));

    if (postSlug === slug) {
      return { frontmatter, content, slug: postSlug };
    }
  }

  return null;
}

export async function generateStaticParams() {
  const files = await getMdxFiles();

  const params = await Promise.all(
    files.map(async (filename) => {
      const raw = await readFile(path.join(BLOG_DIR, filename), "utf-8");
      const { frontmatter } = parseFrontmatter(raw);
      const slug =
        (frontmatter.slug as string | undefined) ??
        slugify(filename.replace(/\.mdx?$/, ""));
      return { slug };
    })
  );

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const { frontmatter } = post;
  const title = (frontmatter.title as string) ?? "Blog Post";
  const description = (frontmatter.description as string) ?? "";
  const keywords = (frontmatter.keywords as string[] | undefined) ?? [];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;
  const title = (frontmatter.title as string) ?? "Untitled";
  const description = (frontmatter.description as string) ?? "";
  const date = (frontmatter.date as string) ?? "";
  const author = (frontmatter.author as string) ?? "Unknown";
  const keywords = (frontmatter.keywords as string[] | undefined) ?? [];
  const readingTime = calculateReadingTime(content);

  // Minimal markdown-to-HTML: render as preformatted prose for MVP
  // Converts headings, bold, italic, and newlines to basic HTML
  const htmlContent = content
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");

  return (
    <BlogPostLayout
      title={title}
      description={description}
      date={date}
      author={author}
      readingTime={readingTime}
      keywords={keywords}
    >
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </BlogPostLayout>
  );
}
