---
name: fl-ds-new-project
description: Use when starting a brand-new project from scratch and the framework and/or styling approach haven't been decided yet. Scaffolds the project in whatever framework (Next.js, React, Vue, Angular, Astro, etc.) and styling system the engineer picks — and when the framework supports Fission's design system, lists it as its own directly selectable option, not a footnote under something else.
---

# New project — framework, then styling (with Fission listed directly when it applies)

Two questions, asked as two separate steps — but when Fission's design
system is on the table, it must be its own clearly labeled, directly
selectable item in the second question's list, never folded into another
option's description text and never deferred to a follow-up question
after the fact. If an engineer can see "Tailwind CSS" and "Fission's
Design System" side by side and pick either one directly, that's correct.
If "Fission" only shows up as a parenthetical under "Tailwind CSS", that's
the exact bug this file exists to prevent — fix the menu, not the wording.

## Step 1 — ask the framework

Ask which framework or library this project uses. Any answer is valid —
Next.js, React (Vite/CRA), Vue, Angular, Astro, Svelte, or something else.
Don't pre-filter the menu to only what Fission supports; the engineer
should see the real, full choice.

## Step 2 — ask styling, with Fission listed directly when the framework qualifies

Fission's design system only ever applies to **Next.js** (fully — a
dedicated starter) or plain **React** (partially — components install
manually, no dedicated starter). For those two frameworks, list it as a
numbered option on equal footing with everything else:

1. **Fission's Design System** — Fission's own branded components, built
   on Tailwind + shadcn. Installs/scaffolds automatically.
2. Tailwind CSS — utility-first CSS, no component library
3. shadcn/ui — plain, unbranded component primitives on Radix + Tailwind
4. Plain CSS / Sass
5. Material UI / Bootstrap / Chakra / Ant Design
6. Something else

For any other framework (Vue, Angular, Svelte, SolidJS, …), **don't list
Fission at all** — it's architecturally incompatible with those
frameworks (shadcn/Radix is React-only), not a hidden option to surface
later. Astro is unverified either way; leave it off the list too until
someone actually confirms it works and writes that up. The menu for an
unsupported framework is just options 2–6 above, renumbered.

## Step 3 — branch on the answer

- **Fission's Design System chosen directly** → skip straight to
  `fl-ds-setup` — no separate confirmation needed, the engineer already
  chose it explicitly:
  - Next.js → its Step 2, the real Fission starter scaffold (this
    replaces any generic scaffold below — don't also run a plain
    `create-next-app` first).
  - React → scaffold plain React first (see the table below), then
    `fl-ds-setup`'s Step 3 installs Fission's components into it.
- **Anything else chosen** (Tailwind-only, shadcn-bare, plain CSS/Sass,
  MUI/Bootstrap/Chakra/AntD, something else) → scaffold with that
  framework's own official tooling, per the table below. No Fission skill
  gets involved, and don't ask about Fission again afterward — the
  engineer already had the direct option and didn't take it.

| Framework | Scaffold command | Adding a non-Fission styling system |
| --- | --- | --- |
| Next.js | `npx create-next-app@latest <name>` | Its own setup prompt offers Tailwind directly; for MUI/Bootstrap/Chakra/AntD, scaffold plain and then follow that library's own Next.js install guide |
| React (Vite) | `npm create vite@latest <name> -- --template react-ts` | Add Tailwind/MUI/Bootstrap/Chakra/AntD afterward, per that library's own Vite install guide |
| Vue | `npm create vue@latest <name>` | Its own setup prompt offers common options; otherwise per that library's own Vue install guide |
| Angular | `ng new <name> --style=<css\|scss\|sass\|less>` | `ng add @angular/material` for Material; other libraries per their own Angular install guide |
| Astro | `npm create astro@latest <name>` | `astro add tailwind` (official integration); other libraries per their own Astro install guide |

Prefer each framework's own, currently-documented scaffolding command over
a hand-rolled one — these tools change their flags and prompts over time,
so verify against current docs rather than trusting this table verbatim
if it's been a while.

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
of the styling choices) and the initial scaffold. Once Fission is chosen,
`fl-ds-setup` and the `fl-ds-*` component skills take over entirely —
don't duplicate their logic here, and don't re-ask about Fission on later
prompts once this menu has already been answered for this project.
