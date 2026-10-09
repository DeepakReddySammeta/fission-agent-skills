---
name: fl-ds-form
description: Use when adding or editing a form with validation (not a single bare input). Checks whether Fission's design system is installed first and installs it if needed, instead of falling back to an unbranded element.
---

# Fission Form

## Step 1 — is Fission's design system ready here?

```bash
node ../../scripts/detect-fission-design-system.mjs
```

- **`ready`** → **Step 2**
- **`needs-setup`** → install this component now, then continue to **Step 2**:
  ```bash
  ../../scripts/install-fission-component.sh form
  ```
- **`greenfield`** → nothing is scaffolded yet. Ask the engineer: scaffold a
  brand-new project on Fission's design system now (see `fl-ds-setup`'s
  Step 2), or is this meant for an existing project in a different
  directory? **Don't** fall back to ad hoc `useState` + manual validation
  with zero brand styling.

## Step 2 — use the component

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";

const form = useForm({ resolver: zodResolver(schema) });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Save</Button>
  </form>
</Form>
```

`<Form>` wraps react-hook-form + a resolver (commonly Zod) — `<FormField>`
+ `<FormItem>` + `<FormLabel>` + `<FormControl>` + `<FormMessage>` per
field. Don't hand-roll validation state alongside it; define the schema
once and let the resolver + `<FormMessage>` surface errors.

Use `../../scripts/install-fission-component.sh form --overwrite` to pull
an update if the installed component looks stale.

## Scope boundary

Form/validation flow only. For an individual field's look see
`fl-ds-input` (text) or `fl-ds-select` (dropdown); for the submit button
see `fl-ds-button`.
