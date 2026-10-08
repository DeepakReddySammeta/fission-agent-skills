---
name: fl-ds-card
description: Use when adding or editing a card/panel container — a bordered content block with a header and body. Installs or themes Fission's Card, adapting to the project's existing design system.
---

# Fission Card

## Step 1 — which path applies

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` / `greenfield` → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**

## Step 2 — Fission-native (shadcn)

```bash
../../shared/scripts/install-fission-component.sh card
../../shared/scripts/install-fission-component.sh card --overwrite
```

```tsx
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Project health</CardTitle>
    <CardDescription>Last updated 2 hours ago</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button>View details</Button></CardFooter>
</Card>
```

A Card is a layout/grouping primitive, not a semantic one — don't reach for
it just because something needs a border. If the content is tabular data,
use `fl-ds-table` instead (even inside a Card's `CardContent`, the table
itself should be the real Table component, not divs mimicking one).

Don't hardcode `border`/`shadow`/`radius` on a Card — the registry component
already carries Fission's values; a one-off override here is almost always
a sign the wrong variant or a new token is needed, not a local style escape.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<Card>` + `<CardHeader>`
  + `<CardContent>` + `<CardActions>` (MUI's naming is close to shadcn's
  here, an easy adapter)
- `../../shared/references/adapters/chakra.md` → Chakra has no dedicated
  Card primitive by default — compose with `<Box borderWidth="1px"
  borderRadius="lg">` using the mapped tokens
- `../../shared/references/adapters/antd.md` → AntD `<Card title="...">`
- `../../shared/references/adapters/css-variables.md` → a `.card` class
  consuming `var(--card)` / `var(--border)` / a shared radius value

## Scope boundary

Card container only. For what goes inside it, use the matching component
skill for that content (Table, Form, Tabs, …).
