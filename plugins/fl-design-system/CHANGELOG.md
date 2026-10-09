# fl-design-system changelog

## 4.2.1 — 2026-10-09 (real UI bug, caught from a live screenshot)
- Fixed a real UX bug in `fl-ds-new-project`, caught from an actual
  screenshot of the skill running in VS Code's Claude Code extension:
  Fission's design system was being rendered as a parenthetical under the
  "Tailwind CSS" option ("pairs well with Fission's design system if
  applicable") instead of its own selectable choice, so an engineer
  wanting Fission directly had nothing to click — they'd have had to pick
  Tailwind first and wait for a separate follow-up question that the 4.2.0
  design only asked *after* scaffolding.
- Fix: Step 2's styling menu now lists "Fission's Design System" as
  option 1, on equal footing with Tailwind/shadcn/plain CSS/MUI-Bootstrap-
  Chakra-AntD, whenever the chosen framework (Next.js or React) actually
  supports it — selectable in the same single menu, no second question
  required. For any other framework, Fission is left off the list
  entirely rather than appearing as an option that then gets refused.
- Removed the old separate "ask after scaffolding" step — if the engineer
  didn't pick Fission in the one menu where it was offered directly,
  don't ask again afterward.

## 4.2.0 — 2026-10-09 (later same day)
- Broadened `fl-ds-new-project`, per direction: it's no longer a Fission-
  or-nothing gate. It now helps scaffold a brand-new project in *any*
  framework (Next.js, React, Vue, Angular, Astro, …) and *any* styling
  system (Tailwind, shadcn, MUI, Bootstrap, Chakra, Ant Design, plain
  CSS/Sass, …) the engineer picks — framework and styling are asked as two
  separate, unfiltered questions. Only after scaffolding, and only when
  the chosen framework+styling combination actually supports Fission's
  design system, does it ask whether to also set that up; a "no" or an
  unsupported combination just leaves the project as scaffolded, no
  Fission skill involved.
- This isn't a return to the generic multi-brand detection that broke
  before (see 4.0.0) — that was *silently guessing* an existing, unknown
  project's design system. This is scaffolding a *brand-new* project in
  whatever the engineer *explicitly names*, which involves no guessing.
  The `fl-ds-*` component skills still only ever know Fission's own
  components; README's scope section now spells out this distinction
  explicitly so it doesn't read as a contradiction later.
- Still hands off to `fl-ds-setup` for the actual Fission scaffold/install
  once confirmed, rather than duplicating that logic.

## 4.1.0 — 2026-10-09
- Added `fl-ds-new-project`: the entry point for a brand-new project where
  the framework hasn't been decided yet. Shows a plain support table
  (Next.js fully supported with a dedicated starter; React partially
  supported with no dedicated starter but components installable; Vue,
  Angular, Svelte, etc. not supported at all — they're architecturally
  incompatible with shadcn/Radix, which is React-only, not a gap to close
  later) and only proceeds with Fission's design system for a supported
  choice. Hands off to `fl-ds-setup` once the framework is settled rather
  than duplicating its scaffold/install logic.
- Narrowed `fl-ds-setup`'s own description to assume the framework
  question is already settled, and pointed it at `fl-ds-new-project` for
  the undecided case — avoids the two skills' descriptions overlapping
  enough to misroute or double-fire on the same "set up a new project"
  prompt.
- `fl-ds-setup`'s Step 2 now states plainly (confirmed against the
  upstream repo) that the scaffold is Next.js only, one fixed template —
  no flag to pick a different framework there.

## 4.0.0 — 2026-10-09
- **Direction change, per explicit instruction after the generic
  `design-system` plugin broke on a live install**: stop trying to detect
  and adapt to other clients' design systems. Focus on exactly one thing
  working reliably end to end — scaffolding or installing Fission's own
  design system, and the component skills using it correctly the moment an
  engineer asks, with no ambiguity.
- The 10 component skills (`fl-ds-button`, `fl-ds-input`, `fl-ds-card`,
  `fl-ds-dialog`, `fl-ds-table`, `fl-ds-form`, `fl-ds-badge`, `fl-ds-select`,
  `fl-ds-tabs`, `fl-ds-toast`) are back in this plugin, rewritten against a
  much simpler detector (`detect-fission-design-system.mjs`, 3 states:
  `ready` / `needs-setup` / `greenfield` — no MUI/Chakra/AntD/css-only/
  unknown branching, no brand registry, no adapter files). `needs-setup` is
  handled inline by each component skill — it installs the one component
  needed via `install-fission-component.sh` and continues, so "add a
  button" on a project without Fission's design system yet just works in
  one prompt, not a stop-and-ask plus a separate setup step.
- The generic `design-system` plugin is deleted from this marketplace
  entirely (`brand-registries.json`, the MUI/Chakra/AntD/css-variables
  adapters, `adapters/registries/`, `unknown-system.md`, all gone). If
  support for other clients' own design systems comes back later, it's a
  separate, later effort — not something bundled into this plugin's
  component skills again by default.
- Verified against 4 fixtures covering all three detector states
  (`greenfield`, `needs-setup` via two different starting conditions, and
  `ready`), plus a full relative-path audit across every skill in this
  plugin (`detect-fission-design-system.mjs` and `install-fission-
  component.sh` are both two levels up from every skill folder — caught
  and fixed one more instance of the wrong depth in `fl-ds-setup`,
  the same mistake as 3.0.1's fix, in a file rewritten fresh this round).

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
