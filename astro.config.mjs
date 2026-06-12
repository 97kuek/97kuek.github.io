import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import markdoc from "@astrojs/markdoc";
import astroExpressiveCode from "astro-expressive-code";
import sitemap from "@astrojs/sitemap";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: "https://97kuek.github.io",

  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap(),
    markdoc(),
    astroExpressiveCode({
      themes: ["github-dark"],
      useDarkModeMediaQuery: false,
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
