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
