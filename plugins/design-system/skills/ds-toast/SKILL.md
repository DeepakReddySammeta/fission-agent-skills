---
name: ds-toast
description: Use when adding or editing a transient success/error/info notification (not an inline form error), on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Toast

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's
  Toast/Sonner setup is fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — don't fall back to a plain unbranded
  `alert()` or unstyled banner
- `unknown` → ask, don't guess

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Toast
install/update command and import path. shadcn's Toast needs a single
`<Toaster />` mounted once near the app root, then `toast()`/`useToast()`
calls anywhere below it — don't mount a second `<Toaster />` per page.

## Step 2B — adapter path

- `adapters/mui.md` → MUI `<Snackbar>` — one instance per message, state
  driven by the caller (`open`/`onClose`); no global `toast()` call the way
  shadcn/Chakra provide — if several toasts can queue, a small queue
  wrapper is needed
- `adapters/chakra.md` → Chakra's `useToast()` hook, called anywhere once
  `<ChakraProvider>` wraps the app — closest match to shadcn's ergonomics
- `adapters/antd.md` → AntD's static `message.success()`/`message.error()`
  (brief, auto-dismissing) or `notification.open()` (richer, with
  title+description) — pick based on how much content the message carries
- `adapters/css-variables.md` → no native toast primitive; a small
  hand-rolled queue + portal is needed regardless of styling layer — flag
  this as real added complexity, not a trivial CSS-only task

## Scope boundary

Toast/transient notification only. For an inline error inside a form field,
see `ds-form`, not this skill.
