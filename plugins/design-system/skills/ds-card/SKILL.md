---
name: ds-card
description: Use when adding or editing a card / content panel / grouped surface, on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Card

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Card is
  fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — don't fall back to a plain unbranded `<div>`
- `unknown` → see `../../shared/references/unknown-system.md` — the detector's report usually already shows why (an unrecognized component directory or design-systemish dependency); don't guess, and don't fall back to a different system's styling.

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Card
install/update command and import path (`<Card>`, `<CardHeader>`,
`<CardContent>`, `<CardFooter>`).

## Step 2B — adapter path

- `adapters/mui.md` → MUI `<Card>` + `<CardContent>` (+ `<CardActions>` for
  a footer) — background/elevation come from the mapped `palette.background`
- `adapters/chakra.md` → Chakra `<Card>` + `<CardBody>` (Chakra v2+; on
  older Chakra, a styled `<Box>` is the fallback — confirm the installed
  version first)
- `adapters/antd.md` → AntD `<Card title={}>` with `extra`/`actions` props
  for header/footer content, different composition than shadcn's
  subcomponent pattern
- `adapters/css-variables.md` → a `.card` class consuming `var(--card)`/
  `var(--border)`

## Scope boundary

Card only — the generic grouped-surface container. For a specific
interactive surface (a modal/popup) see `ds-dialog`; for tabular data see
`ds-table`.
