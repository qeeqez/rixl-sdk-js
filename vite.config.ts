import {defineConfig} from "vite-plus";
import {heyApiPlugin} from "@hey-api/vite-plugin";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    exports: true,
    dts: {
      oxc: true,
    },
    format: "esm",
    minify: process.env.NODE_ENV === "production",
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
        output: "src",
      },
    }),
  ],
});
