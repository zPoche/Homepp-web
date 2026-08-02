/**
 * Prüft, ob der Build wirklich ohne Drittanbieter auskommt.
 *
 * Die Datenschutzerklärung sagt zu, dass beim Aufruf der Seite keine Anfrage an
 * einen fremden Server geht. Damit das eine überprüfbare Aussage bleibt und
 * nicht bei der nächsten eingebundenen Karte oder Web-Schriftart still
 * unwahr wird, sucht dieses Skript im Build nach Subressourcen fremder Herkunft.
 *
 * Bewusst nicht geprüft werden normale <a href>-Links: die lösen erst beim
 * Klick eine Anfrage aus und sind datenschutzrechtlich unkritisch.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");

/** Formularziele dürfen extern sein – sie werden erst beim Absenden kontaktiert. */
const allowedHosts = [];

async function* walk(dir, extensions) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path, extensions);
    else if (extensions.some((ext) => entry.name.endsWith(ext))) yield path;
  }
}

const findings = [];
let files = 0;

const record = (file, kind, url) => {
  let host;
  try {
    host = new URL(url).host;
  } catch {
    return;
  }
  if (allowedHosts.includes(host)) return;
  findings.push({ file: relative(root, file), kind, url });
};

for await (const file of walk(distDir, [".html"])) {
  files++;
  const html = await readFile(file, "utf8");

  // Attribute, die den Browser ungefragt eine Verbindung aufbauen lassen
  for (const [, attr, url] of html.matchAll(
    /\s(src|srcset|poster|data-src)="(https?:\/\/[^"]+)"/g,
  )) {
    record(file, `${attr}-Attribut`, url);
  }

  // <link> lädt je nach rel ebenfalls sofort
  for (const [, tag] of html.matchAll(/<link\s([^>]+)>/g)) {
    const rel = /rel="([^"]+)"/.exec(tag)?.[1] ?? "";
    const href = /href="(https?:\/\/[^"]+)"/.exec(tag)?.[1];
    if (!href) continue;
    if (
      /stylesheet|preload|prefetch|preconnect|dns-prefetch|modulepreload|icon/.test(rel)
    ) {
      record(file, `link rel="${rel}"`, href);
    }
  }

  for (const [, url] of html.matchAll(/<iframe[^>]*\ssrc="(https?:\/\/[^"]+)"/g)) {
    record(file, "iframe", url);
  }

  // @import und url() in eingebettetem CSS
  for (const [, url] of html.matchAll(
    /@import\s+(?:url\()?["']?(https?:\/\/[^"')]+)/g,
  )) {
    record(file, "CSS @import", url);
  }
}

for await (const file of walk(distDir, [".css"])) {
  const css = await readFile(file, "utf8");
  for (const [, url] of css.matchAll(/url\(\s*["']?(https?:\/\/[^"')]+)/g)) {
    record(file, "CSS url()", url);
  }
  for (const [, url] of css.matchAll(
    /@import\s+(?:url\()?["']?(https?:\/\/[^"')]+)/g,
  )) {
    record(file, "CSS @import", url);
  }
}

if (!files) {
  console.error("✖ Kein Build gefunden – bitte zuerst `npm run build` ausführen.");
  process.exit(1);
}

if (findings.length) {
  console.error(`✖ ${findings.length} Ressource(n) von Drittanbietern:\n`);
  for (const finding of findings) {
    console.error(`    ${finding.file}`);
    console.error(`      ${finding.kind}: ${finding.url}\n`);
  }
  console.error(
    "Entweder die Ressource lokal ausliefern oder die Datenschutzerklärung anpassen\n" +
      "(Abschnitt 2 sagt zu, dass keine externen Inhalte nachgeladen werden).",
  );
  process.exit(1);
}

console.log(`✓ Datenschutz: keine Drittanbieter-Ressourcen in ${files} Seiten.`);
