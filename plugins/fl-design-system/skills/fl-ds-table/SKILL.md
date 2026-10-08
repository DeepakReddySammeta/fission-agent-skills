---
name: fl-ds-table
description: Use when adding or editing a data table / list of records with columns. Installs or themes Fission's Table, adapting to the project's existing design system.
---

# Fission Table

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
../../shared/scripts/install-fission-component.sh table
../../shared/scripts/install-fission-component.sh table --overwrite
```

```tsx
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((r) => (
      <TableRow key={r.id}>
        <TableCell>{r.name}</TableCell>
        <TableCell><Badge variant={r.status === "active" ? "success" : "secondary"}>{r.status}</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

shadcn's Table is markup/styling only — it has **no** built-in sorting,
pagination, or filtering. For anything beyond a static list, this project's
own stack usually already has (or needs) TanStack Table for the data logic,
styled with these primitives for the rendering. Don't hand-roll sort/filter
state when a project likely already depends on TanStack Table — check
`package.json` first, and if it's not there, flag that decision to the
engineer rather than building ad hoc pagination.

Use `fl-ds-badge` for status cells, not raw colored text.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<Table>` /
  `<TableContainer>`, or MUI X `<DataGrid>` if the project already uses it
  for sort/filter/pagination
- `../../shared/references/adapters/chakra.md` → Chakra `<Table>` +
  `<Thead>`/`<Tbody>`
- `../../shared/references/adapters/antd.md` → AntD `<Table columns={}
  dataSource={}>` — AntD's Table already includes sort/filter/pagination
  built in, which is a meaningfully different capability than the shadcn
  primitive; don't assume parity when switching between them
- `../../shared/references/adapters/css-variables.md` → a styled native
  `<table>` consuming the token set

## Scope boundary

Table rendering only. For the data-fetching/sorting logic behind it, that's
application code, not this skill's concern.
