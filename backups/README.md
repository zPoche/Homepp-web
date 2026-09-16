# Backup: Website vor der Scope-Verengung

Vollständiger Stand der HomePower+-Website **bevor** Leistungen auf
Alarmanlagen und IT reduziert wurden. Enthält Smart Home, KI-Lösungen,
Elektrotechnik, Ladeinfrastruktur, VDE-Messungen und 3D-Druck.

| Feld | Wert |
| --- | --- |
| Datum | 2026-09-16 |
| Git-SHA | `9068a5df3a924e90cc42e60e124a9982cd4f07d7` |
| Git-Tag | `backup/2026-09-16-pre-scope-narrow` |
| Ausgangsbranch | `main` |

Kopien liegen zusätzlich unter `/opt/cursor/artifacts/backups/`.

## Dateien

| Datei | Inhalt |
| --- | --- |
| `homepp-web-pre-scope-narrow-2026-09-16.bundle` | Vollständige Git-Historie inkl. Tag |
| `homepp-web-pre-scope-narrow-2026-09-16.tar.gz` | Quellbaum ohne `node_modules`, `.git`, `dist` |

## Prüfsummen (SHA-256)

```
c699a2f36ef0c344e5324d709318ff92879bc4d87451d3265cb4abea21d3d672  homepp-web-pre-scope-narrow-2026-09-16.bundle
5c6e7260d839942a23e340f3d2a40acb4af966ee3d3130f76786201734f7a586  homepp-web-pre-scope-narrow-2026-09-16.tar.gz
```

## Wiederherstellung

Aus dem Git-Bundle (empfohlen, inkl. Historie):

```bash
git clone homepp-web-pre-scope-narrow-2026-09-16.bundle homepp-web-restore
cd homepp-web-restore
git checkout backup/2026-09-16-pre-scope-narrow
```

Aus dem Archiv (nur Arbeitsbaum):

```bash
mkdir homepp-web-restore && cd homepp-web-restore
tar -xzf ../homepp-web-pre-scope-narrow-2026-09-16.tar.gz
```

Vom Tag im laufenden Repository:

```bash
git checkout backup/2026-09-16-pre-scope-narrow
```
