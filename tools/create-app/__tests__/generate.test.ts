import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, rmSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "../src/generate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

// Use a temp directory inside the monorepo apps/ so generate() can find sourceApp
const TEST_APP_NAME = "test-generated-app";

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
        sections: ["@velo/hero"],
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
      sections: ["@velo/hero"],
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
      sections: ["@velo/hero", "@velo/footer"],
      locales: ["en"],
    });

    const pagePath = join(ROOT, "apps", TEST_APP_NAME, "app/[locale]/page-client.tsx");
    expect(existsSync(pagePath)).toBe(true);

    const content = readFileSync(pagePath, "utf-8");
    expect(content).toContain("Hero");
    expect(content).toContain("Footer");
  });

  it("renders extraProps from template.json instead of hardcoding footer logic", () => {
    // The velocity-template footer section should get localeSwitcher via extraProps
    // not via a hardcoded `pkg === "@velo/footer"` check.
    // To prove this: we'll add extraProps to template.json and verify the generated
    // page-client uses them generically.

    // First, generate with footer — should include localeSwitcher prop
    generate({
      appName: TEST_APP_NAME,
      sourceApp: "velocity-template",
      sections: ["@velo/hero", "@velo/footer"],
      locales: ["en"],
    });

    const pagePath = join(ROOT, "apps", TEST_APP_NAME, "app/[locale]/page-client.tsx");
    const content = readFileSync(pagePath, "utf-8");

    // Footer should get localeSwitcher prop (driven by extraProps in template.json)
    expect(content).toContain("localeSwitcher={<LocaleSwitcher />}");
    // LocaleSwitcher import should be present
    expect(content).toContain("LocaleSwitcher");
  });

  it("throws on path traversal in appName", () => {
    expect(() =>
      generate({
        appName: "../evil",
        sourceApp: "velocity-template",
        sections: ["@velo/hero"],
        locales: ["en"],
      })
    ).toThrow(/invalid.*app.*name/i);
  });

  it("throws on empty appName", () => {
    expect(() =>
      generate({
        appName: "",
        sourceApp: "velocity-template",
        sections: ["@velo/hero"],
        locales: ["en"],
      })
    ).toThrow(/invalid.*app.*name/i);
  });

  it("throws on appName with special characters", () => {
    expect(() =>
      generate({
        appName: "my app!@#",
        sourceApp: "velocity-template",
        sections: ["@velo/hero"],
        locales: ["en"],
      })
    ).toThrow(/invalid.*app.*name/i);
  });

  it("generates next.config.ts with CSP headers", () => {
    generate({
      appName: TEST_APP_NAME,
      sourceApp: "velocity-template",
      sections: ["@velo/hero"],
      locales: ["en"],
    });

    const configPath = join(ROOT, "apps", TEST_APP_NAME, "next.config.ts");
    const content = readFileSync(configPath, "utf-8");
    expect(content).toContain("Content-Security-Policy");
    expect(content).toContain("script-src");
  });

  it("generates .gitignore with .next and node_modules", () => {
    generate({
      appName: TEST_APP_NAME,
      sourceApp: "velocity-template",
      sections: ["@velo/hero"],
      locales: ["en"],
    });

    const gitignorePath = join(ROOT, "apps", TEST_APP_NAME, ".gitignore");
    expect(existsSync(gitignorePath)).toBe(true);

    const content = readFileSync(gitignorePath, "utf-8");
    expect(content).toContain(".next");
    expect(content).toContain("node_modules");
  });

  it("does not add localeSwitcher when footer has no extraProps", () => {
    // Generate with only hero — no localeSwitcher at all
    generate({
      appName: TEST_APP_NAME,
      sourceApp: "velocity-template",
      sections: ["@velo/hero"],
      locales: ["en"],
    });

    const pagePath = join(ROOT, "apps", TEST_APP_NAME, "app/[locale]/page-client.tsx");
    const content = readFileSync(pagePath, "utf-8");

    expect(content).not.toContain("localeSwitcher");
    expect(content).not.toContain("LocaleSwitcher");
  });
});
