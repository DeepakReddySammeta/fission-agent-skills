---
name: fl-ds-pagination
description: Use when adding or editing page-number / prev-next pagination controls. Builds them from Fission's Button component and TanStack Table's pagination state, instead of hand-rolling page math or reaching for an unbranded pagination library.
---

# Fission Pagination

## Step 0 — there's no "pagination" component to install

Checked against the live registry index
(`https://FissionHQ.github.io/ui-design-system/registry.json`, 2026-11-02):
19 items, no `pagination` entry. `install-fission-component.sh pagination`
will refuse — it's not an owned name. Pagination controls are prev/next/
page-number `Button`s wired to TanStack Table's pagination state, not a
new themed primitive.

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install Button now (the only real dependency here),
  then continue:
  ```bash
  ../../scripts/install-fission-component.sh button
  ```
- **`greenfield`** → ask the engineer: scaffold a brand-new project on
  Fission's design system now (see `fl-ds-setup`'s Step 2), or is this for
  an existing project elsewhere? **Don't** fall back to raw `<button>`s.

## Step 2 — the controls

```bash
npm install @tanstack/react-table@8
```

Pin to `@8`, not `@latest` — see `fl-ds-data-table`'s Step 1 for why
(tested live 2026-11-02: `@latest` resolves to a `9.x` with a rewritten,
incompatible API).

```tsx
import { Button } from "@/components/ui/button";

function Pagination({
  page, pageCount, onPageChange,
}: { page: number; pageCount: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">Page {page + 1} of {pageCount}</span>
      <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
```

If this sits next to a table, drive it off TanStack Table's own state
instead of tracking `page`/`pageCount` separately — read
`table.getState().pagination.pageIndex` and `table.getPageCount()`, call
`table.previousPage()` / `table.nextPage()`. See `fl-ds-data-table`, which
wires exactly this.

## Scope boundary

Controls only. For the table rows themselves, see `fl-ds-table` (static)
or `fl-ds-data-table` (sortable/paginated). For a feed that loads more on
scroll instead of page clicks, see `fl-ds-infinite-scroll`.
