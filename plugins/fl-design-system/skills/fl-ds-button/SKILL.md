---
name: fl-ds-button
description: Use when adding or editing a button / primary action / submit control. Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Button

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh button
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain, unbranded `<button>` — that's
  not completing the task, it's silently dropping the one thing this skill
  exists for.

## Step 2 — use the component

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Learn more</Button>
<Button variant="error">Delete account</Button>
<Button variant="success">Approve</Button>
<Button variant="warning">Proceed with caution</Button>
<Button size="sm" /> <Button size="lg" /> <Button disabled />
<Button asChild><Link href="/x">As a link</Link></Button>
```

**Variants are Fission's own set — confirmed from the live demo
(`Default, Secondary, Outline, Error, Success, Warning`), different from
stock shadcn's `default/destructive/outline/secondary/ghost/link`.** The
lowercase variant keys above (`error`, `success`, `warning`) are inferred
from that naming, not read from the component source directly — confirm
the exact prop strings against `src/registry/button/button.tsx` in
`FissionHQ/ui-design-system` the first time you use this skill in a
session, and correct this file via a PR if they differ.

Never write a raw `<button>` in product UI. Never hardcode a color on a
Button — if a one-off visual difference is requested, that's a sign a new
variant belongs in the shared registry, not a local override.

Use `../../scripts/install-fission-component.sh button --overwrite` to
pull an update if the installed component looks stale.

## Scope boundary

Button only. For the rest of the catalog see the sibling skills
(`fl-ds-input`, `fl-ds-card`, …) — each is scoped the same way, one
component at a time, so only the ones actually in play for a given change
load into context.
