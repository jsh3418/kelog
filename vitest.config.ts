import mdx from "@mdx-js/rollup";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [mdx()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    globals: true,
  },
});
