// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://bootlabs.de",
  // "always": Links enden auf /impressum/ – auf Plesk/Passenger liefert
  // /impressum ohne Slash einen 500, mit Slash die statische index.html.
  trailingSlash: "always",

  // Astros HTML-Kompression entfernt auch bedeutungstragende Leerzeichen vor
  // Inline-Elementen ("die <span>Standardinstallation</span>" wird zu
  // "dieStandardinstallation"). Der Unterschied liegt gzip-komprimiert bei
  // unter 1 kB pro Seite – das ist die Korrektheit im Fließtext wert.
  // scripts/check-typography.mjs bewacht das zusätzlich im Build.
  compressHTML: false,

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // Rechtsseiten stehen auf noindex und gehören nicht in die Sitemap
      filter: (page) => !page.includes("/impressum") && !page.includes("/datenschutz"),
    }),
  ],

  build: {
    inlineStylesheets: "auto",
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
});
