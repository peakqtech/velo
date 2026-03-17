import { readdir, readFile } from "fs/promises";
import path from "path";
import type { MetadataRoute } from "next";
import { parseFrontmatter, slugify } from "@velo/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
const LOCALES = ["en", "id"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  // Base locale URLs
  for (const locale of LOCALES) {
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // Blog post URLs per locale
  try {
    const files = await readdir(BLOG_DIR);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    for (const filename of mdxFiles) {
      const raw = await readFile(path.join(BLOG_DIR, filename), "utf-8");
      const { frontmatter } = parseFrontmatter(raw);
      const slug =
        (frontmatter.slug as string | undefined) ??
        slugify(filename.replace(/\.mdx?$/, ""));
      const lastModified = frontmatter.date
        ? new Date(frontmatter.date as string)
        : new Date();

      for (const locale of LOCALES) {
        routes.push({
          url: `${BASE_URL}/${locale}/blog/${slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Blog directory missing — skip blog entries
  }

  return routes;
}
