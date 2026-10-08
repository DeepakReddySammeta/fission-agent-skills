# fl-design-system changelog

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
