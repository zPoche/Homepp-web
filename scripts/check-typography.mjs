/**
 * Sucht im gebauten HTML nach zusammengeklebten Wörtern.
 *
 * Astro verschluckt Leerzeichen an Zeilenumbrüchen vor Inline-Elementen und
 * Ausdrücken. Aus
 *
 *   Alles, was über die
 *   <span>Standardinstallation</span>
 *
 * wird dann "dieStandardinstallation". Im Fließtext fällt das erst auf, wenn
 * es jemand liest – dieser Check findet es beim Build.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");

/** Schreibweisen, die absichtlich Binnenmajuskeln tragen */
const ALLOWED = [
  "HomePower",
  "HomeAssistant",
  "ESPHome",
  "UniFi",
  "OpenStreetMap",
  "JavaScript",
  "TypeScript",
  "GitHub",
  "YouTube",
  "iPhone",
  "iPad",
  "eBay",
  "macOS",
  "iOS",
  "SmartHome",
  "BayLDA",
  "USt",
  "IdNr",
];

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

/**
 * Inline-Elemente erzeugen im Browser keine Wortgrenze. Sie müssen daher
 * ersatzlos entfernt werden – sonst würde der Check das fehlende Leerzeichen
 * selbst wieder einfügen und nichts mehr finden.
 */
const INLINE =
  "a|span|strong|b|em|i|u|small|sup|sub|abbr|code|mark|tspan|nobr|time|q|cite|s|del|ins|var|kbd|samp";

/** Sichtbaren Text aus dem HTML holen */
function textOf(html) {
  return html
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(new RegExp(`</?(?:${INLINE})(?:\\s[^>]*)?>`, "gi"), "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");
}

// Kleinbuchstabe oder Ziffer direkt vor einem Großbuchstaben, der ein Wort
// fortsetzt – typisches Muster für ein verschlucktes Leerzeichen.
const SUSPECT = /[a-zäöüß0-9][A-ZÄÖÜ][a-zäöüß]{2,}/g;

const problems = [];
let files = 0;

for await (const file of walk(distDir)) {
  files++;
  const text = textOf(await readFile(file, "utf8"));

  for (const match of text.matchAll(SUSPECT)) {
    const start = Math.max(0, match.index - 20);
    const context = text.slice(start, match.index + match[0].length + 20).trim();
    const word = text
      .slice(start, match.index + match[0].length + 24)
      .split(/\s+/)
      .find((w) => w.includes(match[0]));

    if (word && ALLOWED.some((allowed) => word.includes(allowed))) continue;

    problems.push({ file: relative(root, file), word: word ?? match[0], context });
  }
}

if (!files) {
  console.error("✖ Kein Build gefunden – bitte zuerst `npm run build` ausführen.");
  process.exit(1);
}

if (problems.length) {
  console.error(`✖ ${problems.length} vermutlich fehlende Leerzeichen:\n`);
  for (const problem of problems) {
    console.error(`  ${problem.file}: „${problem.word}“`);
    console.error(`    … ${problem.context} …\n`);
  }
  console.error(
    'Fix: {" "} vor dem Element einfügen oder den Ausdruck als Template-String schreiben.',
  );
  console.error(
    "Absichtliche Binnenmajuskeln gehören in die ALLOWED-Liste in diesem Skript.",
  );
  process.exit(1);
}

console.log(`✓ Typografie: keine zusammengeklebten Wörter in ${files} Seiten.`);
