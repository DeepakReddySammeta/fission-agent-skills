---
name: fl-ds-table
description: Use when adding or editing a data table / grid of rows. Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Table

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh table
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain unbranded `<table>`.

## Step 2 — use the component

```tsx
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Acme Corp</TableCell>
      <TableCell><Badge variant="success">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

This is markup primitives only — for sorting, pagination, or filtering,
pair it with TanStack Table rather than hand-rolling that logic (see the
upstream TanStack skill via `frontend-common`'s `fe-upstream-setup`, not
this one).

Use `../../scripts/install-fission-component.sh table --overwrite` to
pull an update if the installed component looks stale.

## Scope boundary

Table only. For the cells' interactive controls (a button or badge inside
a row) see `fl-ds-button` or `fl-ds-badge`.
