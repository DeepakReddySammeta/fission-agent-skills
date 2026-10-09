---
name: fl-ds-new-project
description: Use when starting a brand-new project from scratch and the framework and/or styling approach haven't been decided yet. Scaffolds the project in whatever framework (Next.js, React, Vue, Angular, Astro, etc.) and styling system (Tailwind, shadcn, Material UI, Bootstrap, Chakra, Ant Design, plain CSS/Sass, etc.) the engineer picks — then, only when that choice actually supports Fission's design system, asks whether to also set it up, and only then hands off to Fission's own skills.
---

# New project — framework, styling, and (only if it applies) Fission's design system

Three separate questions — don't collapse them into one, and don't skip
straight to Fission:

1. What framework?
2. What styling / component system?
3. *(Only if 1 and 2 make it possible)* — do you want Fission's design
   system too?

Scaffolding happens regardless of whether Fission applies. This skill helps
set up a new project either way — Fission is an optional layer on top, only
when it's actually compatible, never the default assumption.

## Step 1 — ask the framework

Ask which framework or library this project uses. Any answer is valid —
Next.js, React (Vite/CRA), Vue, Angular, Astro, Svelte, or something else.
Don't pre-filter the menu to only what Fission supports; the engineer
should see the real, full choice.

## Step 2 — ask the styling / component system

Ask which CSS or component library this project should use: plain CSS,
Sass/SCSS, Tailwind CSS, shadcn/ui, Material UI (MUI), Bootstrap, Chakra
UI, Ant Design, or something else. Same rule as Step 1 — this question is
independent of Fission entirely, don't narrow it.

## Step 3 — scaffold with that framework's own official tooling

Prefer each framework's own, currently-documented scaffolding command over
a hand-rolled one — these tools change their flags and prompts over time,
so verify against current docs rather than trusting the table below
verbatim if it's been a while. As of this writing, the usual entry points:

| Framework | Scaffold command | Adding a styling system |
| --- | --- | --- |
| Next.js | `npx create-next-app@latest <name>` | Its own setup prompt offers Tailwind directly; for MUI/Bootstrap/Chakra/AntD, scaffold plain and then follow that library's own Next.js install guide |
| React (Vite) | `npm create vite@latest <name> -- --template react-ts` | Add Tailwind/MUI/Bootstrap/Chakra/AntD afterward, per that library's own Vite install guide |
| Vue | `npm create vue@latest <name>` | Its own setup prompt offers common options; otherwise per that library's own Vue install guide |
| Angular | `ng new <name> --style=<css\|scss\|sass\|less>` | `ng add @angular/material` for Material; other libraries per their own Angular install guide |
| Astro | `npm create astro@latest <name>` | `astro add tailwind` (official integration); other libraries per their own Astro install guide |

Scaffold first, confirm it actually ran (the folder exists, `package.json`
has the expected dependency) before moving to Step 4 — don't ask about
Fission against a scaffold that silently failed.

## Step 4 — does Fission's design system even apply here

Only ask this if **both** hold:

- **Framework** is Next.js (fully supported, dedicated starter) or plain
  React (partially supported, components install manually). Anything else
  — Vue, Angular, Svelte, SolidJS, etc. — is architecturally incompatible
  with Fission's shadcn/Radix-based components, full stop; don't ask, say
  so in one line and move on. Astro is unverified, not confirmed either
  way — treat it as "don't ask" until someone actually tries it and writes
  up the result.
- **Styling choice** is Tailwind or shadcn/ui, or genuinely still open. If
  the engineer explicitly chose MUI, Bootstrap, Chakra, or Ant Design in
  Step 2, Fission's components don't layer onto that cleanly — tell them
  plainly (same reasoning as `fl-ds-setup`'s "if the project already runs
  a different full component library" note) and ask whether they'd rather
  drop that library in favor of Fission's, or keep it and skip Fission.
  Don't silently install Fission's components alongside a different
  library already chosen on purpose.

If both hold, ask directly: **"This project can run Fission's design
system — do you want to set it up?"**

- **Yes** → hand off to `fl-ds-setup`:
  - Next.js → its Step 2, the real Fission starter scaffold. This
    generally *replaces* the generic Step 3 scaffold above, since Fission's
    own starter is richer (branded components, demo pages) than a bare
    `create-next-app` output — don't keep both.
  - React → its Step 3, installing Fission's components into the project
    Step 3 above already created.
- **No** → stop here. The project stays exactly as scaffolded in Step 3,
  with whatever styling was chosen, and no Fission skill gets involved.
- **Didn't qualify** (wrong framework, or a conflicting styling library
  already chosen on purpose) → don't ask at all. State in one line that
  Fission's design system doesn't apply here and why, then stop.

## Step 5 — once Fission is confirmed, say what changes

Tell the engineer plainly: from here on, asking for a Button, Dialog,
Card, and so on will route through the `fl-ds-*` component skills (which
check Fission's install state themselves and install on demand), not
generic components — that's the actual point of having confirmed this.

## Scope boundary

This skill owns the framework + styling + Fission-applicability decision
and the initial scaffold. Once Fission is confirmed, `fl-ds-setup` and the
`fl-ds-*` component skills take over entirely — don't duplicate their
logic here, and don't keep asking about Fission on later prompts once
Step 4 has already been answered for this project.
