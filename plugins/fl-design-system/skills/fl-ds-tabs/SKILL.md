---
name: fl-ds-tabs
description: Use when adding or editing tabbed navigation within a page or panel. Installs or themes Fission's Tabs — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Tabs

## Step 1 — which path applies

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` / `greenfield` → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**

## Step 2 — Fission-native (shadcn)

```bash
../../shared/scripts/install-fission-component.sh tabs
../../shared/scripts/install-fission-component.sh tabs --overwrite
```

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="activity">…</TabsContent>
</Tabs>
```

`value` on `TabsTrigger` and the matching `TabsContent` must agree — a
mismatched value is the most common bug here (a tab that renders nothing).
For URL-synced tabs (so a tab is linkable/bookmarkable), control `Tabs` with
`value` + `onValueChange` wired to a route param instead of `defaultValue` —
flag this to the engineer rather than assuming which is wanted.

Don't use Tabs for top-level app navigation (that's routing, not this
component) — this is for switching views within one page/panel.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<Tabs>` + `<Tab>` +
  manual panel rendering keyed on the selected index
- `../../shared/references/adapters/chakra.md` → Chakra `<Tabs>` +
  `<TabList>` + `<TabPanels>`
- `../../shared/references/adapters/antd.md` → AntD `<Tabs items={[...]}>`
- `../../shared/references/adapters/css-variables.md` → hand-rolled tab list
  with `aria-selected` state, styled from tokens — confirm keyboard
  navigation (arrow keys) is implemented, since a hand-rolled version won't
  get it for free the way a library component does

## Scope boundary

Tabs only. For the content inside each tab panel, use whichever other
component skill fits that content (Table, Card, Form, …).
