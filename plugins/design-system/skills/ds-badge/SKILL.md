---
name: ds-badge
description: Use when adding or editing a status badge / tag / label chip (not a notification-count dot), on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Badge

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Badge
  is fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — don't fall back to a plain unbranded
  `<span>`
- `unknown` → ask, don't guess

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Badge
install/update command and import path. Badge typically shares its variant
set with Button on a given brand (e.g. Fission's
`Default, Secondary, Outline, Error, Success, Warning`) — see `ds-button`
for that brand's confirmed/inferred variant list.

## Step 2B — adapter path

**Naming mismatch to watch for**: "Badge" here means a status tag/chip
(e.g. "Active", "Pending"), not a notification-count dot. Several libraries
use `Badge` for the dot and a different component for the chip:

- `adapters/mui.md` → MUI's own `<Badge>` is the notification-dot
  component; the status-chip equivalent is `<Chip label="Active" color="success" />`
- `adapters/chakra.md` → Chakra `<Badge colorScheme="green">Active</Badge>`
  — naming matches directly here, no swap needed
- `adapters/antd.md` → AntD's own `<Badge>` is also the notification-dot
  component; the status-chip equivalent is `<Tag color="success">Active</Tag>`
- `adapters/css-variables.md` → a `.badge`/`.chip` class consuming
  `var(--success)`/`var(--destructive)`/etc. per status

## Scope boundary

Badge/status-chip only. For the button-style action variants this often
shares with, see `ds-button`.
