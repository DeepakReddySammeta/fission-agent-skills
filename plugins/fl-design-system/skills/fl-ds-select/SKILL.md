---
name: fl-ds-select
description: Use when adding or editing a dropdown / select control. Installs or themes Fission's Select — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Select

## Step 1 — which path applies

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` / `greenfield` → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**

## Step 2 — Fission-native (shadcn)

```bash
../../shared/scripts/install-fission-component.sh select
../../shared/scripts/install-fission-component.sh select --overwrite
```

```tsx
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

<Select onValueChange={setValue} defaultValue={value}>
  <SelectTrigger><SelectValue placeholder="Choose a status" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="draft">Draft</SelectItem>
  </SelectContent>
</Select>
```

This is shadcn's compound-component pattern — `Select` is a controller, not a
renderable element by itself; always pair it with `SelectTrigger` +
`SelectContent` + `SelectItem`. A common mistake is treating `<Select>` like
a native `<select>` with children `<option>`s — it isn't.

For multi-select or a large searchable list, don't force this component —
flag it and confirm whether the project needs a combobox pattern instead,
which isn't one of Fission's owned components today.

Never write a raw `<select>` in product UI.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<Select>` inside
  `<FormControl>` + `<MenuItem>` children
- `../../shared/references/adapters/chakra.md` → Chakra `<Select>` (closer to
  a native select API than shadcn's)
- `../../shared/references/adapters/antd.md` → AntD `<Select>` with
  `options` prop
- `../../shared/references/adapters/css-variables.md` → a styled native
  `<select>` consuming the token set, if no component library is present

## Scope boundary

Select/dropdown only. For the field wrapper (label, error message) around
it inside a form, see `fl-ds-form`.
