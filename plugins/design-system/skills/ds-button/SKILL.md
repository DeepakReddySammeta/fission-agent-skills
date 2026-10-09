---
name: ds-button
description: Use when adding or editing a button / primary action / submit control, on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Button

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` (e.g. `shadcn:fission`) → **Step 2A**
- `shadcn-bare` → ask which brand applies (see
  `../../shared/references/brand-registries.json` for what's registered), or
  confirm stock shadcn's Button is fine as-is for this project
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**, open the matching
  adapter file
- `greenfield` → **stop and ask** — nothing is scaffolded yet, so an install
  command has nothing to run against. Ask whether to scaffold a real
  project first (which brand/stack?) or just apply the CSS-variables
  adapter as a minimum-viable branded fallback. **Don't** silently fall back
  to a plain, unbranded `<button>` — that's not completing the task.
- `unknown` → see `../../shared/references/unknown-system.md` — the detector's report usually already shows why (an unrecognized component directory or design-systemish dependency); don't guess, and don't fall back to a different system's styling.

## Step 2A — registered brand (shadcn)

Open that brand's file under `../../shared/references/adapters/registries/`
(e.g. `fission.md`) and follow its Button install/update command and import
path. Never install the bare, un-registered shadcn Button for a project
that already carries a registered brand — that silently drops the brand's
variants.

Never write a raw `<button>` in product UI once a design system is in
place. Never hardcode a color on a Button — if a one-off visual difference
is requested, that's a sign a new variant belongs in the brand's shared
registry, not a local override.

## Step 2B — adapter path (MUI / Chakra / AntD / plain CSS)

- `adapters/mui.md` → MUI `<Button>`, color via the mapped `palette.primary`
- `adapters/chakra.md` → Chakra `<Button colorScheme="brand">`
- `adapters/antd.md` → AntD `<Button type="primary">`, reads `colorPrimary`
  from the shared `ConfigProvider` token object
- `adapters/css-variables.md` → a `.btn` class (or styled-components)
  consuming `var(--primary)` etc.

Map the active brand's semantic intent onto that system's own API: an
"error"/destructive action → that system's destructive/danger variant, not
a manually chosen red.

## Scope boundary

Button only. For the rest of the catalog see the sibling skills (`ds-input`,
`ds-card`, …) — each is scoped the same way, one component at a time, so
only the ones actually in play for a given change load into context.
