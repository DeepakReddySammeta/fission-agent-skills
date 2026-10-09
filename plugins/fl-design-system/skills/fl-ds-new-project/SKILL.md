---
name: fl-ds-new-project
description: Use when starting a brand-new project from scratch and the framework or library hasn't been decided yet, or when asked to scaffold a new app without a framework already named. Asks which framework, states plainly which ones Fission's design system currently supports, and only wires up Fission's components for a supported choice.
---

# New project — which framework, and does Fission's design system apply

Don't scaffold anything yet, and don't assume Next.js. Ask which
framework or library this new project will use, and show the real support
picture so the choice is informed — don't silently narrow the options to
only what's supported; let the engineer see the full picture and decide.

## Step 1 — show this, then ask

| Framework | Fission's design system | What happens if chosen |
| --- | --- | --- |
| **Next.js** | ✅ Fully supported — dedicated starter template | Scaffolds Fission's actual starter project (gallery + dashboard demo), ready immediately |
| **React** (Vite, CRA, etc.) | ⚠️ Partially supported — no dedicated starter, but the components install manually | Scaffolds a plain React project with standard tooling, then installs Tailwind + shadcn + Fission's components into it |
| **Vue** | ❌ Not supported | Fission's components are built on shadcn/Radix, which is a React-only pattern — they cannot be used in a Vue project at all. Not a gap to close later without rebuilding the component library itself in Vue |
| **Angular** | ❌ Not supported | Same reason as Vue — architecturally incompatible, not just unimplemented |
| **Svelte / SolidJS / etc.** | ❌ Not supported | Same reason |
| **Astro** | ❌ Not supported (unverified) | Possible in principle via Astro's React islands, but nobody has tried or documented it here — treat as unsupported until someone verifies and writes it up, don't guess that it works |

Keep this table in sync with reality, not the other way around — if
Fission's upstream repo (`FissionHQ/ui-design-system`) ever adds another
template or official framework support, update this table (and
`fl-ds-setup`'s Step 2) to match, rather than leaving this skill telling
engineers something that's gone stale.

## Step 2 — branch on the answer

- **Next.js** → hand off to `fl-ds-setup`'s Step 2 (the actual git clone +
  `npm run create` scaffold). Don't duplicate that command here — invoke
  that skill's logic.
- **React (Vite/CRA/etc.)** → scaffold with standard tooling first, e.g.:
  ```bash
  npm create vite@latest <target-dir> -- --template react-ts
  ```
  Then hand off to `fl-ds-setup`'s Step 3 (install Fission's components
  into the now-existing project) — the shadcn CLI sets up `components.json`
  and Tailwind on its own first run.
- **Anything not supported** (Vue, Angular, Svelte, Astro, …) — Fission's
  design system doesn't apply here at all. Ask the engineer directly which
  they'd rather do instead of guessing:
  - Scaffold the project with that framework's own standard tooling, no
    Fission components, nothing further from this plugin; or
  - Switch to a supported framework (Next.js or React) instead.
  Don't silently scaffold nothing, and don't silently force Next.js on
  someone who asked for Vue.

## Scope boundary

This skill only decides which framework and whether Fission's design
system applies to it. Once that's settled for a supported choice,
`fl-ds-setup` does the actual scaffold/install work — this skill hands off
rather than re-implementing those steps. For an existing project that
already has a framework decided (and just needs Fission's components
installed or updated), go straight to `fl-ds-setup` — this skill is for
the "nothing exists yet, what should it even be" moment only.
