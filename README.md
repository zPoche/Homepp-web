# Bootlabs Web

Website für Bootlabs. Statisch generiert mit [Astro](https://astro.build) und
[Tailwind CSS](https://tailwindcss.com). Kein Tracking, keine Cookies, keine
externen CDNs – die Seite liefert alles vom eigenen Server aus.

## Status

Das Repo ist als Gerüst eingerichtet. Firmendaten, Leistungen, FAQ und Brand-
Assets werden in `src/data/site.ts` bzw. `public/brand/` nachgeliefert.
Leere Pflichtangaben werden bewusst nicht erfunden.

## Schnellstart

```bash
npm install
npm run dev      # http://localhost:4321
```

Node 22.12 oder neuer wird vorausgesetzt.

## Skripte

| Befehl                     | Zweck                                                              |
| -------------------------- | ------------------------------------------------------------------ |
| `npm run dev`              | Entwicklungsserver mit Hot Reload                                   |
| `npm run build`            | Produktionsbuild nach `dist/`                                       |
| `npm run preview`          | Produktionsbuild lokal ausliefern                                   |
| `npm run assets`           | `og.png` und `apple-touch-icon.png` neu erzeugen                    |
| `npm run typecheck`        | `astro check` über alle Komponenten                                 |
| `npm run format`           | Prettier über das Projekt                                           |
| `npm run check:links`      | interne Links und Sprungmarken im Build prüfen                      |
| `npm run check:typography` | zusammengeklebte Wörter im gerenderten HTML finden                  |
| `npm run check:privacy`    | Build auf Ressourcen von Drittanbietern durchsuchen                 |
| `npm run check:legal`      | Impressum und Datenschutzerklärung auf Pflichtinhalte prüfen        |
| `npm run check`            | alles der Reihe nach – das, was auch die CI ausführt                |
| `npm run lighthouse`       | Lighthouse CI gegen den Build                                       |

## Projektstruktur

```
src/
  components/    Sektionen der Startseite (Hero, Services, FAQ, Kontakt …)
  data/site.ts   Firmendaten, Leistungen, FAQ, Prozess – zentrale Inhaltsquelle
  layouts/       Base.astro (SEO, Fonts, JSON-LD) und Legal.astro
  pages/         index, impressum, datenschutz, 404
  scripts/       Client-JS: Scroll-Reveals, Canvas-Hero, Kontaktformular
  styles/        Design-Tokens und Utilities für Tailwind
public/brand/    Logos (Wordmark, Marke)
scripts/         Build- und Prüfskripte (Node, laufen ohne Netzwerk)
```

Favicon, Apple-Touch-Icon und Open-Graph-Bild werden aus `public/brand/`
abgeleitet (`npm run assets`). Neue Logo-Dateien dort ablegen und Assets neu
generieren.

Inhalte werden nicht in den Komponenten gepflegt, sondern in
[`src/data/site.ts`](src/data/site.ts).

## Rechtstexte

Impressum und Datenschutzerklärung speisen sich aus dem Objekt `legal` in
[`src/data/site.ts`](src/data/site.ts). Fehlende Werte bleiben leer und werden
nicht gerendert.

`npm run check:legal` prüft Pflichtinhalte, DDG statt TMG sowie die
Kernangaben nach Art. 13 DSGVO. Ein Verweis auf die **OS-Plattform** lässt den
Check fehlschlagen – die EU hat sie am 20.07.2025 abgeschaltet.

`npm run check:privacy` durchsucht den Build nach Subressourcen fremder
Herkunft.

## Kontaktformular

Ohne Konfiguration öffnet das Formular den Mailclient des Besuchers. Standard
ist **`/api/contact.php`** – Empfängeradresse dort setzen, sobald die
Betriebs-E-Mail feststeht.

```bash
# Optional überschreiben oder mailto-Fallback erzwingen:
# PUBLIC_CONTACT_ENDPOINT="https://formspree.io/f/xxxxxxx"
# PUBLIC_CONTACT_ENDPOINT=""
```

## Deployment

`npm run build` erzeugt `dist/`.

- **`trailingSlash: "always"`** – Links lauten `/impressum/` und `/datenschutz/`.
- **`site` in `astro.config.mjs`** – aktuell `https://bootlabs.de`; bei anderer
  Domain anpassen (Canonical, Sitemap, Open Graph).

## Automationen

| Workflow                                                   | Auslöser           | Aufgabe                                                                            |
| ---------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| [`ci.yml`](.github/workflows/ci.yml)                       | Push, Pull Request | Format, Typen, Build, Link-, Typografie-, Datenschutz- und Rechtstext-Check, Lighthouse |
| [`release-check.yml`](.github/workflows/release-check.yml) | manuell, Tag `v*`  | wie oben, schlägt aber zusätzlich bei offenen Platzhaltern fehl                      |

## Barrierefreiheit und Motion

Alle Animationen respektieren `prefers-reduced-motion`.
