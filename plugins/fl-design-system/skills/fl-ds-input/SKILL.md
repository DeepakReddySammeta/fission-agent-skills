---
name: fl-ds-input
description: Use when adding or editing a text input, number input, or search field. Installs or themes Fission's Input — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Input

## Step 1 — which path applies

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` / `greenfield` → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**

## Step 2 — Fission-native (shadcn)

```bash
../../shared/scripts/install-fission-component.sh input
../../shared/scripts/install-fission-component.sh input --overwrite
```

```tsx
import { Input } from "@/components/ui/input";

<Input type="text" placeholder="Search projects…" />
<Input type="email" required aria-invalid={!!error} />
<Input disabled />
```

Standalone `<Input>` is fine for a quick filter/search field. For anything
inside an actual form with validation, don't reach for raw `useState` +
`<Input>` — use `fl-ds-form`, which wires `<Input>` through `<FormField>` so
error messages and labels are consistent. This skill's job is the input
element itself, not form wiring.

Never write a raw `<input>` in product UI. Never hardcode border/focus-ring
colors — they come from `--border` / `--ring` tokens already mapped in
Tailwind.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<TextField>` (MUI's
  `<Input>` is the unstyled base; `<TextField>` is the one with label/helper
  text support and is almost always what's wanted)
- `../../shared/references/adapters/chakra.md` → Chakra `<Input>` inside
  `<FormControl>` + `<FormLabel>`
- `../../shared/references/adapters/antd.md` → AntD `<Input>` inside
  `<Form.Item>`
- `../../shared/references/adapters/css-variables.md` → a styled `<input>`
  consuming `var(--border)` / `var(--ring)` on focus

## Scope boundary

Input element only. For label/validation/error-message wiring, see
`fl-ds-form`. For a dropdown instead of free text, see `fl-ds-select`.
