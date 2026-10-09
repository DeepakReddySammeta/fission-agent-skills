---
name: ds-tabs
description: Use when adding or editing tabbed navigation within a page or panel, on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Tabs

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Tabs is
  fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — don't fall back to an unbranded hand-rolled
  tab bar
- `unknown` → see `../../shared/references/unknown-system.md` — the detector's report usually already shows why (an unrecognized component directory or design-systemish dependency); don't guess, and don't fall back to a different system's styling.

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Tabs
install/update command and import path
(`Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`).

## Step 2B — adapter path

- `adapters/mui.md` → MUI `<Tabs value={} onChange={}>` + `<Tab>`, panel
  content rendered conditionally outside the `<Tabs>` itself (MUI doesn't
  bundle a `TabPanel`-equivalent by default the way shadcn/Chakra do)
- `adapters/chakra.md` → Chakra `<Tabs><TabList><Tab>` +
  `<TabPanels><TabPanel>` — closest structural match to shadcn's shape
- `adapters/antd.md` → AntD `<Tabs items={[{ key, label, children }]}>` —
  data-driven, not nested JSX children the way the others are
- `adapters/css-variables.md` → hand-rolled tabs need ARIA roles
  (`role="tablist"`/`"tab"`/`"tabpanel"`, `aria-selected`) and keyboard
  arrow-key navigation handled explicitly — a library gives both for free;
  flag this cost if the project is CSS-only

## Scope boundary

Tabs only. For content inside a tab panel, use whichever sibling skill
matches that content.
