import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, tags: post.data.tags ?? [] },
  }));
}

const avatarPath = join(process.cwd(), "src/assets/hero/avatar.jpg");
let avatarDataUri = "";
try {
  avatarDataUri = `data:image/jpeg;base64,${readFileSync(avatarPath).toString("base64")}`;
} catch {
  // avatar not found — render without it
}

function wrapTitle(text: string, maxWidth = 13): string[] {
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
  const startY = 200 - totalH / 2 + lineHeight * 0.8;

  const titleLines = capped
    .map(
      (line, i) =>
        `<text x="52" y="${startY + i * lineHeight}" fill="white" font-size="36" font-weight="700" font-family="Noto Sans CJK JP,Noto Sans JP,Yu Gothic,MS Gothic,Hiragino Kaku Gothic ProN,sans-serif">${esc(line)}</text>`
    )
    .join("");

  const tagPills = tags
    .slice(0, 4)
    .map((tag, i) => {
      const x = 52 + i * 140;
      const display = tag.length > 13 ? tag.slice(0, 12) + "…" : tag;
      return `<g>
        <rect x="${x}" y="403" width="128" height="28" rx="14" fill="rgba(255,255,255,0.2)"/>
        <text x="${x + 64}" y="422" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="13" font-family="sans-serif">${esc(display)}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4338ca"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    ${avatarDataUri ? `<clipPath id="av"><circle cx="672" cy="185" r="88"/></clipPath>` : ""}
  </defs>
  <rect width="800" height="450" fill="url(#g)"/>
  <circle cx="720" cy="-20" r="200" fill="rgba(255,255,255,0.07)"/>
  <circle cx="80" cy="470" r="180" fill="rgba(255,255,255,0.07)"/>
  <rect y="390" width="800" height="60" fill="rgba(0,0,0,0.3)"/>
  <text x="52" y="68" fill="rgba(255,255,255,0.55)" font-size="14" font-family="sans-serif" font-weight="600" letter-spacing="2.5">BLOG</text>
  <rect x="48" y="80" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.45)"/>
  ${titleLines}
  ${avatarDataUri ? `<circle cx="672" cy="185" r="92" fill="rgba(255,255,255,0.2)"/>
  <image xlink:href="${avatarDataUri}" x="584" y="97" width="176" height="176" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice"/>` : ""}
  ${tagPills}
  <text x="748" y="422" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="13" font-family="sans-serif">Keitaro Ueki</text>
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
