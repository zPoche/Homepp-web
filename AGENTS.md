# Hinweise für Agents

Statische Astro-Website für HomePowerPlus.de. Deutschsprachig, Duz-Form,
Dark-Theme mit dem Marken-Cyan `#1EEFF2`.

## Entwicklung

```
npm run dev      # Dev-Server auf Port 4321
npm run check    # alles, was auch die CI prüft
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

Impressum und Datenschutzerklärung enthalten Platzhalter mit dem Präfix
`TODO_IMPRESSUM`. Diese Werte dürfen **nicht** erfunden werden – sie kann nur
der Betreiber ausfüllen. `npm run check:legal` listet die offenen Punkte auf,
`npm run check:legal:strict` lässt den Build daran scheitern.

## Dokumentation

Astro-Doku: https://docs.astro.build – insbesondere
[Routing](https://docs.astro.build/en/guides/routing/),
[Komponenten](https://docs.astro.build/en/basics/astro-components/) und
[Styling](https://docs.astro.build/en/guides/styling/).
