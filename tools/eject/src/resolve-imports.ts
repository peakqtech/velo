import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";

const PACKAGE_PATH_MAP: Record<string, string> = {
  "@velo/types": "lib/types",
  "@velo/scroll-engine": "lib/scroll-engine",
  "@velo/animations": "lib/animations",
  "@velo/motion-components": "components/motion",
  "@velo/i18n": "lib/i18n-utils",
  "@velo/ui": "components/ui",
  "@velo/hero": "sections/hero",
  "@velo/product-showcase": "sections/product-showcase",
  "@velo/brand-story": "sections/brand-story",
  "@velo/product-grid": "sections/product-grid",
  "@velo/testimonials": "sections/testimonials",
  "@velo/footer": "sections/footer",
};

export function rewriteImports(dir: string, baseDir: string): void {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      rewriteImports(fullPath, baseDir);
      continue;
    }

    if (!entry.name.match(/\.(ts|tsx)$/)) continue;

    let content = readFileSync(fullPath, "utf-8");
    let changed = false;

    for (const [pkg, localPath] of Object.entries(PACKAGE_PATH_MAP)) {
      const regex = new RegExp(
        `(from\\s+["'])${pkg.replace("/", "\\/")}(["'])`,
        "g"
      );

      const fileDir = relative(baseDir, dirname(fullPath));
      const targetPath = localPath;
      let rel = relative(join(baseDir, fileDir), join(baseDir, targetPath));
      if (!rel.startsWith(".")) rel = "./" + rel;
      rel = rel.replace(/\\/g, "/");

      let newContent = content.replace(regex, `$1${rel}$2`);

      // Also rewrite inline import("@velo/...") type expressions
      const importCallRegex = new RegExp(
        `(import\\(["'])${pkg.replace("/", "\\/")}(["']\\))`,
        "g"
      );
      newContent = newContent.replace(importCallRegex, `$1${rel}$2`);

      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }

    if (changed) {
      writeFileSync(fullPath, content);
    }
  }
}
