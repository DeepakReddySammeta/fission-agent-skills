---
name: ds-table
description: Use when adding or editing a data table / grid of rows, on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Table

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Table
  is fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — don't fall back to a plain unbranded
  `<table>`
- `unknown` → see `../../shared/references/unknown-system.md` — the detector's report usually already shows why (an unrecognized component directory or design-systemish dependency); don't guess, and don't fall back to a different system's styling.

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Table
install/update command and import path. shadcn's Table is markup
primitives only (`<Table><TableHeader><TableBody><TableRow><TableCell>`) —
for sorting/pagination/filtering, pair it with TanStack Table rather than
hand-rolling that logic (see the upstream TanStack skill, not this one).

## Step 2B — adapter path

- `adapters/mui.md` → MUI `<Table>` + `<TableHead>`/`<TableBody>`/
  `<TableRow>`/`<TableCell>` (same markup-primitives shape as shadcn); for
  sorting/pagination MUI's `<DataGrid>` is a separate, heavier component —
  don't reach for it unless the brief actually needs it
- `adapters/chakra.md` → Chakra `<Table>` + `<Thead>`/`<Tbody>`/`<Tr>`/`<Td>`
- `adapters/antd.md` → AntD `<Table columns={} dataSource={}>` — a markedly
  different, data-driven API (you pass column defs and row data, not JSX
  markup for each cell); don't try to force the markup-primitives pattern
  onto it
- `adapters/css-variables.md` → a native `<table>` consuming `var(--border)`
  for row/cell dividers; sorting/filtering needs hand-rolled state

## Scope boundary

Table only. For the cells' interactive controls (a button or badge inside a
row) see the matching sibling skill.
