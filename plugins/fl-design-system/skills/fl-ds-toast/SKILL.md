---
name: fl-ds-toast
description: Use when adding or editing a transient success/error/info notification (not an inline form error). Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Toast

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh toast
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to a plain unbranded `alert()` or
  unstyled banner.

## Step 2 — use the component

```tsx
// mounted once, near the app root
import { Toaster } from "@/components/ui/toaster";
<Toaster />

// called anywhere below it
import { useToast } from "@/components/ui/use-toast";
const { toast } = useToast();
toast({ title: "Saved", description: "Your changes were saved." });
toast({ title: "Something went wrong", variant: "error" });
```

A single `<Toaster />` mounted once near the app root is enough — don't
mount a second one per page.

Use `../../scripts/install-fission-component.sh toast --overwrite` to pull
an update if the installed component looks stale.

## Scope boundary

Toast/transient notification only. For an inline error inside a form
field, see `fl-ds-form`, not this skill.
