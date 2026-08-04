# Hinweise für Agents

Statische Astro-Website für Bootlabs. Deutschsprachig, Duz-Form,
Dark-Theme mit dem Marken-Cyan `#1EEFF2`.

## Entwicklung

```
npm run dev   # Dev-Server auf Port 4321
npm run check # alles, was auch die CI prüft
```

Nach inhaltlichen oder strukturellen Änderungen immer `npm run check` laufen
lassen. Die Prüfskripte arbeiten gegen `dist/`, brauchen also einen Build.

## Konventionen

- **Inhalte gehören nach `src/data/site.ts`**, nicht in die Komponenten.
  Leistungen, FAQ, Prozessschritte und Kontaktdaten liegen dort typisiert.
- **Kein Framework-JavaScript.** Interaktivität steckt in `src/scripts/` als
  reines TypeScript und wird über `<script>` in Astro-Komponenten eingebunden.
- **Kein externes CDN.** Schriften kommen über `@fontsource-variable`, Icons
  sind Inline-SVG. Das ist eine bewusste DSGVO-Entscheidung, keine Vorliebe.
- **Animationen brauchen einen `prefers-reduced-motion`-Fallback.**
- **`compressHTML` bleibt aus.** Astros HTML-Kompression entfernt sonst
  Leerzeichen vor Inline-Elementen und klebt Wörter zusammen.

## Rechtliches

Impressum und Datenschutzerklärung speisen sich aus dem Objekt `legal` in
`src/data/site.ts`. Angaben dort werden **nie erfunden** – fehlende Werte
bleiben leer und werden dann gar nicht gerendert, statt mit einer Vermutung
gefüllt zu werden.

Zwei Regeln, die `npm run check:legal` erzwingt:

- **Kein Verweis auf die OS-Plattform.** Die EU hat sie am 20.07.2025
  abgeschaltet; ein verbliebener Hinweis ist irreführend und abmahnfähig.
- **DDG statt TMG.** Das Telemediengesetz wurde im Mai 2024 abgelöst.

`npm run check:privacy` stellt sicher, dass keine Ressource von Drittanbietern
in den Build gelangt – sonst wird die Datenschutzerklärung unwahr.

## Dokumentation

Astro-Doku: https://docs.astro.build – insbesondere
[Routing](https://docs.astro.build/en/guides/routing/),
[Komponenten](https://docs.astro.build/en/basics/astro-components/) und
[Styling](https://docs.astro.build/en/guides/styling/).
