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
      "@velocity/types": path.resolve(__dirname, "../../infra/types/src/index.ts"),
      "@velocity/scroll-engine": path.resolve(__dirname, "../../infra/scroll-engine/src/index.ts"),
      "@velocity/animations": path.resolve(__dirname, "../../infra/animations/src/index.ts"),
      "@velocity/motion-components": path.resolve(__dirname, "../../infra/motion-components/src/index.ts"),
    },
  },
});
