---
name: fl-ds-setup
description: Use when a project needs Fission's own design system scaffolded from scratch, or installed/updated into an existing project. After this runs, the fl-ds-button/fl-ds-dialog/etc. component skills work on this project.
---

# Fission design-system setup

This plugin is scoped to one thing: Fission's own design system, end to
end — from setup to the component skills actually working when an
engineer asks for a Button, Dialog, and so on. It does not try to detect
or adapt to any other client's design system.

## Step 1 — where does this project stand

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`greenfield`** (no project scaffolded yet) → **Step 2**
- **`needs-setup`** (a real project exists, Fission's components aren't
  installed yet) → **Step 3**
- **`ready`** (already installed) → nothing to scaffold; re-run Step 3 with
  `--overwrite` per component only to pull an update

## Step 2 — scaffold a brand-new project

```bash
git clone https://github.com/FissionHQ/ui-design-system.git /tmp/fl-ui-ds
cd /tmp/fl-ui-ds && npm run create -- <target-dir>
```

Re-run Step 1's detector against `<target-dir>` afterward — it should now
report `ready`.

## Step 3 — install or update Fission's components into an existing project

```bash
../../scripts/install-fission-component.sh <component>
../../scripts/install-fission-component.sh <component> --overwrite   # update
```

`<component>` is one of: `button`, `input`, `card`, `dialog`, `table`,
`form`, `badge`, `select`, `tabs`, `toast` — see `../../references/
component-catalog.md` for the full table and registry URLs, or just
install all ten if the engineer wants the whole system set up now. The
script refuses any other name and points to the plain shadcn command
instead, since Fission doesn't own that component.

The install command runs the shadcn CLI, which sets up `components.json`
and Tailwind on its own first run if they aren't already present — this
step works the same whether the project already has some shadcn
components or none at all.

For token values (hex per theme, the one flagged brand-deck discrepancy),
see `../../references/fission-tokens.md` — don't invent a value that isn't
captured there yet; flag the gap instead.

## If the project already runs a different full component library

This skill doesn't attempt to merge Fission's components into an existing
MUI/Chakra/AntD (or similar) setup, or replace it. Installing a second,
unrelated component system alongside one already in heavy use is a bigger
call than this skill should make silently — ask the engineer first rather
than proceeding.

## Scope boundary

Once this has run, every `fl-ds-*` component skill (`fl-ds-button`,
`fl-ds-dialog`, …) detects the project as `ready` on its own — no separate
step needed per component beyond what each of those skills already does.
