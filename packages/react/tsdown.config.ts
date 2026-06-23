import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true,
  dts: {
    oxc: true,
  },
  format: "esm",
  minify: process.env.NODE_ENV === "production",
  platform: "browser",
  sourcemap: false,
  target: "es2022",
});
