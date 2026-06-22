import { Resvg } from "@resvg/resvg-js";
import { SITE } from "./site";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 450;
const TITLE_MAX_WIDTH = 16;
const TITLE_MAX_LINES = 4;
const TITLE_LINE_HEIGHT = 50;
const TAG_LIMIT = 5;
const TAG_WIDTH = 128;
const TAG_STEP = 140;
const X = 52;

export const OG_COLORS = {
  canvas: "#faf8f1",
  surface: "#efe9de",
  border: "#e6dfd0",
  tag: "#ebe3d4",
  tagText: "#6c6a64",
  label: "#cf7551",
  title: "#1f1d1a",
  muted: "#6c6a64",
  divider: "#e2d9c9",
} as const;

const FONT_CJK =
  "Noto Sans CJK JP,Noto Sans JP,Yu Gothic,MS Gothic,Hiragino Kaku Gothic ProN,system-ui,sans-serif";

export function escapeSvg(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function wrapTitle(text: string, maxWidth = TITLE_MAX_WIDTH): string[] {
  const isCJK = (ch: string) => /[⺀-鿿豈-﫿︰-﹏！-｠￠-￦]/.test(ch);
  const lines: string[] = [];
  let current = "";
  let currentWidth = 0;

  for (const ch of text) {
    const width = isCJK(ch) ? 1 : 0.55;
    if (currentWidth + width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
      currentWidth = width;
    } else {
      current += ch;
      currentWidth += width;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function renderTitle(title: string): string {
  const lines = wrapTitle(title);
  const capped = lines.slice(0, TITLE_MAX_LINES);
  if (lines.length > TITLE_MAX_LINES) capped[TITLE_MAX_LINES - 1] += "...";

  const totalHeight = capped.length * TITLE_LINE_HEIGHT;
  const startY = 210 - totalHeight / 2 + TITLE_LINE_HEIGHT * 0.8;

  return capped
    .map(
      (line, index) =>
        `<text x="${X}" y="${startY + index * TITLE_LINE_HEIGHT}" fill="${OG_COLORS.title}" font-size="36" font-weight="700" font-family="${FONT_CJK}">${escapeSvg(line)}</text>`
    )
    .join("");
}

function renderTags(tags: string[]): string {
  return tags
    .slice(0, TAG_LIMIT)
    .map((tag, index) => {
      const tagX = X + index * TAG_STEP;
      const display = tag.length > 13 ? `${tag.slice(0, 12)}...` : tag;
      return `<g>
        <rect x="${tagX}" y="385" width="${TAG_WIDTH}" height="26" rx="13" fill="${OG_COLORS.tag}"/>
        <text x="${tagX + TAG_WIDTH / 2}" y="403" text-anchor="middle" fill="${OG_COLORS.tagText}" font-size="12" font-family="system-ui,sans-serif">${escapeSvg(display)}</text>
      </g>`;
    })
    .join("");
}

export function buildCollectionOgSvg({
  label,
  title,
  tags = [],
}: {
  label: string;
  title: string;
  tags?: string[];
}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" width="${SVG_WIDTH}" height="${SVG_HEIGHT}">
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="${OG_COLORS.canvas}"/>
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="none" stroke="${OG_COLORS.border}" stroke-width="2"/>
  <rect x="${X}" y="60" width="4" height="36" rx="2" fill="${OG_COLORS.label}"/>
  <text x="66" y="84" fill="${OG_COLORS.label}" font-size="13" font-family="system-ui,sans-serif" font-weight="700" letter-spacing="2">${escapeSvg(label)}</text>
  ${renderTitle(title)}
  ${renderTags(tags)}
  <text x="748" y="430" text-anchor="end" fill="${OG_COLORS.muted}" font-size="13" font-family="system-ui,sans-serif">${SITE.ownerName}</text>
</svg>`;
}

export function renderPngResponse(svg: string, cacheControl = "public, max-age=31536000, immutable"): Response {
  const resvg = new Resvg(svg, {
    font: { loadSystemFonts: true },
  });

  return new Response(resvg.render().asPng(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": cacheControl,
    },
  });
}

