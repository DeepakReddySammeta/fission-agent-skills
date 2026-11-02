---
name: fe-prettier-setup
description: Use when a project needs Prettier set up for code formatting. Framework-agnostic — installs Prettier directly with a minimal config and wires it into ESLint's config if one already exists, instead of hand-picking formatting rules.
---

# Prettier setup

## Step 1 — check whether it's already configured

Look for `.prettierrc*`, `prettier.config.*`, or a `prettier` key in
`package.json`. If one exists, don't scaffold a second config.

## Step 2 — install

```bash
npm install --save-dev --save-exact prettier
```

## Step 3 — minimal config

Prettier's own docs recommend starting from an empty config and letting
its defaults do the work — don't pre-fill options nobody asked for.

`.prettierrc`:

```json
{}
```

`.prettierignore` (Prettier does not read `.gitignore` automatically):

```
node_modules
dist
build
.next
coverage
```

## Step 4 — if ESLint is already configured, wire the two together

```bash
npm install --save-dev eslint-config-prettier
```

Add `"prettier"` **last** in the ESLint config's `extends` (legacy
`.eslintrc`) or as the last entry of the exported array (flat
`eslint.config.js`) — this only turns off the formatting-related ESLint
rules that would fight Prettier; it doesn't make ESLint run Prettier as a
lint rule. Don't install `eslint-plugin-prettier` unless the team
specifically wants formatting issues to show up as lint errors — running
`prettier --check` separately (e.g. in CI) is the faster default.

## Scope boundary

Formatting config only. For the linter itself, see `fe-eslint-setup` —
run that one first if both are going in, since this step reads whatever
config it produced.
