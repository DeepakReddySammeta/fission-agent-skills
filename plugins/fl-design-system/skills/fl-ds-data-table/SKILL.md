---
name: fl-ds-data-table
description: Use when adding or editing a sortable and/or paginated/filterable data table — not a plain static table. Wires Fission's Table markup to TanStack Table for the logic, instead of hand-rolling sort/page state or reaching for an unbranded table library.
---

# Fission Data Table

## Step 0 — this composes two things, neither of which is new

Checked against the live registry index
(`https://FissionHQ.github.io/ui-design-system/registry.json`, 2026-11-02):
there's no `data-table` entry. `table` is markup only — header/body/row/
head/cell/caption slots, no sort/page/filter logic. A reusable paginated
table is `fl-ds-table`'s markup wired to TanStack Table's headless row
model, not a new Fission-owned primitive.

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install Table now, then continue:
  ```bash
  ../../scripts/install-fission-component.sh table
  ```
- **`greenfield`** → ask the engineer the same as `fl-ds-table`'s Step 1 —
  don't fall back to a plain `<table>`.

```bash
npm install @tanstack/react-table@8
```

**Pin to `@8`, don't take `@latest`.** Tested live, 2026-11-02:
`@tanstack/react-table` published a `9.x` as `latest` with a rewritten API
(`useReactTable` → `useTable`, row-model helpers restructured) — plain
`npm install @tanstack/react-table` silently pulls v9 and the code below
won't compile against it. v8 is what shadcn's own data-table examples and
virtually every existing tutorial still target.
<!-- ponytail: pinned to the v8 line rather than tracking v9's new API; revisit once the ecosystem (shadcn examples, testing-library guides) has actually migrated -->

## Step 2 — the reusable table

```tsx
import {
  useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel,
  flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function DataTable<TData>({ columns, data }: { columns: ColumnDef<TData>[]; data: TData[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data, columns, state: { sorting }, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button variant="outline" size="sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
```

**Server-side pagination** (page comes from an API, not a client-held
array): pass `manualPagination: true`, drop `getPaginationRowModel`, and
feed `pageCount` from the response instead of letting TanStack compute it
from `data.length`.

## Scope boundary

Sortable/paginated table composition only. For a static table with no
sorting or paging, use `fl-ds-table` directly — don't pull in TanStack
Table for something that doesn't need row-model logic. For scroll-loaded
(not paged) rows, see `fl-ds-infinite-scroll`.
