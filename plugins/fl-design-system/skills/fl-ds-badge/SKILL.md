---
name: fl-ds-badge
description: Use when adding or editing a status badge / tag / label chip (not a notification-count dot). Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Badge

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh badge
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain unbranded `<span>`.

## Step 2 — use the component

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Draft</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending review</Badge>
```

**Confirmed by reading the actual installed component source
(`components/ui/badge.tsx`) from a real scaffold on 2026-10-09**:
`default`, `secondary`, `destructive`, `outline`, `success`, `warning`.
Badge's danger variant is `destructive`, same name as Button's — but
Badge does **not** otherwise share Button's variant set: Badge has
`success`/`warning` (Button doesn't), and Button has `ghost`/`link`
(Badge doesn't). Treat them as two separate variant sets that happen to
overlap on `default`/`secondary`/`outline`/`destructive`, not one shared
set — an earlier version of this file claimed otherwise, inferred from
naming rather than read from source.

Use `../../scripts/install-fission-component.sh badge --overwrite` to pull
an update if the installed component looks stale.

## Scope boundary

Badge/status-chip only. For the button-style variants Badge partially
overlaps with, see `fl-ds-button` — but check that skill's own variant
list rather than assuming it matches this one.
