import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "../../../vitest.setup.ts")],
    globals: true,
  },
  resolve: {
    alias: {
      "@velo/types": path.resolve(__dirname, "../../infra/types/src/index.ts"),
      "@velo/scroll-engine": path.resolve(__dirname, "../../infra/scroll-engine/src/index.ts"),
      "@velo/animations": path.resolve(__dirname, "../../infra/animations/src/index.ts"),
      "@velo/motion-components": path.resolve(__dirname, "../../infra/motion-components/src/index.ts"),
    },
  },
});
