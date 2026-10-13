---
name: fl-ds-new-project
description: Use when starting a brand-new project from scratch and the framework and/or styling approach haven't been decided yet. Scaffolds the project in whatever framework (Next.js, React, Vue, Angular, Astro, Svelte, etc.) the engineer picks, then asks styling scoped to what that specific framework can actually use — Fission's design system only ever appears as a direct option on Next.js/React, never offered where it can't work.
---

# New project — framework, then a styling menu scoped to that framework

Two questions, asked as two separate steps. The styling question in Step
2 is **not** one generic list with Fission added or removed — it's scoped
per framework, because most styling options are framework-specific
(`shadcn/ui`, Material UI, and Chakra are React-only; Angular Material and
`ng-zorro-antd` are Angular-only; Vuetify and Element Plus are Vue-only,
and so on). Offering a React-only library to an Angular project is the
same category of mistake as offering Fission to one — don't do either.

When Fission's design system is on the table, it must be its own clearly
labeled, directly selectable item in Step 2's list, never folded into
another option's description text and never deferred to a follow-up
question after the fact. If an engineer can see "Tailwind CSS" and
"Fission's Design System" side by side and pick either one directly,
that's correct. If "Fission" only shows up as a parenthetical under
"Tailwind CSS", that's the exact bug this file exists to prevent — fix
the menu, not the wording.

## Step 1 — ask the framework

Ask which framework or library this project uses. Any answer is valid —
Next.js, React (Vite/CRA), Vue, Angular, Astro, Svelte, or something else.
Don't pre-filter the menu to only what Fission supports; the engineer
should see the real, full choice.

## Step 2 — ask styling, scoped to what that framework can actually use

Use the table below to build the menu for whichever framework was named
in Step 1. Only list what that framework can actually use — don't carry
over a React-only option (shadcn/ui, Material UI, Chakra) onto Vue,
Angular, Svelte, or anything else non-React, the same way Fission itself
never gets offered there.

| Framework | Scaffold command | Styling options to offer (ask which) |
| --- | --- | --- |
| **Next.js** | `npx create-next-app@latest <name>` | **Fission's Design System** (full support — a dedicated starter; chosen here means using `fl-ds-setup`'s scaffold instead of the command at left, not both) · Tailwind CSS · shadcn/ui · Plain CSS / Sass / CSS Modules · Material UI · Bootstrap · Chakra UI · Ant Design · something else |
| **React** (Vite/CRA) | `npm create vite@latest <name> -- --template react-ts` | **Fission's Design System** (partial support — no dedicated starter, components install manually via `fl-ds-setup`'s Step 3 after this scaffold runs) · Tailwind CSS · shadcn/ui · Plain CSS / Sass / CSS Modules · Material UI · Bootstrap · Chakra UI · Ant Design · something else |
| **Vue** | `npm create vue@latest <name>` | Tailwind CSS · Plain CSS / Sass · Vuetify · Element Plus · Ant Design Vue · PrimeVue · Bootstrap (`bootstrap-vue-next`) · something else — **no Fission, no shadcn/ui, no Material UI/Chakra** (all of those are React-only, architecturally incompatible with Vue, not a gap to close later) |
| **Angular** | `ng new <name> --style=css` (or `scss`/`sass`/`less`) | Tailwind CSS · Angular's own style preprocessor (CSS/Sass/Less, chosen at scaffold time via the command's own `--style` flag) · Angular Material · PrimeNG · ng-bootstrap · `ng-zorro-antd` (Ant Design for Angular) · something else — **no Fission, no shadcn/ui, no Material UI/Chakra** (same reason as Vue) |
| **Svelte** | `npx sv create <name>` (current SvelteKit CLI — verify against current docs, this has changed names before) | Tailwind CSS · Plain CSS · Flowbite-Svelte · Skeleton · Bootstrap · something else — **no Fission, no shadcn/ui** (official shadcn/ui is React-only; `shadcn-svelte` is an unrelated community port of the same idea, not the same project — don't conflate the two or imply Fission relates to it) |
| **Astro** | `npm create astro@latest <name>` | Tailwind CSS (official `astro add tailwind` integration) · Plain CSS · a component library matching whichever UI framework island is added (React/Vue/Svelte), if any · something else — **no Fission** (unverified either way; nobody has tried Fission's components inside an Astro React island here, so don't offer or imply it works) |

Prefer each framework's own, currently-documented scaffolding command over
a hand-rolled one — these tools change their flags, prompts, and even
names over time (the Svelte one already has), so verify against current
docs rather than trusting this table verbatim if it's been a while.

For a framework not in this table, ask the engineer directly what styling
options are even available for it rather than guessing — don't invent a
plausible-sounding library name.

## Step 3 — branch on the answer

- **Fission's Design System chosen directly** (Next.js or React only) →
  skip straight to `fl-ds-setup` — no separate confirmation needed, the
  engineer already chose it explicitly:
  - Next.js → `fl-ds-setup`'s Step 2, the real Fission starter scaffold
    (this replaces the generic `create-next-app` command in the table
    above — don't run both).
  - React → scaffold plain React first (the Vite command above), then
    `fl-ds-setup`'s Step 3 installs Fission's components into it.
- **Anything else chosen** — scaffold with that framework's own official
  tooling (the command in the table above), then add the chosen styling
  system per its own current install guide for that framework. No Fission
  skill gets involved, and don't ask about Fission again afterward on a
  Fission-eligible framework where the engineer already had the direct
  option and picked something else; don't ask about it at all on a
  framework where it was never offered.

Confirm the scaffold actually ran (the folder exists, `package.json` has
the expected dependency) before declaring it done.

## If a conflicting library gets chosen on a Fission-eligible framework

If the engineer picks Next.js or React but then picks MUI/Bootstrap/
Chakra/Ant Design in Step 2 instead of Fission, that's a deliberate choice
already made in the same menu — don't second-guess it with another prompt
afterward. If they later ask to also add Fission's components on top,
that's when to flag the conflict (same reasoning as `fl-ds-setup`'s "if
the project already runs a different full component library" note) and
ask whether to drop the other library in favor of Fission's, or keep both
questions separate and let the engineer decide then.

## Once Fission is chosen, say what changes

Tell the engineer plainly: from here on, asking for a Button, Dialog,
Card, and so on will route through the `fl-ds-*` component skills (which
check Fission's install state themselves and install on demand), not
generic components — that's the actual point of having chosen it.

## Scope boundary

This skill owns the framework + styling decision (Fission included as one
of the styling choices, only where it actually applies) and the initial
scaffold. Once Fission is chosen, `fl-ds-setup` and the `fl-ds-*`
component skills take over entirely — don't duplicate their logic here,
and don't re-ask about Fission on later prompts once this menu has
already been answered for this project.
