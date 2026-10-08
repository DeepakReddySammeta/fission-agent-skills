---
name: fl-ds-dialog
description: Use when adding or editing a modal, confirmation dialog, or popup. Installs or themes Fission's Dialog — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Dialog

## Step 1 — which path applies

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` / `greenfield` → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**

## Step 2 — Fission-native (shadcn)

```bash
../../shared/scripts/install-fission-component.sh dialog
../../shared/scripts/install-fission-component.sh dialog --overwrite
```

```tsx
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><Button variant="outline">Delete</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete this project?</DialogTitle>
      <DialogDescription>This can't be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="error" onClick={onConfirm}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Control `open`/`onOpenChange` explicitly for anything that needs
programmatic open/close (confirm dialogs, multi-step flows); use
`DialogTrigger` alone only for a simple "click to open" case. Always include
`DialogTitle` — shadcn's Dialog is built on Radix, which warns at runtime if
a title is missing (an accessibility requirement, not optional chrome).

Use the destructive action's Button variant to match the stakes (`error` for
delete, not `default`) — see `fl-ds-button`.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<Dialog>` +
  `<DialogTitle>` + `<DialogContent>` + `<DialogActions>`
- `../../shared/references/adapters/chakra.md` → Chakra `<Modal>` (not
  `<Dialog>` — Chakra's naming differs from shadcn/Radix here) +
  `<ModalOverlay>` + `<ModalContent>`
- `../../shared/references/adapters/antd.md` → AntD `<Modal open={} onOk={} onCancel={}>`
- `../../shared/references/adapters/css-variables.md` → a hand-rolled modal
  needs focus trapping and Escape-to-close handled explicitly — a library
  gives you both for free; flag this cost if the project is CSS-only and the
  dialog is anything beyond a trivial confirm

## Scope boundary

Dialog/modal only. For the confirm/cancel buttons inside it, see
`fl-ds-button`; for a form inside it, see `fl-ds-form`.
