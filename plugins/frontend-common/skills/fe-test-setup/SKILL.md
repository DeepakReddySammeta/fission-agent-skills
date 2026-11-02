---
name: fe-test-setup
description: Use when a project needs a test runner (unit/component, or e2e) set up and doesn't have one yet. Detects the framework and confirms the matching first-party runner with the engineer before installing anything, rather than guessing — testing stacks vary more per framework than lint/format tooling, and some are actively mid-migration.
---

# Test runner setup

## Step 1 — detect the framework

```bash
node ../../scripts/detect-frontend-framework.mjs
```

## Step 2 — check what's already there

Look for `jest.config.*`, `vitest.config.*`, `playwright.config.*`, or a
`test` script in `package.json` that already points somewhere real.
**Don't add a second runner on top of one that's already wired in** —
ask instead.

## Step 3 — confirm before installing

Same rule as `fe-upstream-setup`: show the detected framework and the
recommendation below and get a yes first.

## Step 4 — unit/component runner, per framework

| Detected | Recommendation | Note |
| --- | --- | --- |
| `next` | Vitest — see below | Official guide: `nextjs.org/docs/app/guides/testing/vitest`. Next also has a first-party Jest guide; ask the engineer if they specifically want Jest instead of defaulting to Vitest. |
| `react` (non-Next, Vite-based) | Vitest | Shares Vite's own config/transform pipeline, no separate webpack/babel setup needed: `npm install --save-dev vitest @testing-library/react jsdom`. |
| `react` (Create React App) | Leave Jest as-is | CRA ships Jest preconfigured — don't replace a working runner with a different one. |
| `angular` | Ask — don't assume | Angular's unit-test story is genuinely in flux (checked 2026-11-02): Karma/Jasmine is still the default on many existing projects; Vitest support exists via the `@angular/build:unit-test` builder but is explicitly labeled experimental in Angular's own docs (no SemVer guarantees); newer CLI versions may default new projects to it instead. Check `ng version` and `angular.dev/guide/testing/unit-tests` for what *this* project's CLI version actually does before picking one. |
| `vue` | Vitest | Built by the Vite/Vue core team; `npm create vue@latest` offers it as a creation-time option, or install directly: `npm install --save-dev vitest @vue/test-utils jsdom`. |
| `svelte` | `npx sv add vitest` (existing project) or pick it during `npx sv create` (new project) | Same first-party `sv` CLI `fe-eslint-setup` uses for its ESLint add-on. |

**Next + Vitest, tested live against a real `create-next-app` project,
2026-11-02** (Vitest doesn't support async Server Components as of this
writing — flag that if the project uses them):

The official guide's own install command fails. Running it verbatim —

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

— errors with an npm `ERESOLVE` conflict: unpinned `@vitejs/plugin-react`
resolves to `6.1.2`, which pulls in an experimental rolldown/Babel-8-RC
dependency chain that conflicts with Next's own Babel deps. Pin it
instead:

```bash
npm install -D vitest @vitejs/plugin-react@4 jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

<!-- ponytail: pinned @vitejs/plugin-react to the stable v4 line to dodge v6's rolldown/Babel-8-RC chain; revisit once that settles -->

`vitest.config.mts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: { environment: 'jsdom' },
})
```

Confirmed with a real component test (`render` + `screen.getByText`
against a `fl-ds-pagination`-style component) — install, config, and run
all succeed with this exact pin.

## Step 5 — e2e is a separate decision, ask first

Don't install an e2e runner just because unit tests were requested — real
browsers, slower runs, separate CI time. If the engineer does want e2e:

```bash
npm init playwright@latest
```

First-party installer (Microsoft/Playwright team) — scaffolds config, an
example test, and a CI workflow. Works the same regardless of which
framework was detected above.

## Scope boundary

Scaffolding only — not a "write my tests" skill. Once a runner is
installed, writing the actual test files is ordinary engineering work.
