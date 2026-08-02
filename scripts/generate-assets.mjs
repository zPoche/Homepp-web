/**
 * Erzeugt die statischen Bild-Assets aus SVG-Quellen:
 *   public/og.png               – Social-Preview 1200x630
 *   public/apple-touch-icon.png – 180x180
 *   public/favicon.ico          – 32x32 für Clients ohne SVG-Favicon
 *
 * Läuft automatisch vor jedem Build (npm run build) und braucht kein
 * Design-Tool. sharp kommt bereits mit Astro mit.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");

const BRAND = "#1eeff2";
const INK = "#05080d";

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="10%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#5566ff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#5566ff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0v64" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BRAND}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${BRAND}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect x="0" y="0" width="1200" height="3" fill="url(#line)"/>

  <g font-family="Outfit, Inter, Helvetica, Arial, sans-serif">
    <text x="88" y="196" font-size="26" font-weight="600" letter-spacing="6" fill="${BRAND}" fill-opacity="0.9">
      ELEKTROTECHNIK · SMART HOME · NETZWERK
    </text>

    <text x="88" y="316" font-size="98" font-weight="700" fill="#ffffff" letter-spacing="-3">
      Home<tspan fill="${BRAND}">Power</tspan><tspan fill="${BRAND}" font-size="58" dy="-34">+</tspan>
    </text>

    <text x="88" y="404" font-size="42" font-weight="500" fill="#8a97a6" letter-spacing="-1">
      Dein Zuhause, intelligent verkabelt.
    </text>

    <text x="88" y="536" font-size="27" font-weight="500" fill="#5d6a79">
      Geiselwind · Würzburg · Kitzingen
    </text>
    <text x="88" y="578" font-size="27" font-weight="600" fill="${BRAND}" fill-opacity="0.85">
      homepowerplus.de
    </text>
  </g>

  <g opacity="0.9">
    <circle cx="1010" cy="330" r="168" fill="none" stroke="${BRAND}" stroke-opacity="0.15"/>
    <circle cx="1010" cy="330" r="118" fill="none" stroke="${BRAND}" stroke-opacity="0.22"/>
    <circle cx="1010" cy="330" r="68" fill="none" stroke="${BRAND}" stroke-opacity="0.3"/>
    <path d="M1024 226 962 344h42l-10 68 64-120h-44l10-66Z" fill="${BRAND}"/>
  </g>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5cf1f7"/>
      <stop offset="100%" stop-color="#06ced8"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="${INK}"/>
  <path d="M35.5 12 20 35h10.5L28 52l16-23.5H33.2L35.5 12Z" fill="url(#g)"/>
</svg>`;

async function toPng(svg, width, height) {
  return sharp(Buffer.from(svg))
    .resize(width, height, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function render(svg, file, width, height) {
  const buffer = await toPng(svg, width, height);
  await writeFile(resolve(publicDir, file), buffer);
  return [file, buffer.length];
}

/**
 * ICO-Container um ein einzelnes PNG. Das ICO-Format erlaubt seit Windows
 * Vista eingebettete PNGs, sodass hier nur 22 Byte Header nötig sind.
 */
async function renderIco(svg, file, size) {
  const png = await toPng(svg, size, size);

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserviert
  header.writeUInt16LE(1, 2); // Typ 1 = Icon
  header.writeUInt16LE(1, 4); // ein Bild

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size < 256 ? size : 0, 0); // Breite
  entry.writeUInt8(size < 256 ? size : 0, 1); // Höhe
  entry.writeUInt8(0, 2); // Farbpalette
  entry.writeUInt8(0, 3); // reserviert
  entry.writeUInt16LE(1, 4); // Farbebenen
  entry.writeUInt16LE(32, 6); // Bits pro Pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  const buffer = Buffer.concat([header, entry, png]);
  await writeFile(resolve(publicDir, file), buffer);
  return [file, buffer.length];
}

await mkdir(publicDir, { recursive: true });

const results = await Promise.all([
  render(ogSvg, "og.png", 1200, 630),
  render(iconSvg, "apple-touch-icon.png", 180, 180),
  renderIco(iconSvg, "favicon.ico", 32),
]);

for (const [name, size] of results) {
  console.log(`  ✓ public/${name} (${(size / 1024).toFixed(1)} kB)`);
}
