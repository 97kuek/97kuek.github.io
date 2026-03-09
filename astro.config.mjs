// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import astroExpressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://97kuek.github.io",
  base: "/my-portfolio",

  integrations: [astroExpressiveCode(), react(), markdoc()],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  output: "static",
});
