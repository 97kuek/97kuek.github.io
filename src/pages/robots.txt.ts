import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://97kuek.pages.dev");
  const sitemap = new URL("sitemap-index.xml", origin).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
