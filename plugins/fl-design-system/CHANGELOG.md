# fl-design-system changelog

## 3.0.1 — 2026-10-09
- Fixed every documented `claude plugin install fl-design-system@fission`
  command — the marketplace's real name is `fission-marketplace`, not
  `fission`; confirmed against `code.claude.com/docs/en/plugins/
  marketplace-reference`, which states the `@` suffix is exactly the
  marketplace's own `name` field.
- Also fixed a real path bug found the same pass: `fl-ds-setup/SKILL.md`
  referenced its own plugin's `scripts/` and `references/` folders with
  `../` (one level up) when the actual depth needs `../../` (two levels
  up, same as every other skill in this repo) — every command in Steps 2–3
  would have failed with "file not found" the first time anyone ran it.
- `owners` and `upstream` moved from top-level `plugin.json` keys into
  `metadata` (neither is a recognized top-level field, both were being
  silently stripped with a validate warning).
- Removed the explicit `skills` array from `plugin.json` — it only adds to
  the default `skills/` scan, so listing `fl-ds-setup`, already under
  `skills/`, was redundant.
- GitHub URL in `repository` and install docs switched from SSH to HTTPS to
  match the actual configured git remote.
- Scripts (`install-fission-component.sh`, `sync-tokens.mjs`) lost their
  executable bit when a prior pass rewrote them on their new path —
  `install-fission-component.sh` is invoked directly (no `bash` prefix) in
  both `SETUP.md` and `fl-ds-setup/SKILL.md`, so this would have failed
  with "Permission denied" the first time anyone actually ran it. Restored.

## 3.0.0 — 2026-10-08
- **Breaking restructure**: the 10 per-component skills (`fl-ds-button`,
  `fl-ds-input`, …) moved out of this plugin entirely, generalized to be
  design-system-agnostic, and now live as `ds-button`, `ds-input`, etc. in a
  new sibling plugin, `design-system`. Reasoning (per direction): those
  skills' detect-and-adapt logic isn't actually Fission-specific — Fission
  was just the one branded shadcn registry they special-cased. Making that
  genuinely generic (any registered brand, including a future client's own
  private registry, routes the same way) meant it couldn't keep living in a
  plugin named `fl-design-system`.
- This plugin now holds exactly one skill, `fl-ds-setup`: scaffold a new
  project on Fission's design system, or install/update its components into
  an existing shadcn project. Everything else here is reference data the
  new `design-system` plugin's adapters read (`references/fission-tokens.md`,
  `references/component-catalog.md`) plus the install script
  (`scripts/install-fission-component.sh`) `fl-ds-setup` runs.
- `shared/` is gone — its contents split across the two plugins per the
  above; nothing here depends on `design-system`'s files via a hard
  relative path, and nothing there depends on this plugin's files either,
  so either can be installed alone.

## 2.1.0 — 2026-10-08
- **Bug fix, found in live testing**: all 10 skills grouped `greenfield` into
  the same branch as `fission-shadcn`/`shadcn-bare` ("Step 2"), but Step 2's
  install command assumes a shadcn project already exists. On an actually
  empty project (no `package.json`, no `src`/`app`), that command has
  nothing to run against — and in testing, the agent's fallback was a plain,
  unbranded native HTML element with zero Fission styling applied. That's
  the regression this fixes: `greenfield` is now its own branch that stops
  and asks the engineer (scaffold the real project first, or use the
  CSS-variables adapter as a minimum-viable branded fallback) instead of
  silently dropping to unstyled markup. This was a real gap introduced by
  the 2.0.0 split — the pre-split umbrella skill had explicit "ask, don't
  guess" handling for greenfield that didn't survive the per-component
  rewrite.

## 2.0.0 — 2026-10-08
- **Breaking restructure**: split from one umbrella skill into 10 — one per
  Fission-owned component (`fl-ds-button`, `fl-ds-input`, `fl-ds-card`,
  `fl-ds-dialog`, `fl-ds-table`, `fl-ds-form`, `fl-ds-badge`, `fl-ds-select`,
  `fl-ds-tabs`, `fl-ds-toast`). Reasoning: a component-level description
  triggers more precisely than one broad "any UI work" description, and only
  the skills actually in play for a given change load into context.
- Shared detector, token reference, and 4 adapter files moved to `shared/`,
  referenced by every component skill via a `../../shared/...` relative path
  — kept out of each skill folder to avoid duplicating the same content 10x.
- Each component skill now documents that component's adapter mapping
  specifically (e.g. Dialog → MUI `<Dialog>` vs. Chakra `<Modal>`, which use
  different names for the same concept) rather than a generic pointer to one
  shared adapter file.
- Confirmed from the live demo: Button and Badge share a non-stock variant
  set (`Default, Secondary, Outline, Error, Success, Warning`) — encoded
  directly in both skills. Exact prop-string casing is inferred, not read
  from source — flagged in both SKILL.md files for first-use confirmation.

## 1.0.0 — 2026-10-08 (superseded)
- Initial release as a single umbrella skill with an internal detect/adapt
  branch. Replaced by 2.0.0 per direction to split per component.
