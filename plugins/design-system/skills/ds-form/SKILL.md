---
name: ds-form
description: Use when adding or editing a form with validation (not a single bare input), on any project regardless of which design system it runs. Detects the project's actual stack first and adapts instead of assuming shadcn, Fission, or any other specific system.
---

# Form

## Step 1 — detect

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `shadcn:<brand>` → **Step 2A**
- `shadcn-bare` → ask which brand applies, or confirm stock shadcn's Form is
  fine as-is
- `mui` / `chakra` / `antd` / `css-only` → **Step 2B**
- `greenfield` → stop and ask — don't fall back to ad hoc `useState` +
  manual validation with zero brand styling
- `unknown` → ask, don't guess

## Step 2A — registered brand (shadcn)

Open that brand's file under
`../../shared/references/adapters/registries/` and follow its Form
install/update command and import path. shadcn's `<Form>` wraps
react-hook-form + a resolver (commonly Zod) — `<FormField>` +
`<FormItem>` + `<FormLabel>` + `<FormControl>` + `<FormMessage>` per field.
Don't hand-roll validation state alongside it; define the schema once and
let the resolver + `<FormMessage>` surface errors.

## Step 2B — adapter path

- `adapters/mui.md` → no built-in `<Form>` component — pair
  react-hook-form's `Controller` with MUI field components
  (`<TextField>` etc.), reading `error`/`helperText` off
  `formState.errors`
- `adapters/chakra.md` → `<FormControl isInvalid={}>` +
  `<FormLabel>` + the field + `<FormErrorMessage>`, driven by
  react-hook-form the same way
- `adapters/antd.md` → AntD ships its own `<Form>` + `<Form.Item>` with
  built-in validation rules — a materially different API from the
  react-hook-form pattern above; don't bolt react-hook-form onto it, use
  AntD's own `rules` prop and `form.validateFields()`
- `adapters/css-variables.md` → hand-rolled state + validation; still pair
  with react-hook-form + a resolver rather than ad hoc `useState` per field,
  the library cost is the same regardless of styling layer

## Scope boundary

Form/validation flow only. For an individual field's look see `ds-input`
(text) or `ds-select` (dropdown); for the submit button see `ds-button`.
