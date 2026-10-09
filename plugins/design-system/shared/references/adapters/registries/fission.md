# Registry: Fission UI (brand id `fission`)

Self-contained on purpose — this file works even if the separate
`fl-design-system` plugin isn't installed, so `design-system` never requires
a second plugin to function. (If `fl-design-system` *is* installed, its
`fl-ds-setup` skill and `install-fission-component.sh` guard script are the
better way to install/update these components; this file is the fallback
and the per-component usage reference either way.)

Source: `FissionHQ/ui-design-system`, `src/registry/<name>/<name>.tsx`.
Registry JSON ships from `public/r/`. Never install via the bare shadcn
command for any of these 10 names — that pulls the unbranded stock
component and drops Fission's variants.

```bash
npx shadcn add https://FissionHQ.github.io/ui-design-system/r/<name>.json
npx shadcn add https://FissionHQ.github.io/ui-design-system/r/<name>.json --overwrite   # update
```

| Component | `<name>` | Import path |
| --- | --- | --- |
| Button | `button` | `@/components/ui/button` |
| Input | `input` | `@/components/ui/input` |
| Card | `card` | `@/components/ui/card` |
| Dialog | `dialog` | `@/components/ui/dialog` |
| Table | `table` | `@/components/ui/table` |
| Form | `form` | `@/components/ui/form` |
| Badge | `badge` | `@/components/ui/badge` |
| Select | `select` | `@/components/ui/select` |
| Tabs | `tabs` | `@/components/ui/tabs` |
| Toast | `toast` | `@/components/ui/toast` |

**Confirmed from the live demo**: Button and Badge share a non-stock variant
set — `Default, Secondary, Outline, Error, Success, Warning` — different
from stock shadcn's `default/destructive/outline/secondary/ghost/link`.

**Inferred, not read from source**: the exact lowercase prop strings
(`error`, `success`, `warning`) for Button/Badge, and every other
component's prop API beyond standard shadcn composition. Confirm against
`FissionHQ/ui-design-system` the first time a component is used in a
session, and correct this file via PR if it differs.

Token values (hex, per theme) live in `fl-design-system`'s
`references/fission-tokens.md`, not here — this file is usage/install only.

Not Fission's — install as plain shadcn primitives, no registry URL:
`accordion`, `calendar`, `slider`, `dropdown-menu`, `sheet`, and anything
else not in the table above.
