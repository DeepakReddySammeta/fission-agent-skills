---
name: ds-select
description: Use when adding or editing a dropdown / select field, on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Select

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Select
  is fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — don't fall back to a plain unbranded native
  `<select>`
- `unknown` → ask, don't guess

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Select
install/update command and import path
(`Select`/`SelectTrigger`/`SelectValue`/`SelectContent`/`SelectItem`).

## Step 2B — adapter path

- `adapters/mui.md` → MUI `<Select>` + `<MenuItem>` (controlled via
  `value`/`onChange`); for a searchable/async list, `<Autocomplete>` is the
  better fit than forcing `<Select>`
- `adapters/chakra.md` → Chakra `<Select>` — thin wrapper over the native
  `<select>`, simplest API of the four
- `adapters/antd.md` → AntD `<Select options={} onChange={}>` — options as
  data, not `<SelectItem>` children
- `adapters/css-variables.md` → a styled native `<select>` consuming
  `var(--border)`/`var(--ring)`; a searchable dropdown needs a library
  regardless of styling layer — flag that cost if the brief calls for one

## Scope boundary

Select/dropdown only. If what's actually needed is a multi-field form, see
`ds-form`.
