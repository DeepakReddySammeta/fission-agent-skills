---
name: fl-ds-dialog
description: Use when adding or editing a modal, confirmation dialog, or popup. Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Dialog

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh dialog
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain, unbranded HTML `<dialog>` —
  confirmed in testing: this exact case produced a stock dialog with zero
  Fission styling, which isn't completing the task.

## Step 2 — use the component

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
`DialogTrigger` alone only for a simple "click to open" case. Always
include `DialogTitle` — shadcn's Dialog is built on Radix, which warns at
runtime if a title is missing (an accessibility requirement, not optional
chrome).

Use the destructive action's Button variant to match the stakes (`error`
for delete, not `default`) — see `fl-ds-button`.

Use `../../scripts/install-fission-component.sh dialog --overwrite` to
pull an update if the installed component looks stale.

## Scope boundary

Dialog/modal only. For the confirm/cancel buttons inside it, see
`fl-ds-button`; for a form inside it, see `fl-ds-form`.
