/**
 * Prüft den fertigen Build auf offene Pflichtangaben.
 *
 * Impressum (§ 5 DDG) und Datenschutzerklärung enthalten Platzhalter, die nur
 * der Betreiber ausfüllen kann. Dieses Skript verhindert, dass die Seite
 * unbemerkt mit "TODO_IMPRESSUM" live geht.
 *
 *   node scripts/check-legal.mjs            → meldet Funde, Exit 0 (Hinweis)
 *   node scripts/check-legal.mjs --strict   → meldet Funde, Exit 1 (Release)
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const strict = process.argv.includes("--strict");
const MARKER = "TODO_IMPRESSUM";

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

const findings = [];

for await (const file of walk(distDir)) {
  const html = await readFile(file, "utf8");
  if (!html.includes(MARKER)) continue;

  const matches = [...html.matchAll(new RegExp(`${MARKER}:?\\s*([^<"]{0,90})`, "g"))];
  findings.push({
    file: relative(root, file),
    items: [...new Set(matches.map((m) => m[1].trim()))],
  });
}

if (!findings.length) {
  console.log("✓ Rechtsseiten: keine offenen Pflichtangaben gefunden.");
  process.exit(0);
}

const total = findings.reduce((sum, f) => sum + f.items.length, 0);
const icon = strict ? "✖" : "⚠";

console.log(
  `${icon} ${total} offene Pflichtangabe(n) in ${findings.length} Datei(en):\n`,
);
for (const finding of findings) {
  console.log(`  ${finding.file}`);
  for (const item of finding.items) console.log(`    – ${item}`);
  console.log("");
}
console.log("Zu pflegen in src/data/site.ts (Objekt `legal`) sowie");
console.log("in src/pages/datenschutz.astro (Hosting-Anbieter).\n");

if (strict) {
  console.log("Strict-Modus: Build gilt als nicht release-fertig.");
  process.exit(1);
}
