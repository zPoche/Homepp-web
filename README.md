# Homepp-web

Website für [HomePowerPlus.de](https://homepowerplus.de) – Smart Home, Netzwerk,
Sicherheitstechnik und Elektroinstallation aus Geiselwind.

Statisch generiert mit [Astro](https://astro.build) und
[Tailwind CSS](https://tailwindcss.com). Kein Tracking, keine Cookies, keine
externen CDNs – die Seite liefert alles vom eigenen Server aus.

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
| `npm run check:typography` | zusammengeklebte Wörter im gerenderten Text finden                  |
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
public/brand/    Original-Logos (Wordmark, HP+-Marke, Variante auf Hell)
scripts/         Build- und Prüfskripte (Node, laufen ohne Netzwerk)
```

Favicon, Apple-Touch-Icon und Open-Graph-Bild werden aus `public/brand/`
abgeleitet (`npm run assets`). Neue Logo-Dateien dort ablegen und Assets neu
generieren.

Inhalte werden nicht in den Komponenten gepflegt, sondern in
[`src/data/site.ts`](src/data/site.ts). Leistungen, FAQ-Einträge, Prozessschritte
und Kontaktdaten liegen dort als typisierte Arrays.

## Rechtstexte

Impressum und Datenschutzerklärung speisen sich aus dem Objekt `legal` in
[`src/data/site.ts`](src/data/site.ts).

Aktuell hinterlegt:

- Firmensitz: Langäcker 15, 96160 Geiselwind
- Ladungsfähige Anschrift: c/o Online-Impressum.de (Sankt Augustin)
- Kammer: Handwerkskammer für Unterfranken
- Berufsbezeichnung: Elektrotechnikermeister (Verleihungsstaat Deutschland)
- Umsatzsteuer: Kleinunternehmer nach § 19 UStG (keine USt-IdNr.)
- Datenschutz-Aufsicht: BayLDA (Firmensitz Bayern)

`hostingProvider` bleibt leer, bis der Host feststeht; die Datenschutzerklärung
nennt dann die Kategorie statt des Namens (Art. 13 Abs. 1 lit. e DSGVO).

`npm run check:legal` prüft Pflichtinhalte, DDG statt TMG, den
Kleinunternehmer-/USt-Hinweis, Kammer und Berufsbezeichnung sowie die
Kernangaben nach Art. 13 DSGVO. Ein Verweis auf die **OS-Plattform** lässt den
Check fehlschlagen – die EU hat sie am 20.07.2025 abgeschaltet.

`npm run check:privacy` durchsucht den Build nach Subressourcen fremder
Herkunft. Solange nichts gefunden wird, stimmt die Zusage der
Datenschutzerklärung, dass beim Aufruf keine Anfrage an einen fremden Server
geht.

## Kontaktformular

Ohne Konfiguration öffnet das Formular den Mailclient des Besuchers mit einer
fertig ausgefüllten Nachricht. Das funktioniert überall, ist aber nicht
besonders komfortabel.

Für echten Formularversand einen Endpoint hinterlegen (Formspree, Basin, eine
eigene Serverless Function – alles, was `multipart/form-data` per POST annimmt):

```bash
# .env
PUBLIC_CONTACT_ENDPOINT="https://formspree.io/f/xxxxxxx"
```

Der Wert landet im ausgelieferten HTML, gehört also nur an Stellen, die
öffentlich sein dürfen. Das Formular hat ein Honeypot-Feld gegen Bots und
verlangt eine ausdrückliche Einwilligung in die Datenschutzerklärung.

## Deployment

Der Build ist rein statisch. `npm run build` erzeugt `dist/`, das jeder
Static-Host ausliefern kann (Netlify, Vercel, Cloudflare Pages, oder klassisch
per FTP auf einen Webspace).

Zwei Punkte sind wichtig:

- **`trailingSlash: "always"`** – Links lauten `/impressum/` und
  `/datenschutz/`. Auf Plesk/Passenger liefert der Pfad ohne Slash einen 500;
  `public/.htaccess` leitet Verzeichnisse zusätzlich auf die Slash-Variante um.
- **`site` in `astro.config.mjs`** – steht auf `https://homepowerplus.de` und
  bestimmt Canonical-URLs, Sitemap und Open-Graph-Bild. Bei einer anderen Domain
  anpassen.

## Automationen

| Workflow                                                   | Auslöser           | Aufgabe                                                                            |
| ---------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| [`ci.yml`](.github/workflows/ci.yml)                       | Push, Pull Request | Format, Typen, Build, Link-, Typografie-, Datenschutz- und Rechtstext-Check, Lighthouse |
| [`release-check.yml`](.github/workflows/release-check.yml) | manuell, Tag `v*`  | wie oben, schlägt aber zusätzlich bei offenen Platzhaltern fehl                      |

Die Prüfskripte in `scripts/` laufen ohne Netzwerk gegen `dist/` und lassen sich
jederzeit lokal ausführen.

## Barrierefreiheit und Motion

Alle Animationen respektieren `prefers-reduced-motion`. Das Partikelnetz im Hero
zeichnet dann ein Standbild statt zu animieren, Scroll-Reveals sind sofort
sichtbar, das Logo-Laufband steht still. Der Hero-Canvas pausiert außerdem,
sobald er aus dem Viewport scrollt oder der Tab in den Hintergrund wechselt.
