import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { rewriteImports } from "../src/resolve-imports";

describe("rewriteImports", () => {
  const tmpBase = join(tmpdir(), "resolve-imports-test");

  beforeEach(() => {
    if (existsSync(tmpBase)) rmSync(tmpBase, { recursive: true });
    mkdirSync(tmpBase, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(tmpBase)) rmSync(tmpBase, { recursive: true });
  });

  it("rewrites from-style @velo/ imports to relative paths", () => {
    // File at root level — lib/types should be ./lib/types
    const file = join(tmpBase, "page.tsx");
    writeFileSync(file, `import type { VelocityContent } from "@velo/types";\n`);

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(file, "utf-8");
    expect(result).toContain("./lib/types");
    expect(result).not.toContain("@velo/types");
  });

  it("rewrites import() call expressions", () => {
    const file = join(tmpBase, "loader.ts");
    writeFileSync(file, `type Content = import("@velo/types").VelocityContent;\n`);

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(file, "utf-8");
    expect(result).toContain("./lib/types");
    expect(result).not.toContain("@velo/types");
  });

  it("computes correct relative path from nested directories", () => {
    // File in app/[locale]/ — lib/types should be ../../lib/types
    const dir = join(tmpBase, "app", "[locale]");
    mkdirSync(dir, { recursive: true });
    const file = join(dir, "page-client.tsx");
    writeFileSync(file, `import { Hero } from "@velo/hero";\n`);

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(file, "utf-8");
    expect(result).toContain("../../sections/hero");
    expect(result).not.toContain("@velo/hero");
  });

  it("rewrites multiple imports in the same file", () => {
    const file = join(tmpBase, "component.tsx");
    writeFileSync(file, [
      `import { useScrollEngine } from "@velo/scroll-engine";`,
      `import { MotionDiv } from "@velo/motion-components";`,
      `import type { VelocityContent } from "@velo/types";`,
    ].join("\n") + "\n");

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(file, "utf-8");
    expect(result).toContain("./lib/scroll-engine");
    expect(result).toContain("./components/motion");
    expect(result).toContain("./lib/types");
    expect(result).not.toContain("@velo/");
  });

  it("does not modify non-ts files", () => {
    const file = join(tmpBase, "readme.md");
    const original = `This uses @velo/types for type checking.\n`;
    writeFileSync(file, original);

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(file, "utf-8");
    expect(result).toBe(original);
  });

  it("does not modify files without @velo/ imports", () => {
    const file = join(tmpBase, "utils.ts");
    const original = `import { clsx } from "clsx";\nexport const cn = clsx;\n`;
    writeFileSync(file, original);

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(file, "utf-8");
    expect(result).toBe(original);
  });

  it("skips node_modules and .next directories", () => {
    const nmDir = join(tmpBase, "node_modules", "some-pkg");
    mkdirSync(nmDir, { recursive: true });
    const nmFile = join(nmDir, "index.ts");
    const original = `import { x } from "@velo/types";\n`;
    writeFileSync(nmFile, original);

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(nmFile, "utf-8");
    expect(result).toBe(original);
  });

  it("handles both single and double quotes", () => {
    const file = join(tmpBase, "mixed.tsx");
    writeFileSync(file, [
      `import { Hero } from '@velo/hero';`,
      `import { Footer } from "@velo/footer";`,
    ].join("\n") + "\n");

    rewriteImports(tmpBase, tmpBase);

    const result = readFileSync(file, "utf-8");
    expect(result).toContain("./sections/hero");
    expect(result).toContain("./sections/footer");
    expect(result).not.toContain("@velo/");
  });
});
