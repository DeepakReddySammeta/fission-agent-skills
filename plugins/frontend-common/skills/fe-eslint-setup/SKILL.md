---
name: fe-eslint-setup
description: Use when a project needs ESLint set up or reconfigured. Detects the framework, skips if ESLint is already configured, and runs the matching first-party setup command per framework instead of hand-writing a config.
---

# ESLint setup

## Step 1 — detect the framework

```bash
node ../../scripts/detect-frontend-framework.mjs
```

## Step 2 — check whether ESLint is already configured

Look for `eslint.config.{js,mjs,ts}`, `.eslintrc.*`, or an `eslint` key in
`package.json`. If one exists, **don't scaffold a second config** — ask
the engineer whether they want the existing one updated/extended instead.

## Step 3 — confirm before running anything

Same rule as `fe-upstream-setup`: show the detected framework and the
command below, and get a yes before running it — don't fire an install
off the detector's result alone.

## Step 4 — run the matching first-party command

| Detected | Command | Why |
| --- | --- | --- |
| `next` | See below — `next lint` no longer exists | **Tested live against Next 16.4.3, 2026-11-02: `next lint` is gone from the CLI's command list entirely** (not deprecated-with-a-warning — genuinely absent; `npx next lint` just parses "lint" as a project directory and no-ops). `create-next-app` now wires ESLint in by default at scaffold time, with `"lint": "eslint"` as the `package.json` script, not `next lint`. For a project missing it: `npm install --save-dev eslint eslint-config-next`, then write `eslint.config.mjs` (real content, captured from a live scaffold the same day): <br>`import { defineConfig, globalIgnores } from "eslint/config";`<br>`import nextVitals from "eslint-config-next/core-web-vitals";`<br>`import nextTs from "eslint-config-next/typescript";`<br>`export default defineConfig([...nextVitals, ...nextTs, globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])]);`<br>Run with `npx eslint .`. |
| `react` (non-Next, e.g. Vite/CRA) | `npm init @eslint/config@latest` | ESLint's own official scaffold tool — asks which framework/language and writes a matching flat config (`eslint.config.js`) with the right plugins. |
| `angular` | `ng add @angular-eslint/schematics` | Angular team's own first-party schematic (package name confirmed live, 2026-11-02) — the successor to the deprecated TSLint/codelyzer setup. |
| `vue` | `npm init @eslint/config@latest` (existing project) or pick "Add ESLint" during `npm create vue@latest` (new project) | Same official ESLint tool; it detects `vue` in `package.json` and adds `eslint-plugin-vue`. |
| `svelte` | `npx sv add eslint` (existing project) or `npx sv create --add eslint` (new project) | SvelteKit's own first-party CLI add-on (confirmed live, 2026-11-02 — the tool is `sv`; the older `svelte-add` package is gone). Auto-adjusts for TypeScript/Prettier if already present. |
| more than one detected, or `plain-js`/`unknown` | Ask the engineer which to target | Don't guess when the detector returns several frameworks or none. |

## Scope boundary

Setup only — not a "fix my lint errors" skill. Once configured, run
`eslint .` (`eslint . --fix` to auto-fix) as part of the normal dev
workflow — not `next lint`, which doesn't exist as of Next 16. If
Prettier is also going in, run `fe-prettier-setup` **after** this one so
it can wire `eslint-config-prettier` into whatever config this step just
produced.
