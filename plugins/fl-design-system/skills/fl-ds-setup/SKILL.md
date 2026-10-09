---
name: fl-ds-setup
description: Use when a Next.js project needs Fission's design system scaffolded from scratch, or any existing project needs its components installed/updated, and the framework choice is already settled. For a brand-new project where the framework/library hasn't been decided yet, see fl-ds-new-project first — it asks which one and confirms Fission's design system actually supports it before this skill runs.
---

# Fission design-system setup

This plugin is scoped to one thing: Fission's own design system, end to
end — from setup to the component skills actually working when an
engineer asks for a Button, Dialog, and so on. It does not try to detect
or adapt to any other client's design system.

This skill assumes the framework question is already settled (Next.js for
a from-scratch scaffold, or whatever an existing project already runs for
an install/update). `fl-ds-new-project` is the entry point when that
hasn't been decided yet — it hands off to this skill once it has.

## Step 1 — where does this project stand

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`greenfield`** (no project scaffolded yet) → **Step 2**
- **`needs-setup`** (a real project exists, Fission's components aren't
  installed yet) → **Step 3**
- **`ready`** (already installed) → nothing to scaffold; re-run Step 3 with
  `--overwrite` per component only to pull an update

## Step 2 — scaffold a brand-new Next.js project

Confirmed against the upstream repo: this scaffolds one fixed template —
Next.js, App Router, a gallery + dashboard demo. There's no flag to pick a
different framework here; if the engineer wants something other than
Next.js, that's `fl-ds-new-project`'s job, not this step.

```bash
git clone https://github.com/FissionHQ/ui-design-system.git /tmp/fl-ui-ds
cd /tmp/fl-ui-ds && npm run create -- <target-dir>   # add --skip-install to skip the npm install step
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

For "what framework should this new project even be" — see
`fl-ds-new-project` instead of guessing Next.js here without asking.
