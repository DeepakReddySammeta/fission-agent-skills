---
name: fl-ds-toast
description: Use when adding a success/error/info notification toast after an action. Installs or themes Fission's Toast — detects the project's design system first and adapts instead of forcing shadcn.
---

# Fission Toast

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
../../shared/scripts/install-fission-component.sh toast
../../shared/scripts/install-fission-component.sh toast --overwrite
```

shadcn's Toast needs two pieces: the `<Toaster />` mounted once near the app
root, and the `useToast()` hook called wherever an action fires a toast.

```tsx
// app/layout.tsx (once)
import { Toaster } from "@/components/ui/toaster";
export default function RootLayout({ children }) {
  return <html><body>{children}<Toaster /></body></html>;
}

// wherever an action completes
import { useToast } from "@/components/ui/use-toast";
const { toast } = useToast();

toast({ title: "Saved", description: "Your changes were saved." });
toast({ title: "Failed to save", description: "Try again.", variant: "destructive" });
```

If a toast fires and nothing appears, the first thing to check is whether
`<Toaster />` is actually mounted — a very common miss since it's a one-time
setup step easy to forget on a new page/layout.

Keep toast copy actionable (what happened, not "Error" alone) — ties into
`fl-standards`' writing-for-users guidance where that bundle is installed.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → MUI `<Snackbar>` +
  `<Alert severity="...">`, driven by a small context/hook since MUI has no
  built-in imperative `toast()` call
- `../../shared/references/adapters/chakra.md` → Chakra's own `useToast()` —
  closest API shape to shadcn's, easiest adapter of the four
- `../../shared/references/adapters/antd.md` → AntD's static `message.success(...)`
  / `message.error(...)` API, or `notification.open({...})` for richer toasts
- `../../shared/references/adapters/css-variables.md` → no library toast
  exists without one; a hand-rolled toast needs its own small
  mount-once-at-root + imperative-trigger pattern mirroring the shadcn shape
  above — don't skip the "mounted once at root" part

## Scope boundary

Toast/notification only. This is not a persistent banner or inline form
error — those stay in the page (inline form errors go through `fl-ds-form`).
