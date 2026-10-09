---
name: fl-ds-setup
description: Use when a project needs Fission's own design system scaffolded from scratch or installed into an existing shadcn project. Does not touch non-shadcn stacks — see scope boundary. After this runs, the design-system plugin's ds-button/ds-dialog/etc. detect this project as shadcn:fission automatically.
---

# Fission design-system setup

This is the only skill in this plugin. Everything else Fission-specific
(token values, the registry component list, the install/update script) is
reference data this skill — and the generic `design-system` plugin's
adapters — read from, not separate skills to maintain.

## Step 1 — where does this project stand

```bash
node ../../../design-system/shared/scripts/detect-design-system.mjs
```

(If the `design-system` plugin isn't installed, check by hand instead:
is there a `package.json` and a `src`/`app` directory? Is there a
`components.json` — i.e. is shadcn already set up?)

- **No project yet** (`greenfield`) → **Step 2**
- **shadcn project, no Fission components yet** (`shadcn-bare`) → **Step 3**
- **Already `shadcn:fission`** → nothing to scaffold; use `--overwrite` per
  component (Step 3) only to pull an update
- **Non-shadcn stack** (`mui` / `chakra` / `antd` / `css-only`) → **stop,
  see scope boundary below** — this skill doesn't apply
- **`unknown`** → ask the engineer what's actually in this repo before
  guessing

## Step 2 — scaffold a brand-new project

```bash
git clone https://github.com/FissionHQ/ui-design-system.git /tmp/fl-ui-ds
cd /tmp/fl-ui-ds && npm run create -- <target-dir>
```

Re-run Step 1's detector against `<target-dir>` afterward — it should now
report `shadcn:fission`, and Step 3 applies for any additional components
not included in the starter template.

## Step 3 — install or update Fission's components into an existing shadcn project

```bash
../../scripts/install-fission-component.sh <component>
../../scripts/install-fission-component.sh <component> --overwrite   # update
```

`<component>` is one of: `button`, `input`, `card`, `dialog`, `table`,
`form`, `badge`, `select`, `tabs`, `toast` — see `../../references/
component-catalog.md` for the full table and registry URLs. The script
refuses any other name and points to the plain shadcn command instead,
since Fission doesn't own that component.

For token values (hex per theme, the one flagged brand-deck discrepancy),
see `../../references/fission-tokens.md` — don't invent a value that isn't
captured there yet; flag the gap instead.

## Scope boundary

This skill only sets up Fission's **shadcn-based** component code. It
cannot "install" Fission's components into a project running MUI, Chakra,
AntD, or plain CSS — those map Fission's **tokens** (not component code)
into the project's existing system instead, which is what the
`design-system` plugin's adapter files (`mui.md`, `chakra.md`, `antd.md`,
`css-variables.md`) are for, reading hex values from
`../../references/fission-tokens.md`. If asked to "add Fission's design
system" to a non-shadcn project, point to that instead of trying to force
a shadcn install alongside an existing component library.

Once this has run, every one of the generic `design-system` plugin's
component skills (`ds-button`, `ds-dialog`, …) detects this project as
`shadcn:fission` on its own — there is no separate "use Fission's Button"
skill to invoke after this; `ds-button` is that skill, for every brand.
