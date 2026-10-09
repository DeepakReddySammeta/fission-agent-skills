---
name: ds-input
description: Use when adding or editing a text input / form field control, on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Input

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Input
  is fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask (scaffold first, or use the CSS-variables
  adapter as a minimum-viable fallback) — don't fall back to a plain
  unbranded `<input>`
- `unknown` → ask, don't guess

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Input
install/update command and import path. Pair it with the brand's Label and
error-text pattern if this input sits inside a form — see `ds-form`.

## Step 2B — adapter path

- `adapters/mui.md` → MUI `<TextField>` (bundles label + helper/error text
  in one component — don't also render a separate shadcn-style `<Label>`
  alongside it)
- `adapters/chakra.md` → Chakra `<Input>` wrapped in `<FormControl>` +
  `<FormLabel>` for label/error (see `ds-form`)
- `adapters/antd.md` → AntD `<Input>`, typically inside `<Form.Item>` for
  label/validation rather than a bare input
- `adapters/css-variables.md` → a styled `<input>` + `<label>` pair
  consuming `var(--border)`/`var(--ring)` for default/focus states

## Scope boundary

Input only. For the surrounding form (validation, submit) see `ds-form`;
for a dropdown-style field see `ds-select`.
