# frontend-common changelog

## 1.1.0 — 2026-11-02
- Added three tooling-setup skills, same detect-then-confirm shape as
  `fe-upstream-setup`: `fe-eslint-setup`, `fe-prettier-setup`,
  `fe-test-setup`. Scaffolding only — none of them write test files or
  fix lint errors.
- Checked current commands live before writing any of them, rather than
  inferring from memory (this plugin's own rule — see
  `fe-upstream-setup`'s "Trusting third-party skills"):
  - `@angular-eslint/schematics` is still the real `ng add` package name.
  - Svelte's CLI is now `sv`, not the old `svelte-add` — `npx sv add
    eslint`/`npx sv add prettier`/`npx sv add vitest` are the current
    first-party add-on commands, both confirmed replacing an earlier
    draft of this change that would have guessed the retired name.
  - Angular's unit-test story is genuinely unsettled right now: Angular's
    own docs label the Vitest builder (`@angular/build:unit-test`)
    experimental with no SemVer guarantees, while Karma/Jasmine remains
    the default on many existing projects and newer CLI versions may
    default new ones to Vitest instead. `fe-test-setup` asks the engineer
    to check `ng version` and the current docs for this specific project
    rather than picking one.
  - Next.js has first-party guides for both Vitest and Jest;
    `fe-test-setup` defaults to recommending Vitest (the more recently
    updated guide) but asks before assuming Jest isn't wanted.
- **Live-tested against a real `create-next-app` scaffold before this
  landed** (not just doc-checked), and caught two real bugs the doc-check
  alone missed:
  - `fe-eslint-setup`'s `next` row told people to run `npx next lint` —
    that command has been **removed entirely** from Next 16's CLI (not
    deprecated with a warning; it silently no-ops). Corrected to the real
    current path: ESLint ships by default from `create-next-app` now,
    with `"lint": "eslint"` as the script; for a project missing it,
    install `eslint-config-next` directly and write the config, using the
    exact `eslint.config.mjs` content captured from a live scaffold.
  - `fe-test-setup`'s `next` row followed the official Vitest guide's own
    install command verbatim — it fails with an npm `ERESOLVE` error,
    because unpinned `@vitejs/plugin-react` resolves to `6.1.2`, which
    pulls an experimental rolldown/Babel-8-RC chain that conflicts with
    Next's own Babel deps. Fixed by pinning `@vitejs/plugin-react@4`;
    confirmed with a real passing component test.

## 1.0.1 — 2026-10-09
- Fixed every documented `claude plugin install frontend-common@fission`
  command — the marketplace's real name is `fission-marketplace`, not
  `fission`; confirmed against `code.claude.com/docs/en/plugins/
  marketplace-reference`.
- `owners` moved from a top-level `plugin.json` key into `metadata.owners`
  (not a recognized top-level field, was being silently stripped).
- Removed the explicit `skills` array from `plugin.json` — it only adds to
  the default `skills/` scan, so listing paths already under `skills/` was
  redundant.
- GitHub URL in `repository` and install docs switched from SSH to HTTPS to
  match the actual configured git remote.

## 1.0.0 — 2026-10-08
- Initial release. Four skills, all framework-independent:
  `fe-debug`, `fe-explore`, `fe-knowledge-lookup` (procedures, not
  framework-specific knowledge — apply the same way on React, Next,
  Angular, Vue, or plain JS), and `fe-upstream-setup` (gates
  framework-specific upstream skill installs behind detection +
  engineer confirmation, so a project never ends up with every
  framework's skills loaded).
- `scripts/detect-frontend-framework.mjs`: detects `next`, `react`,
  `angular`, `vue`, `svelte`, `plain-js`, `greenfield`, or `unknown` from
  `package.json` and framework config files. Verified against synthetic
  fixtures for `next`, `angular`, `plain-js`, and `greenfield` this round.
- `fe-upstream-setup`'s install table checked 2026-10-08: Angular has a
  first-party bundle (`angular/skills`, Angular team/Google); Vue and
  Svelte do not — only community options were found, named in the skill
  but not defaulted to, per `UPSTREAM.md`'s "Trusting third-party skills"
  rule. Re-check this table periodically; it's a snapshot, not a
  guarantee the landscape hasn't moved.
