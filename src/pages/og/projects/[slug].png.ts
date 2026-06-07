import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { Resvg } from "@resvg/resvg-js";

export const prerender = true;

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((p) => ({
    params: { slug: p.id },
    props: { title: p.data.title, tags: p.data.skills ?? [] },
  }));
}

function wrapTitle(text: string, maxWidth = 16): string[] {
  const isCJK = (ch: string) =>
    /[⺀-鿿豈-﫿︰-﹏！-｠￠-￦]/.test(ch);
  const lines: string[] = [];
  let cur = "";
  let curW = 0;
  for (const ch of text) {
    const w = isCJK(ch) ? 1 : 0.55;
    if (curW + w > maxWidth && cur.length > 0) {
      lines.push(cur);
      cur = ch;
      curW = w;
    } else {
      cur += ch;
      curW += w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSvg(title: string, tags: string[]): string {
  const lines = wrapTitle(title);
  const maxLines = 4;
  const capped = lines.slice(0, maxLines);
  if (lines.length > maxLines) capped[maxLines - 1] += "…";

  const lineHeight = 50;
  const totalH = capped.length * lineHeight;
  const startY = 210 - totalH / 2 + lineHeight * 0.8;

  const titleLines = capped
    .map(
      (line, i) =>
        `<text x="52" y="${startY + i * lineHeight}" fill="#1e293b" font-size="36" font-weight="700" font-family="Noto Sans CJK JP,Noto Sans JP,Yu Gothic,MS Gothic,Hiragino Kaku Gothic ProN,system-ui,sans-serif">${esc(line)}</text>`
    )
    .join("");

  const tagPills = tags
    .slice(0, 5)
    .map((tag, i) => {
      const x = 52 + i * 140;
      const display = tag.length > 13 ? tag.slice(0, 12) + "…" : tag;
      return `<g>
        <rect x="${x}" y="385" width="128" height="26" rx="13" fill="#e2e8f0"/>
        <text x="${x + 64}" y="403" text-anchor="middle" fill="#475569" font-size="12" font-family="system-ui,sans-serif">${esc(display)}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <rect width="800" height="450" fill="#f8fafc"/>
  <rect width="800" height="450" fill="none" stroke="#e2e8f0" stroke-width="2"/>
  <rect x="52" y="60" width="4" height="36" rx="2" fill="#4a5568"/>
  <text x="66" y="84" fill="#4a5568" font-size="13" font-family="system-ui,sans-serif" font-weight="700" letter-spacing="2">PROJECT</text>
  ${titleLines}
  ${tagPills}
  <text x="748" y="430" text-anchor="end" fill="#94a3b8" font-size="13" font-family="system-ui,sans-serif">Keitaro Ueki</text>
</svg>`;
}

export const GET: APIRoute = async ({ props }) => {
  const { title, tags } = props as { title: string; tags: string[] };
  const svg = buildSvg(title, tags);

  const resvg = new Resvg(svg, {
    font: { loadSystemFonts: true },
  });

  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
