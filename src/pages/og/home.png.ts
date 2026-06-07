import type { APIRoute } from "astro";
import { Resvg } from "@resvg/resvg-js";

export const prerender = true;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <rect width="800" height="450" fill="#f8fafc"/>
  <rect width="800" height="450" fill="none" stroke="#e2e8f0" stroke-width="2"/>
  <rect x="52" y="60" width="4" height="36" rx="2" fill="#4a5568"/>
  <text x="66" y="84" fill="#4a5568" font-size="13" font-family="system-ui,sans-serif" font-weight="700" letter-spacing="2">PORTFOLIO</text>
  <text x="52" y="158" fill="#94a3b8" font-size="18" font-family="Noto Sans CJK JP,Noto Sans JP,Yu Gothic,MS Gothic,Hiragino Kaku Gothic ProN,system-ui,sans-serif" letter-spacing="3">${esc("植木 敬太郎")}</text>
  <text x="52" y="222" fill="#1e293b" font-size="52" font-weight="700" font-family="system-ui,-apple-system,sans-serif">${esc("Keitaro Ueki")}</text>
  <rect x="52" y="238" width="340" height="2" rx="1" fill="#e2e8f0"/>
  <text x="52" y="276" fill="#64748b" font-size="18" font-family="system-ui,sans-serif">${esc("Waseda FSE · WASA Birdman PM")}</text>
  <g>
    <rect x="52" y="310" width="100" height="26" rx="13" fill="#e2e8f0"/>
    <text x="102" y="327" text-anchor="middle" fill="#475569" font-size="12" font-family="system-ui,sans-serif">Python</text>
  </g>
  <g>
    <rect x="162" y="310" width="100" height="26" rx="13" fill="#e2e8f0"/>
    <text x="212" y="327" text-anchor="middle" fill="#475569" font-size="12" font-family="system-ui,sans-serif">Next.js</text>
  </g>
  <g>
    <rect x="272" y="310" width="100" height="26" rx="13" fill="#e2e8f0"/>
    <text x="322" y="327" text-anchor="middle" fill="#475569" font-size="12" font-family="system-ui,sans-serif">C</text>
  </g>
  <text x="748" y="430" text-anchor="end" fill="#94a3b8" font-size="13" font-family="system-ui,sans-serif">97kuek.github.io</text>
</svg>`;
}

export const GET: APIRoute = async () => {
  const svg = buildSvg();

  const resvg = new Resvg(svg, {
    font: { loadSystemFonts: true },
  });

  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
