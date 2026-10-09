---
name: fl-ds-select
description: Use when adding or editing a dropdown / select field. Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Select

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh select
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain, unbranded native `<select>`.

## Step 2 — use the component

```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger><SelectValue placeholder="Choose a plan" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="free">Free</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
  </SelectContent>
</Select>
```

Use `../../scripts/install-fission-component.sh select --overwrite` to
pull an update if the installed component looks stale.

## Scope boundary

Select/dropdown only. If what's actually needed is a multi-field form,
see `fl-ds-form`.
