---
name: fl-ds-form
description: Use when building or editing a form with validated fields (not a single standalone input). Wires Fission's Form/FormField around Input/Select, adapting to the project's existing design system.
---

# Fission Form

This is the one component skill that's really a composition pattern, not a
single element — it wires whichever field components (`fl-ds-input`,
`fl-ds-select`) into validated, labeled fields.

## Step 1 — which path applies

```bash
node ../../shared/scripts/detect-design-system.mjs
```

- `fission-shadcn` / `shadcn-bare` / `greenfield` → **Step 2**
- `mui` / `chakra` / `antd` / `css-only` → **Step 3**

## Step 2 — Fission-native (shadcn)

```bash
../../shared/scripts/install-fission-component.sh form
../../shared/scripts/install-fission-component.sh form --overwrite
```

shadcn's Form is `react-hook-form` + (usually) `zod`, wrapped in
`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage`. Check
`package.json` for `react-hook-form` and `zod` before assuming they're
present — install both if this is the first form in the project.

```tsx
const schema = z.object({ email: z.string().email() });
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

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
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

Don't write ad hoc `useState` + manual validation once a project has this
pattern installed — it's the most common drift point between a project's
early quick-form code and its later, properly-validated forms. If you find
the former while working on the latter, flag it rather than leaving two
styles side by side.

`FormControl`'s child can be `fl-ds-input`'s `<Input>` or `fl-ds-select`'s
`<Select>` — this skill wires validation and messaging; the field skills own
the control itself.

## Step 3 — adapter path

- `../../shared/references/adapters/mui.md` → `react-hook-form` +
  MUI's `<TextField>` via `Controller`, error text through
  `helperText`/`error` props instead of a separate `FormMessage`
- `../../shared/references/adapters/chakra.md` → `react-hook-form` +
  Chakra `<FormControl isInvalid={}>` + `<FormErrorMessage>`
- `../../shared/references/adapters/antd.md` → AntD's own `<Form>` +
  `<Form.Item rules={[...]}>` — AntD has its own validation system; don't
  mix in `react-hook-form` unless the project already standardized on it
- `../../shared/references/adapters/css-variables.md` → `react-hook-form`
  alone, with manual error `<span>` styled from tokens

## Scope boundary

Validation/labeling wiring only. For the input/select/button elements
themselves, see their own skills.
