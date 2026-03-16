import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

const TEMP_SECTION_DIR = join(ROOT, "packages/sections/__test-malformed__");

function cleanup() {
  if (existsSync(TEMP_SECTION_DIR)) {
    rmSync(TEMP_SECTION_DIR, { recursive: true });
  }
}

describe("discoverSections", () => {
  beforeEach(cleanup);
  afterEach(cleanup);

  it("skips directories with malformed package.json without crashing", async () => {
    // Create a directory with malformed package.json
    mkdirSync(TEMP_SECTION_DIR, { recursive: true });
    writeFileSync(join(TEMP_SECTION_DIR, "package.json"), "{ not valid json");

    // discoverSections should not throw — it should skip the bad entry
    const { discoverSections } = await import("../src/discover");
    const sections = discoverSections();

    // Should return results (other valid sections exist)
    expect(sections.length).toBeGreaterThan(0);

    // Should NOT include the malformed package
    const names = sections.map((s) => s.name);
    expect(names).not.toContain("__test-malformed__");
  });

  it("skips directories without package.json without crashing", async () => {
    // Create a directory without package.json
    mkdirSync(TEMP_SECTION_DIR, { recursive: true });

    const { discoverSections } = await import("../src/discover");
    const sections = discoverSections();

    expect(sections.length).toBeGreaterThan(0);
    const names = sections.map((s) => s.name);
    expect(names).not.toContain("__test-malformed__");
  });
});
