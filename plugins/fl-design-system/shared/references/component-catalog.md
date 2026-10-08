# Fission-owned components

Source: `FissionHQ/ui-design-system`, `src/registry/<name>/<name>.tsx`. Built
registry JSON ships from `public/r/`. A consumer project copies these into
`components/ui/` via the shadcn CLI pointed at the registry URL (see SKILL.md
step 2A) — never via the bare shadcn command, which installs the unbranded
default instead.

| Component | Import path | Registry URL |
| --- | --- | --- |
| Button | `@/components/ui/button` | `https://FissionHQ.github.io/ui-design-system/r/button.json` |
| Input | `@/components/ui/input` | `.../r/input.json` |
| Card | `@/components/ui/card` | `.../r/card.json` |
| Dialog | `@/components/ui/dialog` | `.../r/dialog.json` |
| Table | `@/components/ui/table` | `.../r/table.json` |
| Form | `@/components/ui/form` | `.../r/form.json` |
| Badge | `@/components/ui/badge` | `.../r/badge.json` |
| Select | `@/components/ui/select` | `.../r/select.json` |
| Tabs | `@/components/ui/tabs` | `.../r/tabs.json` |
| Toast | `@/components/ui/toast` | `.../r/toast.json` |

This list will grow — the demo site also shows richer surfaces (Accordion,
File Upload, charts: Bar/Line/Area/Pie/Radar/RadialBar, Map, Chat Window) that
may or may not be registry-published yet. **Don't assume a component on the demo
site is installable via the registry** — check `public/r/` in the upstream repo
(or ask) before telling an engineer to pull it as if it were owned.

## Not Fission's — install as plain shadcn primitives

`accordion`, `calendar`, `slider`, `dropdown-menu`, `sheet`, and anything else
not in the table above: `npx shadcn add <name>` with no registry URL.

## Style rules (enforced by this skill, checked again by `fl-standards` review)

- No raw `<button>`, `<input>`, `<select>` in product UI.
- No hardcoded hex colors in component files — use the token / Tailwind utility.
- Forms go through `<Form>` + `<FormField>`, not ad hoc state + raw inputs.
