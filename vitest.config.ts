import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    isolate: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html", "lcov"],
      reportOnFailure: true,
      cleanOnRerun: true,
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.config.{js,ts}",
        "**/types.ts",
        "**/*.d.ts",
        "**/index.ts",
        "**/__tests__/**",
        "**/example/**",
      ],
      include: ["packages/*/src/**/*.{js,ts}"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    include: ["packages/**/*.{test,spec}.{js,ts}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./packages/sdk/src/auth"),
    },
  },
});
