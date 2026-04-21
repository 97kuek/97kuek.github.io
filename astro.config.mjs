// @ts-check
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
      themes: ["github-dark", "github-light"],
      emitExternalStylesheet: false,
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) =>
        theme.type === "dark"
          ? '[data-theme="dark"],[data-theme="synthwave"],[data-theme="dim"]'
          : '[data-theme="light"],[data-theme="retro"],[data-theme="valentine"]',
    }),
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: "html" }]],
  },

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  output: "static",
});
