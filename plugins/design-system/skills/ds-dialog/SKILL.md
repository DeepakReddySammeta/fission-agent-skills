---
name: ds-dialog
description: Use when adding or editing a modal, confirmation dialog, or popup, on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Dialog

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Dialog
  is fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — **confirmed failure mode to avoid**: the
  fallback here is a stock HTML `<dialog>` with zero branding, which is not
  completing the task
- `unknown` → ask, don't guess

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Dialog
install/update command and import path
(`Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogFooter`/
`DialogTrigger`).

Control `open`/`onOpenChange` explicitly for anything needing programmatic
open/close (confirm dialogs, multi-step flows); use `DialogTrigger` alone
only for a simple click-to-open case. Always include `DialogTitle` — shadcn
Dialogs are built on Radix, which warns at runtime if a title is missing
(an accessibility requirement, not optional chrome). Use the destructive
action's Button variant to match the stakes (error/destructive for delete,
not default) — see `ds-button`.

## Step 2B — adapter path

- `adapters/mui.md` → MUI `<Dialog>` + `<DialogTitle>` + `<DialogContent>` +
  `<DialogActions>`
- `adapters/chakra.md` → Chakra `<Modal>` (**not** `<Dialog>` — Chakra's
  naming differs from shadcn/Radix here) + `<ModalOverlay>` +
  `<ModalContent>`
- `adapters/antd.md` → AntD `<Modal open={} onOk={} onCancel={}>`
- `adapters/css-variables.md` → a hand-rolled modal needs focus trapping and
  Escape-to-close handled explicitly, which a library gives for free — flag
  this cost if the project is CSS-only and the dialog is anything beyond a
  trivial confirm

## Scope boundary

Dialog/modal only. For the confirm/cancel buttons inside it see `ds-button`;
for a form inside it see `ds-form`.
