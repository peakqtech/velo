import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/sections/*/vitest.config.ts",
  "apps/*/vitest.config.ts",
  "tools/*/vitest.config.ts",
]);
