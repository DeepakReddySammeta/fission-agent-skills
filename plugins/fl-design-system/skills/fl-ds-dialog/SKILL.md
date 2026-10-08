---
name: fl-ds-dialog
description: Use when adding or editing a modal, confirmation dialog, or popup. Installs or themes Fission's Dialog — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Dialog

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
