/**
 * Prüft die Rechtstexte im fertigen Build.
 *
 *   node scripts/check-legal.mjs            → Fehler brechen ab, Hinweise nicht
 *   node scripts/check-legal.mjs --strict   → auch offene Platzhalter brechen ab
 *
 * Geprüft wird gegen dist/, ohne Netzwerk.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const strict = process.argv.includes("--strict");

const errors = [];
const notes = [];
const placeholders = [];

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

const text = (html) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

const pages = [];
for await (const file of walk(distDir)) {
  const html = await readFile(file, "utf8");
  pages.push({ file: relative(root, file), html, text: text(html) });
}

if (!pages.length) {
  console.error("✖ Kein Build gefunden – bitte zuerst `npm run build` ausführen.");
  process.exit(1);
}

const find = (name) => pages.find((p) => p.file.includes(name));
const impressum = find("impressum");
const datenschutz = find("datenschutz");

/* ------------------------------------------------------------------ *
 * 1. Existieren die Rechtstexte überhaupt?
 * ------------------------------------------------------------------ */
if (!impressum) errors.push("Es gibt keine Impressum-Seite im Build.");
if (!datenschutz) errors.push("Es gibt keine Datenschutz-Seite im Build.");

/* ------------------------------------------------------------------ *
 * 2. Sind sie von jeder Seite aus erreichbar? (§ 5 DDG: "ständig verfügbar")
 * ------------------------------------------------------------------ */
for (const page of pages) {
  for (const target of ["/impressum", "/datenschutz"]) {
    if (!page.html.includes(`href="${target}"`)) {
      errors.push(`${page.file} verlinkt ${target} nicht.`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 3. Pflichtinhalte im Impressum
 * ------------------------------------------------------------------ */
if (impressum) {
  // § 5 Abs. 1 Nr. 2 DDG verlangt ausdrücklich eine E-Mail-Adresse
  if (!/href="mailto:/.test(impressum.html)) {
    errors.push("Im Impressum fehlt eine E-Mail-Adresse (§ 5 Abs. 1 Nr. 2 DDG).");
  }
  if (!/§ ?18 Abs\. ?2 MStV/.test(impressum.text)) {
    errors.push("Im Impressum fehlt der Verantwortliche nach § 18 Abs. 2 MStV.");
  }
  if (!/§ ?5 (Digitale-Dienste-Gesetz|DDG)/.test(impressum.text)) {
    errors.push("Im Impressum fehlt der Verweis auf § 5 DDG.");
  }
  // Das TMG wurde im Mai 2024 durch das DDG abgelöst
  if (/§ ?5 TMG|Telemediengesetz/.test(impressum.text)) {
    errors.push("Das Impressum beruft sich auf das TMG – seit Mai 2024 gilt das DDG.");
  }
}

/* ------------------------------------------------------------------ *
 * 4. Die OS-Plattform wurde am 20.07.2025 abgeschaltet. Ein verbliebener
 *    Hinweis darauf ist irreführend und damit wettbewerbsrechtlich angreifbar.
 * ------------------------------------------------------------------ */
const osPatterns = [
  /ec\.europa\.eu\/consumers\/odr/i,
  /webgate\.ec\.europa\.eu\/odr/i,
  /OS-Plattform/i,
  /Plattform zur Online-Streitbeilegung/i,
  /Online-Streitbeilegung \(OS\)/i,
  /EU-Streitschlichtung/i,
];
for (const page of pages) {
  for (const pattern of osPatterns) {
    if (pattern.test(page.html)) {
      errors.push(
        `${page.file} verweist noch auf die OS-Plattform (${pattern.source}). ` +
          "Die Plattform ist seit dem 20.07.2025 abgeschaltet, der Hinweis ist zu entfernen.",
      );
    }
  }
}

/* ------------------------------------------------------------------ *
 * 5. Datenschutzerklärung: Kernangaben nach Art. 13 DSGVO
 * ------------------------------------------------------------------ */
if (datenschutz) {
  const required = [
    [/Verantwortlich/i, "die verantwortliche Stelle"],
    [/Art\. ?6 Abs\. ?1/i, "die Rechtsgrundlagen der Verarbeitung"],
    [/Art\. ?15 DSGVO/i, "die Betroffenenrechte"],
    [/Aufsichtsbehörde/i, "das Beschwerderecht bei der Aufsichtsbehörde"],
    [/Speicher|Löschung|gelöscht/i, "Angaben zur Speicherdauer"],
  ];
  for (const [pattern, label] of required) {
    if (!pattern.test(datenschutz.text)) {
      errors.push(`In der Datenschutzerklärung fehlen Angaben über ${label}.`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 6. Ein konfigurierter Formulardienst empfängt personenbezogene Daten und
 *    muss deshalb in der Datenschutzerklärung genannt sein
 *    (Art. 13 Abs. 1 lit. e DSGVO).
 * ------------------------------------------------------------------ */
for (const page of pages) {
  const endpoint = /data-endpoint="(https?:\/\/[^"]+)"/.exec(page.html)?.[1];
  if (!endpoint) continue;

  const host = new URL(endpoint).host;
  if (!datenschutz?.text.includes(host)) {
    errors.push(
      `${page.file} sendet das Kontaktformular an ${host}, die ` +
        "Datenschutzerklärung nennt diesen Empfänger aber nicht.",
    );
  }
}

/* ------------------------------------------------------------------ *
 * 7. Offene Platzhalter
 * ------------------------------------------------------------------ */
for (const page of pages) {
  const matches = [...page.text.matchAll(/TODO_IMPRESSUM:?\s*([^<"]{0,90})/g)];
  for (const match of new Set(matches.map((m) => m[1].trim()))) {
    placeholders.push(`${page.file}: ${match}`);
  }
}

/* ------------------------------------------------------------------ *
 * 8. Hinweise – kein Fehler, aber vor dem gewerblichen Betrieb zu klären
 * ------------------------------------------------------------------ */
if (impressum) {
  const hasVatId = /Umsatzsteuer-Identifikationsnummer/i.test(impressum.text);
  const hasSmallBusiness = /Kleinunternehmer/i.test(impressum.text);
  if (!hasVatId && !hasSmallBusiness) {
    notes.push(
      "Weder USt-IdNr. noch Kleinunternehmer-Hinweis gefunden. " +
        "§ 5 Abs. 1 Nr. 6 DDG verlangt die USt-IdNr. nur, soweit vorhanden – " +
        "als Kleinunternehmer gehört der Hinweis nach § 19 UStG ins Impressum.",
    );
  }
  if (!/Zuständige Kammer/i.test(impressum.text)) {
    notes.push(
      "Keine Kammer angegeben. Das Elektrotechnikerhandwerk ist nach Anlage A " +
        "HwO zulassungspflichtig – Kammer, Berufsbezeichnung und Verleihungsstaat " +
        "sind nach § 5 Abs. 1 Nr. 5 DDG Pflicht.",
    );
  }
  if (!/Gesetzliche Berufsbezeichnung/i.test(impressum.text)) {
    notes.push(
      "Keine Berufsbezeichnung angegeben (§ 5 Abs. 1 Nr. 5 DDG). " +
        "Es muss die tatsächlich verliehene Bezeichnung stehen " +
        "(z. B. Elektrotechnikermeister).",
    );
  }
}
if (datenschutz && /einem externen Hosting-Dienstleister/.test(datenschutz.text)) {
  notes.push(
    "Der Hosting-Anbieter ist nur als Kategorie genannt. Das genügt " +
      "Art. 13 Abs. 1 lit. e DSGVO, besser ist der konkrete Name " +
      "(legal.hostingProvider in src/data/site.ts).",
  );
}

/* ------------------------------------------------------------------ *
 * Ausgabe
 * ------------------------------------------------------------------ */
const unique = (list) => [...new Set(list)];

for (const note of unique(notes)) console.log(`  ℹ ${note}`);
if (notes.length) console.log("");

if (placeholders.length) {
  const icon = strict ? "✖" : "⚠";
  console.log(`${icon} ${placeholders.length} offene Pflichtangabe(n):`);
  for (const item of unique(placeholders)) console.log(`    – ${item}`);
  console.log("\nZu pflegen im Objekt `legal` in src/data/site.ts.\n");
}

if (errors.length) {
  console.error(`✖ ${errors.length} Fehler in den Rechtstexten:\n`);
  for (const error of unique(errors)) console.error(`    – ${error}`);
  console.error("");
  process.exit(1);
}

if (strict && placeholders.length) {
  console.log("Strict-Modus: Build gilt als nicht release-fertig.");
  process.exit(1);
}

console.log(
  `✓ Rechtstexte: ${pages.length} Seiten geprüft, keine Fehler` +
    (notes.length ? `, ${unique(notes).length} Hinweis(e)` : "") +
    ".",
);
