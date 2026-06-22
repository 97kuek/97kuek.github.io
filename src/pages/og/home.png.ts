import type { APIRoute } from "astro";
import { escapeSvg, OG_COLORS, renderPngResponse } from "../../utils/ogImage";
import { SITE } from "../../utils/site";

export const prerender = true;

function buildSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <rect width="800" height="450" fill="${OG_COLORS.canvas}"/>
  <rect width="800" height="450" fill="none" stroke="${OG_COLORS.border}" stroke-width="2"/>
  <rect x="52" y="60" width="4" height="36" rx="2" fill="${OG_COLORS.label}"/>
  <text x="66" y="84" fill="${OG_COLORS.label}" font-size="13" font-family="system-ui,sans-serif" font-weight="700" letter-spacing="2">PORTFOLIO</text>
  <text x="52" y="158" fill="${OG_COLORS.muted}" font-size="18" font-family="Noto Sans CJK JP,Noto Sans JP,Yu Gothic,MS Gothic,Hiragino Kaku Gothic ProN,system-ui,sans-serif" letter-spacing="3">${escapeSvg("植木 敬太郎")}</text>
  <text x="52" y="222" fill="${OG_COLORS.title}" font-size="52" font-weight="700" font-family="system-ui,-apple-system,sans-serif">${escapeSvg(SITE.ownerName)}</text>
  <rect x="52" y="238" width="340" height="2" rx="1" fill="${OG_COLORS.divider}"/>
  <text x="52" y="276" fill="${OG_COLORS.muted}" font-size="18" font-family="system-ui,sans-serif">${escapeSvg("Waseda FSE / WASA Birdman PM")}</text>
  <g>
    <rect x="52" y="310" width="100" height="26" rx="13" fill="${OG_COLORS.tag}"/>
    <text x="102" y="327" text-anchor="middle" fill="${OG_COLORS.tagText}" font-size="12" font-family="system-ui,sans-serif">Python</text>
  </g>
  <g>
    <rect x="162" y="310" width="100" height="26" rx="13" fill="${OG_COLORS.tag}"/>
    <text x="212" y="327" text-anchor="middle" fill="${OG_COLORS.tagText}" font-size="12" font-family="system-ui,sans-serif">Next.js</text>
  </g>
  <g>
    <rect x="272" y="310" width="100" height="26" rx="13" fill="${OG_COLORS.tag}"/>
    <text x="322" y="327" text-anchor="middle" fill="${OG_COLORS.tagText}" font-size="12" font-family="system-ui,sans-serif">C</text>
  </g>
  <text x="748" y="430" text-anchor="end" fill="${OG_COLORS.muted}" font-size="13" font-family="system-ui,sans-serif">${SITE.domain}</text>
</svg>`;
}

export const GET: APIRoute = async () => {
  return renderPngResponse(buildSvg(), "public, max-age=86400");
};
