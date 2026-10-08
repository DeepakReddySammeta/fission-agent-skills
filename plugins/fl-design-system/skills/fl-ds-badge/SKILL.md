---
name: fl-ds-badge
description: Use when adding or editing a status badge, tag, or label chip. Installs or themes Fission's Badge — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Badge

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
../../shared/scripts/install-fission-component.sh badge
../../shared/scripts/install-fission-component.sh badge --overwrite
```

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="outline">Archived</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="success">Passed</Badge>
<Badge variant="warning">Needs review</Badge>
```

Same confirmed variant set as Button (`Default, Secondary, Outline, Error,
Success, Warning`) — the live demo lists "Button or badge variants" together,
so Badge shares Button's semantic palette by design. Confirm exact prop
strings against `src/registry/badge/badge.tsx` the first time this is used
in a real project; correct this file via PR if they differ.

**Badge vs. Button**: a Badge is non-interactive status/metadata (a pill next
to a table row, a tag on a card). If it needs an onClick, it should probably
be a small `Button variant="outline" size="sm"`, not a clickable Badge —
flag this instead of adding `onClick` to a Badge silently.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<Chip color="...">` (Chip
  is MUI's Badge-equivalent for this use; MUI's own `<Badge>` is a small
  counter overlay, a different concept — don't conflate the two)
- `../../shared/references/adapters/chakra.md` → Chakra `<Tag
  colorScheme="...">` or `<Badge colorScheme="...">`
- `../../shared/references/adapters/antd.md` → AntD `<Tag color="...">`
- `../../shared/references/adapters/css-variables.md` → a `.badge` class
  consuming the matching semantic token (`--success`, `--warning`, etc.)

Map semantic meaning (active/draft/failed/passed) to that system's nearest
equivalent color role — don't invent a new hex value per project.

## Scope boundary

Badge only. See sibling skills for the rest of the catalog (`fl-ds-button`,
`fl-ds-table`, …).
