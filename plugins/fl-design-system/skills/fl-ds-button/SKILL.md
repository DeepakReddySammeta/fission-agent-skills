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
<Button variant="destructive">Delete account</Button>
<Button variant="ghost">Dismiss</Button>
<Button variant="link">View details</Button>
<Button size="sm" /> <Button size="lg" /> <Button size="icon" /> <Button disabled />
<Button asChild><Link href="/x">As a link</Link></Button>
```

**Variants are stock shadcn's set — confirmed by reading the actual
installed component source (`components/ui/button.tsx`) from a real
scaffold on 2026-10-09**: `default`, `destructive`, `outline`,
`secondary`, `ghost`, `link`. There is **no** `success` or `warning`
variant on Button, and the danger variant is named `destructive`, not
`error` — an earlier version of this file claimed a custom
`Error/Success/Warning` set shared with Badge; that was wrong, inferred
from naming convention rather than read from source, and is corrected
here now that real source has been checked. (Badge *does* have its own
`success`/`warning` variants — see `fl-ds-badge` — the two components do
**not** share one variant set.)

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
