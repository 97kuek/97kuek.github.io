// oklch -> linear sRGB -> WCAG relative luminance & contrast (no deps)
function oklchToLinear(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  let R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [R, G, B].map((v) => Math.min(1, Math.max(0, v)));
}
const Y = (L, C, H) => {
  const [r, g, b] = oklchToLinear(L, C, H);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (c1, c2) => {
  const y1 = Y(...c1), y2 = Y(...c2);
  const [hi, lo] = y1 > y2 ? [y1, y2] : [y2, y1];
  return (hi + 0.05) / (lo + 0.05);
};
const f = (n) => n.toFixed(2);

const light = {
  canvas: [0.978, 0.009, 85],
  ink: [0.23, 0.008, 70],
  primary: [0.55, 0.155, 43],
  secondary: [0.53, 0.1, 192],
};
const dark = {
  canvas: [0.205, 0.007, 70],
  ink: [0.94, 0.012, 85],
  primary: [0.74, 0.135, 48],
  secondary: [0.74, 0.1, 190],
};
console.log("LIGHT (need 4.5 body / 3.0 large&UI)");
console.log("  coral  on cream:", f(contrast(light.primary, light.canvas)));
console.log("  teal   on cream:", f(contrast(light.secondary, light.canvas)));
console.log("  ink    on cream:", f(contrast(light.ink, light.canvas)));
console.log("DARK");
console.log("  coral  on ink  :", f(contrast(dark.primary, dark.canvas)));
console.log("  teal   on ink  :", f(contrast(dark.secondary, dark.canvas)));
console.log("  text   on ink  :", f(contrast(dark.ink, dark.canvas)));

// Search for a darker teal/coral (light) that reaches 4.5 on cream, keeping hue.
function findL(C, H, targetL0 = 0.58, target = 4.5) {
  for (let L = targetL0; L >= 0.2; L -= 0.005) {
    if (contrast([L, C, H], light.canvas) >= target) return L;
  }
  return null;
}
console.log("\nTo reach 4.5 on cream (same hue/chroma):");
console.log("  teal  L =", f(findL(0.095, 192)), "(was 0.58)");
console.log("  coral L =", f(findL(0.155, 43)), "(was 0.55)");
console.log("To reach 3.0 (large/UI):");
console.log("  teal  L =", f(findL(0.095, 192, 0.58, 3.0)));
console.log("  coral L =", f(findL(0.155, 43, 0.55, 3.0)));
