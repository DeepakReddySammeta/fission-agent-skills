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
<Badge variant="error">Failed</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending review</Badge>
```

Shares its variant set with Button on Fission's system — `Default,
Secondary, Outline, Error, Success, Warning` — see `fl-ds-button` for the
confirmed/inferred detail on that naming.

Use `../../scripts/install-fission-component.sh badge --overwrite` to pull
an update if the installed component looks stale.

## Scope boundary

Badge/status-chip only. For the button-style action variants this shares
with, see `fl-ds-button`.
