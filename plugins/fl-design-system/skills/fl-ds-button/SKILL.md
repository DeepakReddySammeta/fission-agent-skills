---
name: fl-ds-button
description: Use when adding or editing a button / primary action / submit control. Installs or themes Fission's Button — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Button

## Step 1 — which path applies

Run the shared detector once per project (it caches its answer, see
`../../shared/scripts/detect-design-system.mjs`):

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` / `greenfield` (confirmed Fission-native) → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**, open the Button section of
  the matching adapter file

## Step 2 — Fission-native (shadcn)

Install or update from the Fission registry — never the bare shadcn name,
which installs the unbranded default and drops Fission's variants:

```bash
../../shared/scripts/install-fission-component.sh button
../../shared/scripts/install-fission-component.sh button --overwrite   # update
```

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
(`Default, Secondary, Outline, Error, Success, Warning`), and already
different from stock shadcn's `default/destructive/outline/secondary/ghost/link`.**
The lowercase variant keys above (`error`, `success`, `warning`) are inferred
from that naming, not read from the component source directly — confirm the
exact prop strings against `src/registry/button/button.tsx` in
`FissionHQ/ui-design-system` the first time you use this skill in a session,
and correct this file via a PR if they differ.

Never write a raw `<button>` in product UI. Never hardcode a color on a
Button — if a one-off visual difference is requested, that's a sign a new
variant belongs in the shared registry, not a local override.

## Step 3 — adapter path (project already uses MUI / Chakra / AntD / plain CSS)

Open the matching file and use its Button-specific section:

- `../../shared/references/adapters/mui.md` → MUI `<Button>` + the theme's
  `palette.primary` (already mapped if the theme object from that file is in
  place)
- `../../shared/references/adapters/chakra.md` → Chakra `<Button
  colorScheme="brand">`
- `../../shared/references/adapters/antd.md` → AntD `<Button type="primary">`
  reads `colorPrimary` from the shared `ConfigProvider` token object
- `../../shared/references/adapters/css-variables.md` → a `.btn` class (or
  styled-components) consuming `var(--primary)` etc.

Map Fission's semantic intent even on another system's API: "error" action →
that system's destructive/danger variant, not a manually chosen red.

## Scope boundary

This skill is about the Button component only. For the rest of the catalog
see the sibling skills (`fl-ds-input`, `fl-ds-card`, …) — each is scoped the
same way, one component at a time, so only the ones actually in play for a
given change load into context.
