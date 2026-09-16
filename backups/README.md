Backup der HomePower+ Website vor Scope-Verengung
Datum: 2026-09-16
Git-SHA: 9068a5df3a924e90cc42e60e124a9982cd4f07d7
Git-Tag: backup/2026-09-16-pre-scope-narrow
Branch zum Zeitpunkt des Backups: main

Enthalten:
- homepp-web-pre-scope-narrow-2026-09-16.bundle  (vollständige Git-Historie)
- homepp-web-pre-scope-narrow-2026-09-16.tar.gz  (Quellbaum ohne node_modules/.git)

Wiederherstellung aus Bundle:
  git clone homepp-web-pre-scope-narrow-2026-09-16.bundle homepp-web-restore
  cd homepp-web-restore && git checkout backup/2026-09-16-pre-scope-narrow

Wiederherstellung aus Archiv:
  tar -xzf homepp-web-pre-scope-narrow-2026-09-16.tar.gz

Dateiliste des Archivs:
./
./astro.config.mjs
./AGENTS.md
./tsconfig.json
./README.md
./scripts/
./scripts/check-typography.mjs
./scripts/check-privacy.mjs
./scripts/check-legal.mjs
./scripts/generate-assets.mjs
./scripts/check-links.mjs
./.github/
./.github/workflows/
./.github/workflows/release-check.yml
./.github/workflows/ci.yml
./.prettierignore
./.gitignore
./.vscode/
./.vscode/launch.json
./.vscode/extensions.json
./lighthouserc.json
./package-lock.json
./src/
./src/layouts/
./src/layouts/Legal.astro
./src/layouts/Base.astro
./src/styles/
./src/styles/global.css
./src/components/
./src/components/Process.astro
./src/components/Hero.astro
./src/components/Faq.astro
./src/components/Contact.astro
./src/components/Icon.astro
./src/components/Stats.astro
./src/components/Cta.astro
./src/components/Services.astro
./src/components/Marquee.astro
./src/components/Footer.astro
./src/components/Logo.astro
./src/components/About.astro
./src/components/Nav.astro
./src/scripts/
./src/scripts/contact-form.ts
./src/scripts/hero-demo.ts
./src/scripts/motion.ts
./src/scripts/energy-field.ts
./src/data/
./src/data/site.ts
./src/pages/
./src/pages/index.astro
./src/pages/datenschutz.astro
./src/pages/404.astro
./src/pages/impressum.astro
./.prettierrc.json
./public/
./public/favicon.svg
./public/robots.txt
./public/brand/
./public/brand/logo-wordmark.png
./public/brand/logo-mark.png
./public/brand/logo-wordmark.webp
./public/brand/logo-mark.svg
./public/brand/logo-wordmark-on-light.png
./public/favicon.ico
./public/.htaccess
./public/api/
./public/api/contact.php
./package.json
