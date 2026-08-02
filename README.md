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
scripts/         Build- und Prüfskripte (Node, laufen ohne Netzwerk)
```

Inhalte werden nicht in den Komponenten gepflegt, sondern in
[`src/data/site.ts`](src/data/site.ts). Leistungen, FAQ-Einträge, Prozessschritte
und Kontaktdaten liegen dort als typisierte Arrays.

## Rechtstexte

Impressum und Datenschutzerklärung werden aus dem Objekt `legal` in
[`src/data/site.ts`](src/data/site.ts) gespeist. Pflichtangaben nach § 5 DDG –
Anbieter, Anschrift, E-Mail und der Verantwortliche nach § 18 Abs. 2 MStV –
sind gesetzt.

Vier Felder sind bewusst leer und werden nur gerendert, wenn sie gefüllt sind:

| Feld                              | Wann nötig                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `vatId`                           | bei gewerblichem Betrieb, sofern eine USt-IdNr. vorhanden ist (§ 5 Abs. 1 Nr. 6 DDG)                    |
| `chamber`, `jobTitle`             | bei gewerblichem Betrieb Pflicht – das Elektrotechnikerhandwerk ist nach Anlage A HwO zulassungspflichtig |
| `hostingProvider`                 | optional; ohne Angabe nennt die Erklärung die Kategorie statt des Namens, was Art. 13 Abs. 1 lit. e DSGVO genügt |

`npm run check:legal` meldet diese Punkte als Hinweis und prüft zusätzlich die
harten Anforderungen: Erreichbarkeit beider Seiten von jeder Seite aus,
E-Mail-Adresse im Impressum, § 18 MStV, Verweis auf das DDG statt auf das
abgelöste TMG sowie die Kernangaben nach Art. 13 DSGVO.

Der Check schlägt außerdem fehl, sobald irgendwo wieder ein Hinweis auf die
**OS-Plattform** auftaucht. Die EU hat sie am 20.07.2025 abgeschaltet; ein
verbliebener Verweis gilt als irreführend und ist abmahnfähig.

`npm run check:privacy` durchsucht den Build nach Subressourcen fremder
Herkunft – Schriften-CDNs, eingebettete Karten, Analyse-Skripte. Solange nichts
gefunden wird, stimmt die Zusage der Datenschutzerklärung, dass beim Aufruf
keine Anfrage an einen fremden Server geht. Reine `<a href>`-Links werden nicht
beanstandet, weil sie erst beim Klick eine Verbindung auslösen.

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

- **`trailingSlash: "never"`** – der Host sollte `/impressum` auf
  `/impressum/index.html` auflösen. Netlify, Vercel und Cloudflare Pages tun das
  von Haus aus.
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
