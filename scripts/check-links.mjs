/**
 * Interner Link-Check auf dem fertigen Build.
 *
 * Prüft, ob jeder interne href entweder auf eine gebaute Seite, eine Datei in
 * public/ oder einen existierenden Anker auf der Zielseite zeigt. Externe
 * Links, mailto: und tel: werden bewusst nicht angefasst – das Skript soll
 * ohne Netzwerk laufen.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");

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

const exists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

/** dist-Pfad(e), unter denen eine URL wie /impressum liegen könnte */
const candidates = (urlPath) => {
  const clean = urlPath.replace(/\/$/, "") || "/index";
  return [
    join(distDir, clean),
    join(distDir, `${clean}.html`),
    join(distDir, clean, "index.html"),
  ];
};

const pages = [];
for await (const file of walk(distDir)) {
  pages.push({ file, html: await readFile(file, "utf8") });
}

if (!pages.length) {
  console.error("✖ Kein Build gefunden – bitte zuerst `npm run build` ausführen.");
  process.exit(1);
}

/** id-Attribute je gebauter Seite, für Anker-Prüfung */
const anchorsByPath = new Map();
for (const page of pages) {
  const urlPath =
    "/" +
    relative(distDir, page.file)
      .replace(/\\/g, "/")
      .replace(/index\.html$/, "")
      .replace(/\.html$/, "")
      .replace(/\/$/, "");
  const ids = new Set([...page.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  anchorsByPath.set(urlPath === "/" ? "/" : urlPath, ids);
}

const problems = [];
let checked = 0;

for (const page of pages) {
  const from = "/" + relative(distDir, page.file).replace(/\\/g, "/");
  const hrefs = [...page.html.matchAll(/\shref="([^"]+)"/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) {
      // reiner Anker: gegen die eigene Seite prüfen
      if (href.startsWith("#") && href.length > 1) {
        checked++;
        const selfPath =
          "/" +
          relative(distDir, page.file)
            .replace(/\\/g, "/")
            .replace(/index\.html$/, "")
            .replace(/\.html$/, "")
            .replace(/\/$/, "");
        const ids = anchorsByPath.get(selfPath === "/" ? "/" : selfPath);
        if (ids && !ids.has(href.slice(1))) {
          problems.push(`${from} → ${href} (Anker nicht gefunden)`);
        }
      }
      continue;
    }
    if (!href.startsWith("/")) continue;

    checked++;
    const [rawPath, hash] = href.split("#");
    const urlPath = rawPath.replace(/\/$/, "") || "/";

    const found = (await Promise.all(candidates(urlPath).map(exists))).some(Boolean);
    if (!found) {
      problems.push(`${from} → ${href} (Ziel existiert nicht)`);
      continue;
    }

    if (hash) {
      const ids = anchorsByPath.get(urlPath);
      if (ids && !ids.has(hash)) {
        problems.push(`${from} → ${href} (Anker "#${hash}" nicht gefunden)`);
      }
    }
  }
}

if (problems.length) {
  console.error(`✖ ${problems.length} defekte interne Verweise:\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(
  `✓ Link-Check: ${checked} interne Verweise auf ${pages.length} Seiten in Ordnung.`,
);
