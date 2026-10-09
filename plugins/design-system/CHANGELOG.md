# design-system changelog

## 1.1.0 — 2026-10-09
- **Real bug, found from a live install**: a client project running its own
  custom (non-shadcn) component library was getting inconsistent output —
  some components came out using their real design system, others didn't,
  on the same task. Root cause: `detect-design-system.mjs`'s fallback
  branch was unconditional — anything that didn't match a registered
  shadcn brand, MUI, Chakra, or AntD was *always* classified `css-only`,
  even when there was clear evidence of an existing, just-unrecognized
  component library (a substantial `components/` directory, or a
  dependency that reads like a design-system package). `css-only` tells
  every `ds-*` skill to suggest plain CSS/native elements — on a project
  that actually had its own components, that's not a neutral fallback,
  it's actively wrong guidance, and explains the "half worked" symptom
  exactly: whichever part of the task the agent handled by reading
  existing code came out right, whichever part it followed the skill's
  `css-only` instructions for did not.
- Fix: the detector now distinguishes "no evidence of any component
  library" (stays `css-only`) from "evidence of an unrecognized one"
  (now reports `unknown`, which every `ds-*` skill already treats as
  stop-and-ask rather than guess). New report lines show *why* —
  `Largest component directory: ...` / `Dependency that looks like a
  design-system package: ...` — so the skill's ask is informed, not blind.
- Added `shared/references/unknown-system.md` and pointed every `ds-*`
  skill's `unknown` branch at it: read the evidence the detector already
  found first, use the client's real components for the task at hand, and
  flag the project for a proper registered adapter rather than re-deriving
  this every session.
- Verified against 6 fixtures: 3 regression (MUI, a registered shadcn
  brand, and a genuinely component-library-free project all still resolve
  exactly as before) and 3 new (an unrecognized design-systemish
  dependency, a substantial unrecognized components directory, and a
  small, likely-coincidental components directory that correctly stays
  `css-only` rather than triggering a false positive).

## 1.0.1 — 2026-10-09
- Fixed every documented `claude plugin install design-system@fission`
  command: the marketplace's real name (`marketplace.json`'s `name` field)
  is `fission-marketplace`, not `fission` — confirmed against
  `code.claude.com/docs/en/plugins/marketplace-reference`, which states the
  `@` suffix users type is exactly that field. The wrong suffix would have
  failed for anyone who copy-pasted the install command as written.
- `owners` moved from a top-level `plugin.json` key into `metadata.owners`
  — `owners` isn't a recognized top-level field and was being silently
  stripped with a `claude plugin validate` warning; `metadata` is the
  documented place for free-form data Claude Code doesn't read.
- Removed the explicit `skills` array from `plugin.json` — confirmed
  against the manifest reference that it only *adds to* the default
  `skills/` directory scan, so listing paths already under `skills/` was a
  redundant hand-maintained duplicate, not a functional requirement.
- GitHub URL in `repository` and install docs switched from SSH to HTTPS to
  match the actual configured git remote.

## 1.0.0 — 2026-10-08
- Initial release. Split out of `fl-design-system` 2.1.0's 10 per-component
  skills (`fl-ds-button`, `fl-ds-input`, …), generalized to be
  design-system-agnostic: `ds-button`, `ds-input`, `ds-card`, `ds-dialog`,
  `ds-table`, `ds-form`, `ds-badge`, `ds-select`, `ds-tabs`, `ds-toast`.
- Fission's own shadcn registry is now one entry in `shared/references/
  brand-registries.json`, the same shape another client's own private
  registry would use — the detector and all 10 skills are brand-neutral;
  adding a new client's design system is a data + one adapter-doc change,
  not a code change.
- The four token-mapping adapters (`mui.md`, `chakra.md`, `antd.md`,
  `css-variables.md`) genericized: no hardcoded brand hex values, each
  points to "the active brand's own token reference" instead (Fission's
  lives in the sibling `fl-design-system` plugin).
- This plugin has no dependency on `fl-design-system` being installed —
  verified by making the Fission registry adapter
  (`adapters/registries/fission.md`) self-contained rather than
  referencing `fl-design-system`'s install script via a cross-plugin
  relative path.
