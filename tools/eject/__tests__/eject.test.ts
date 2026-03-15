import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../../..");

describe("eject", () => {
  const TEST_OUTPUT = join(ROOT, "ejected", "__test-eject__");

  afterEach(() => {
    if (existsSync(TEST_OUTPUT)) {
      rmSync(TEST_OUTPUT, { recursive: true });
    }
  });

  it("throws on path traversal in appName", async () => {
    const { eject } = await import("../src/eject");
    expect(() => eject("../evil")).toThrow(/invalid.*app.*name/i);
  });

  it("throws on empty appName", async () => {
    const { eject } = await import("../src/eject");
    expect(() => eject("")).toThrow(/invalid.*app.*name/i);
  });

  it("throws on appName with special characters", async () => {
    const { eject } = await import("../src/eject");
    expect(() => eject("my app!@#")).toThrow(/invalid.*app.*name/i);
  });

  it("throws when app does not exist", async () => {
    const { eject } = await import("../src/eject");
    expect(() => eject("nonexistent-app-12345")).toThrow(/not found/i);
  });

  it("throws when output directory already exists (no silent overwrite)", async () => {
    const { eject } = await import("../src/eject");
    // Create the output dir to simulate existing ejected app
    mkdirSync(TEST_OUTPUT, { recursive: true });
    writeFileSync(join(TEST_OUTPUT, "marker.txt"), "existing work");

    expect(() => eject("__test-eject__")).toThrow();
  });
});

describe("eject — .env exclusion", () => {
  const TEST_APP = "test-eject-env-app";
  const APP_DIR = join(ROOT, "apps", TEST_APP);
  const OUTPUT_DIR = join(ROOT, "ejected", TEST_APP);

  beforeEach(() => {
    // Create a minimal fake app with .env files
    mkdirSync(join(APP_DIR, "app"), { recursive: true });
    writeFileSync(join(APP_DIR, "package.json"), JSON.stringify({
      name: TEST_APP,
      version: "0.0.0",
      private: true,
      scripts: { dev: "next dev", build: "next build" },
      dependencies: {},
      devDependencies: {},
    }));
    writeFileSync(join(APP_DIR, ".env"), "SECRET_KEY=abc123");
    writeFileSync(join(APP_DIR, ".env.local"), "DB_URL=postgres://localhost");
    writeFileSync(join(APP_DIR, ".env.production"), "API_KEY=prod-secret");
    writeFileSync(join(APP_DIR, "app/page.tsx"), "export default function Page() { return <div /> }");
  });

  afterEach(() => {
    if (existsSync(APP_DIR)) rmSync(APP_DIR, { recursive: true });
    if (existsSync(OUTPUT_DIR)) rmSync(OUTPUT_DIR, { recursive: true });
  });

  it("excludes .env files from ejected output", async () => {
    // We can't run the full eject (it does git init, pnpm install, pnpm build)
    // so test the copy+filter logic directly
    const { ejectCopy } = await import("../src/eject");

    ejectCopy(APP_DIR, OUTPUT_DIR);

    // .env files should NOT be in output
    expect(existsSync(join(OUTPUT_DIR, ".env"))).toBe(false);
    expect(existsSync(join(OUTPUT_DIR, ".env.local"))).toBe(false);
    expect(existsSync(join(OUTPUT_DIR, ".env.production"))).toBe(false);

    // Other files should be present
    expect(existsSync(join(OUTPUT_DIR, "package.json"))).toBe(true);
    expect(existsSync(join(OUTPUT_DIR, "app/page.tsx"))).toBe(true);
  });
});
