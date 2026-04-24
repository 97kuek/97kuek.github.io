import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import astroExpressiveCode from "astro-expressive-code";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: "https://97kuek.github.io",

  integrations: [
    react(),
    markdoc(),
    astroExpressiveCode({
      emitExternalStylesheet: false,
    }),
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: "html" }]],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  output: "static",
});
