---
name: fl-ds-input
description: Use when adding or editing a text input / form field control. Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Input

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh input
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain, unbranded `<input>`.

## Step 2 — use the component

```tsx
import { Input } from "@/components/ui/input";

<Input type="email" placeholder="you@example.com" />
<Input disabled />
```

Pair with the Label and error-text pattern from `fl-ds-form` whenever this
input sits inside a form with validation — don't hand-roll a separate
label/error layout next to it.

Use `../../scripts/install-fission-component.sh input --overwrite` to pull
an update if the installed component looks stale.

## Scope boundary

Input only. For the surrounding form (validation, submit) see
`fl-ds-form`; for a dropdown-style field see `fl-ds-select`.
