import { defineConfig } from "vite-plus";
import { heyApiPlugin } from "@hey-api/vite-plugin";

export default defineConfig({
  pack: {
    entry: { index: "index.ts" },
    exports: true,
    dts: true,
    format: "esm",
    minify: false,
    platform: "browser",
    sourcemap: true,
    target: "es2022",
  },
  fmt: {
    printWidth: 140,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    arrowParens: "always",
    bracketSpacing: false,
    bracketSameLine: false,
    endOfLine: "lf",
  },
  plugins: [
    heyApiPlugin({
      config: {
        input: "./swagger.yaml",
        output: "src/generated",
      },
    }),
  ],
});
