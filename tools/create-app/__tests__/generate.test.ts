import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, rmSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "../src/generate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

// Use a temp directory inside the monorepo apps/ so generate() can find sourceApp
const TEST_APP_NAME = "__test-generated-app__";

function cleanup() {
  const targetDir = join(ROOT, "apps", TEST_APP_NAME);
  if (existsSync(targetDir)) {
    rmSync(targetDir, { recursive: true });
  }
}

describe("generate", () => {
  beforeEach(cleanup);
  afterEach(cleanup);

  it("throws when locales is empty", () => {
    expect(() =>
      generate({
        appName: TEST_APP_NAME,
        sourceApp: "velocity-template",
        sections: ["@velocity/hero"],
        locales: [],
      })
    ).toThrow(/locale/i);
  });

  it("throws when sections is empty", () => {
    expect(() =>
      generate({
        appName: TEST_APP_NAME,
        sourceApp: "velocity-template",
        sections: [],
        locales: ["en"],
      })
    ).toThrow(/section/i);
  });

  it("generates valid i18n.ts with non-empty locales", () => {
    generate({
      appName: TEST_APP_NAME,
      sourceApp: "velocity-template",
      sections: ["@velocity/hero"],
      locales: ["en", "id"],
    });

    const i18nPath = join(ROOT, "apps", TEST_APP_NAME, "lib/i18n.ts");
    expect(existsSync(i18nPath)).toBe(true);

    const content = readFileSync(i18nPath, "utf-8");
    expect(content).toContain('defaultLocale = "en"');
    expect(content).not.toContain("undefined");
  });

  it("generates page-client.tsx with selected sections", () => {
    generate({
      appName: TEST_APP_NAME,
      sourceApp: "velocity-template",
      sections: ["@velocity/hero", "@velocity/footer"],
      locales: ["en"],
    });

    const pagePath = join(ROOT, "apps", TEST_APP_NAME, "app/[locale]/page-client.tsx");
    expect(existsSync(pagePath)).toBe(true);

    const content = readFileSync(pagePath, "utf-8");
    expect(content).toContain("Hero");
    expect(content).toContain("Footer");
  });
});
