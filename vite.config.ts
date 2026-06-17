import {defineConfig} from "vite-plus";
import {heyApiPlugin} from "@hey-api/vite-plugin";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: {index: "index.ts"},
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
  lint: {options: {typeAware: true, typeCheck: true}},
  plugins: [
    heyApiPlugin({
      config: {
        input: "https://raw.githubusercontent.com/rixlhq/openapi/refs/heads/main/openapi.yaml",
        output: {
          path: "src",
          postProcess: [
            {
              command: "bunx",
              args: ["oxfmt", "{{path}}"],
            },
          ],
        },
      },
    }),
  ],
});
