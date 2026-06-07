import type { APIRoute } from "astro";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const prerender = true;

const avatarPath = join(process.cwd(), "src/assets/hero/avatar.jpg");
let avatarDataUri = "";
try {
  avatarDataUri = `data:image/jpeg;base64,${readFileSync(avatarPath).toString("base64")}`;
} catch {
  // render without avatar
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2d3748"/>
      <stop offset="100%" stop-color="#4a5568"/>
    </linearGradient>
    ${avatarDataUri ? `<clipPath id="av"><circle cx="600" cy="200" r="100"/></clipPath>` : ""}
  </defs>
  <rect width="800" height="450" fill="url(#g)"/>
  <circle cx="750" cy="50" r="200" fill="rgba(255,255,255,0.05)"/>
  <circle cx="50" cy="400" r="160" fill="rgba(255,255,255,0.05)"/>
  <rect y="390" width="800" height="60" fill="rgba(0,0,0,0.3)"/>

  <!-- Name Japanese -->
  <text x="52" y="148" fill="rgba(255,255,255,0.5)" font-size="18" font-family="Noto Sans CJK JP,Noto Sans JP,Yu Gothic,MS Gothic,Hiragino Kaku Gothic ProN,sans-serif" font-weight="400" letter-spacing="4">${esc("植木 敬太郎")}</text>

  <!-- Name English -->
  <text x="52" y="215" fill="white" font-size="52" font-weight="700" font-family="system-ui,-apple-system,sans-serif">${esc("Keitaro Ueki")}</text>

  <!-- Divider line -->
  <rect x="52" y="232" width="320" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>

  <!-- Title line 1 -->
  <text x="52" y="272" fill="rgba(255,255,255,0.75)" font-size="18" font-family="system-ui,-apple-system,sans-serif">${esc("Waseda FSE · WASA Birdman PM")}</text>

  <!-- Tag row -->
  <g>
    <rect x="52" y="310" width="100" height="26" rx="13" fill="rgba(255,255,255,0.15)"/>
    <text x="102" y="327" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="12" font-family="sans-serif">Python</text>
  </g>
  <g>
    <rect x="162" y="310" width="100" height="26" rx="13" fill="rgba(255,255,255,0.15)"/>
    <text x="212" y="327" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="12" font-family="sans-serif">Next.js</text>
  </g>
  <g>
    <rect x="272" y="310" width="100" height="26" rx="13" fill="rgba(255,255,255,0.15)"/>
    <text x="322" y="327" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="12" font-family="sans-serif">C</text>
  </g>

  <!-- Avatar -->
  ${avatarDataUri ? `<circle cx="600" cy="200" r="104" fill="rgba(255,255,255,0.15)"/>
  <image xlink:href="${avatarDataUri}" x="500" y="100" width="200" height="200" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice"/>` : ""}

  <!-- Footer -->
  <text x="52" y="422" fill="rgba(255,255,255,0.55)" font-size="13" font-family="sans-serif">97kuek.github.io</text>
  <text x="748" y="422" text-anchor="end" fill="rgba(255,255,255,0.55)" font-size="13" font-family="sans-serif">Portfolio</text>
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
