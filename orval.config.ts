import {defineConfig} from "orval";

// Side-by-side experiment with @hey-api/openapi-ts.
// Generates a parallel SDK under src-orval/ so reviewers can diff shape
// without disturbing the existing src/*.gen.ts output.
//
// Same RIXL_SPEC_PATH escape hatch as vite.config.ts — point at a local
// YAML to test spec changes before they're pushed to rixlhq/openapi.
export default defineConfig({
  rixl: {
    input: {
      target: process.env.RIXL_SPEC_PATH ?? "https://raw.githubusercontent.com/rixlhq/openapi/refs/heads/main/openapi.yaml",
    },
    output: {
      target: "src-orval/index.ts",
      schemas: "src-orval/model",
      mode: "tags-split",
      client: "fetch",
      namingConvention: "camelCase",
      clean: true,
      indexFiles: true,
    },
  },
});
