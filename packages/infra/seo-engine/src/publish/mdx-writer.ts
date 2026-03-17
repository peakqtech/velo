import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { BlogContent } from "../types/content";

function escapeYamlValue(value: string): string {
  return value.replace(/"/g, '\\"');
}

export function generateMDX(content: BlogContent): string {
  const { frontmatter, markdown } = content;

  const keywordsYaml = frontmatter.keywords
    .map((k) => `  - "${escapeYamlValue(k)}"`)
    .join("\n");

  const lines: string[] = [
    "---",
    `title: "${escapeYamlValue(frontmatter.title)}"`,
    `description: "${escapeYamlValue(frontmatter.description)}"`,
    `date: "${frontmatter.date}"`,
    `author: "${escapeYamlValue(frontmatter.author)}"`,
    `readingTime: ${frontmatter.readingTime}`,
    `keywords:\n${keywordsYaml}`,
  ];

  if (frontmatter.image) {
    lines.push(`image: "${escapeYamlValue(frontmatter.image)}"`);
  }
  if (frontmatter.category) {
    lines.push(`category: "${escapeYamlValue(frontmatter.category)}"`);
  }

  lines.push("---", "", markdown);

  return lines.join("\n");
}

export async function commitMDXToGitHub(
  mdx: string,
  slug: string,
  title: string,
  repoUrl: string,
  branch: string,
  token: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Parse owner/repo from URL: https://github.com/owner/repo or owner/repo
    const repoPath = repoUrl
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/\.git$/, "");
    const [owner, repo] = repoPath.split("/");

    if (!owner || !repo) {
      return { success: false, error: `Invalid repo URL: ${repoUrl}` };
    }

    const filePath = `content/blog/${slug}.mdx`;
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Check if file already exists to get the sha (required for updates)
    let existingSha: string | undefined;
    const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
    if (getRes.ok) {
      const existing = (await getRes.json()) as { sha?: string };
      existingSha = existing.sha;
    }

    const body: Record<string, unknown> = {
      message: `content: add blog post "${title}"`,
      content: Buffer.from(mdx, "utf8").toString("base64"),
      branch,
    };
    if (existingSha) {
      body.sha = existingSha;
      body.message = `content: update blog post "${title}"`;
    }

    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return {
        success: false,
        error: `GitHub API error ${putRes.status}: ${errText}`,
      };
    }

    const result = (await putRes.json()) as {
      content?: { html_url?: string };
    };
    const url = result.content?.html_url;

    return { success: true, url };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export function writeMDXLocal(
  mdx: string,
  slug: string,
  appDir: string
): { success: boolean; url?: string; error?: string } {
  try {
    const outputDir = join(appDir, "content", "blog");
    mkdirSync(outputDir, { recursive: true });
    const filePath = join(outputDir, `${slug}.mdx`);
    writeFileSync(filePath, mdx, "utf8");
    return { success: true, url: filePath };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
