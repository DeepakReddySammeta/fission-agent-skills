---
name: fl-ds-card
description: Use when adding or editing a card/panel container — a bordered content block with a header and body. Installs or themes Fission's Card, adapting to the project's existing design system.
---

# Fission Card

## Step 1 — which path applies

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**
- `greenfield` → **stop and ask, below** — Step 2's install command has
  nothing to run against yet; don't fall back to a plain unbranded element

### If the detector says `greenfield`

Nothing is scaffolded yet — no `package.json`, no `src`/`app`. Step 2's
`npx shadcn add ...` will fail outright here, and **the failure mode to
avoid is falling back to a plain, unbranded native element** (confirmed in
testing: this exact case produced a stock HTML dialog with zero Fission
styling — that's not completing the task, it's silently dropping the one
thing this skill exists for).

Ask the engineer directly — don't guess:

- **Scaffolding a real project?** There's no `fl-delivery` skill yet to
  wrap this (deferred — see `UPSTREAM.md`), so run the raw upstream command:
  ```bash
  git clone https://github.com/FissionHQ/ui-design-system.git /tmp/fl-ui-ds
  cd /tmp/fl-ui-ds && npm run create -- <target-dir>
  ```
  Then re-run the detector — it should now return `fission-shadcn`, and
  Step 2 applies normally.
- **Just need this one component now, no scaffold wanted?** Use the
  plain-CSS adapter in Step 3 (`shared/references/adapters/css-variables.md`)
  even though the detector said `greenfield` — it's the only path that
  applies Fission's token *values* without requiring a shadcn project to
  already exist.

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
