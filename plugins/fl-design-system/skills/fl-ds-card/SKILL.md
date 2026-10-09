---
name: fl-ds-card
description: Use when adding or editing a card / content panel / grouped surface. Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Card

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh card
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain unbranded `<div>`.

## Step 2 — use the component

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Plan details</CardTitle>
    <CardDescription>Your current subscription</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button variant="outline">Manage</Button>
  </CardFooter>
</Card>
```

Use `../../scripts/install-fission-component.sh card --overwrite` to pull
an update if the installed component looks stale.

## Scope boundary

Card only — the generic grouped-surface container. For a specific
interactive surface (a modal/popup) see `fl-ds-dialog`; for tabular data
see `fl-ds-table`.
