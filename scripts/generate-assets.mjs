/**
 * Erzeugt Brand- und abgeleitete Bild-Assets:
 *   public/brand/logo-mark.png
 *   public/brand/logo-wordmark.png
 *   public/og.png
 *   public/apple-touch-icon.png
 *   public/favicon.ico
 *   public/favicon.svg
 *
 * Läuft automatisch vor jedem Build (npm run assets / prebuild).
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");
const brandDir = resolve(publicDir, "brand");

const BRAND = "#1eeff2";
const INK = "#05080d";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${INK}"/>
  <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="${BRAND}" stroke-width="2"/>
  <text x="32" y="42" text-anchor="middle" font-family="Outfit, Inter, Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="${BRAND}">B</text>
</svg>`;

const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="192" viewBox="0 0 520 96">
  <text x="0" y="68" font-family="Outfit, Inter, Helvetica, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-1.5" fill="#f3f6f8">Bootlabs</text>
</svg>`;

const ogBaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
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
    <text x="88" y="404" font-size="42" font-weight="500" fill="#8a97a6" letter-spacing="-1">
      Website · Bootlabs
    </text>
    <text x="88" y="536" font-size="27" font-weight="600" fill="${BRAND}" fill-opacity="0.85">
      bootlabs.de
    </text>
  </g>
  <g opacity="0.9">
    <circle cx="1010" cy="330" r="168" fill="none" stroke="${BRAND}" stroke-opacity="0.15"/>
    <circle cx="1010" cy="330" r="118" fill="none" stroke="${BRAND}" stroke-opacity="0.22"/>
    <circle cx="1010" cy="330" r="68" fill="none" stroke="${BRAND}" stroke-opacity="0.3"/>
  </g>
</svg>`;

async function renderIco(pngBuffer, file, size) {
  const png = await sharp(pngBuffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size < 256 ? size : 0, 0);
  entry.writeUInt8(size < 256 ? size : 0, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  const buffer = Buffer.concat([header, entry, png]);
  await writeFile(resolve(publicDir, file), buffer);
  return buffer.length;
}

await mkdir(publicDir, { recursive: true });
await mkdir(brandDir, { recursive: true });

const markPng = await sharp(Buffer.from(markSvg)).png().toBuffer();
const wordmarkPng = await sharp(Buffer.from(wordmarkSvg)).png().toBuffer();

await writeFile(resolve(brandDir, "logo-mark.png"), markPng);
await writeFile(resolve(brandDir, "logo-wordmark.png"), wordmarkPng);
await writeFile(resolve(brandDir, "logo-mark.svg"), markSvg);

const wordmark = await sharp(wordmarkPng)
  .resize({ width: 560, withoutEnlargement: true })
  .png()
  .toBuffer();
const markLarge = await sharp(markPng)
  .resize({ width: 220, withoutEnlargement: true })
  .png()
  .toBuffer();

const og = await sharp(Buffer.from(ogBaseSvg))
  .composite([
    { input: wordmark, left: 88, top: 250 },
    { input: markLarge, left: 900, top: 205 },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile(resolve(publicDir, "og.png"), og);

const apple = await sharp({
  create: {
    width: 180,
    height: 180,
    channels: 4,
    background: { r: 5, g: 8, b: 13, alpha: 1 },
  },
})
  .composite([
    {
      input: await sharp(markPng).resize(140, 140).png().toBuffer(),
      gravity: "center",
    },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile(resolve(publicDir, "apple-touch-icon.png"), apple);

const icoSize = await renderIco(markPng, "favicon.ico", 32);
await copyFile(resolve(brandDir, "logo-mark.svg"), resolve(publicDir, "favicon.svg"));

for (const [name, size] of [
  ["brand/logo-mark.png", markPng.length],
  ["brand/logo-wordmark.png", wordmarkPng.length],
  ["og.png", og.length],
  ["apple-touch-icon.png", apple.length],
  ["favicon.ico", icoSize],
]) {
  console.log(`  ✓ public/${name} (${(size / 1024).toFixed(1)} kB)`);
}
console.log("  ✓ public/favicon.svg (aus brand/logo-mark.svg)");
