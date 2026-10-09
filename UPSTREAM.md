# High-level skills — what we reuse instead of writing

The component skills in `plugins/fl-design-system/` are the first tier:
narrow, ours to own, scoped deliberately to Fission's own design system.
There's a second tier — broader, "how to write good React/Next.js" type
guidance — that this marketplace deliberately does **not** build, because
maintainers already publish it.

**Framework-specific upstream skills are gated, not installed by default.**
A project only uses one or two of React/Next/Angular/Vue — installing all
of them wastes the fixed per-turn description budget (see the proposal's
"one design constraint" section) on skills that will never fire for that
project, and risks the agent reaching for the wrong framework's idioms.
Before recommending or running any row in the table below, use
`frontend-common`'s `fe-upstream-setup` skill: it detects the project's
actual frontend framework(s) and requires the engineer's explicit
confirmation first.

This is the proposal's own three-question rule, applied:

1. **Does a maintainer already publish it?** → install theirs.
2. **Is it specific to Fission or to one client?** → ours to write (this is
   where the component skills live).
3. **Is it knowledge or an action?** → standing knowledge goes in
   `AGENTS.md`, not a skill. Vercel's own evals found passive `AGENTS.md`
   context scored 100% against 53% for the same knowledge packaged as a
   skill — skills earn their place only for actions an engineer triggers
   deliberately (an upgrade, a migration, a checklist run).

## Where each high-level area comes from

| Area | Source | Install | Maintainer |
| --- | --- | --- | --- |
| React and Next.js practices, composition patterns | `vercel-labs/agent-skills` | `npx skills add vercel-labs/agent-skills` | Vercel |
| Code-review–adjacent support | `vercel-labs/openreview` | `npx skills add vercel-labs/openreview` | Vercel |
| Accessibility, web interface rules (100+) | `web-design-guidelines` | verify current install path before pilot | Vercel |
| Framework upgrades & migrations | `next-upgrade`, `cra-to-next-migration` | verify current install path before pilot | Vercel |
| Library guidance matched to the version actually installed | TanStack Intent | see [tanstack.com/intent/latest](https://tanstack.com/intent/latest) | TanStack |
| Angular practices, code generation, new-app scaffolding | `angular/skills` (ships `angular-developer` + `angular-new-app`) | `npx skills add https://github.com/angular/skills` | Angular team (Google) — first-party, checked 2026-10-08 |
| Vue practices | — | **no first-party bundle found** (checked 2026-10-08); community options exist (`frontend-agent-skills`, formerly `vue-cursor-skills`; Nuxt-specific skills via the `onmax-nuxt-skills` marketplace) — read before installing, per "Trusting third-party skills" below. Don't default to one without that check. | — |
| Svelte/SvelteKit practices | — | **no first-party bundle found** (checked 2026-10-08); several community options exist (`spences10/skills`, `oimiragieo/agent-studio`'s `svelte-expert`, `ejirocodes/agent-skills`'s `svelte5-best-practices`) — same rule: read before installing, don't default to one. | — |

None of these are mirrored into this marketplace repo. An engineer installs
them directly from the publisher, on top of `fl-design-system`, only after
`fe-upstream-setup` has confirmed which row actually applies:

```bash
npx skills add vercel-labs/agent-skills
```

That package updates from Vercel on its own schedule — not from us, and not
through `claude plugin install`. The two install mechanisms (this
marketplace's `claude plugin` commands, and the publisher's own `npx skills
add`) coexist in the same project without conflicting.

## Trusting third-party skills

A skill can carry scripts — it's executable, not just text. The rule this
table follows: a **first-party** skill, published by the maintainer of the
thing itself (Vercel for Next.js, the Angular team for Angular, a library
for its own package), is fine to install directly. Anything **community**
(not the framework's own maintainer) gets read before it's added — don't
install one on the strength of a search result or a star count. The Vue
and Svelte rows above are community-only as of this check; that's why
`fe-upstream-setup` asks rather than picks one.

## What's still Fission's to write, deferred for now

The original proposal also scoped two more Fission-owned bundles —
`fl-standards` (code review checklist / definition of done) and
`fl-delivery` (project scaffolding / handover generation) — because nothing
upstream covers Fission's own review bar or delivery process. Those aren't
built in this round; the direction was to get the component-level design
system skills right first. See the repo's `README.md` for current scope.

## Before relying on this table

- Confirm the exact install command for `web-design-guidelines`,
  `next-upgrade`, and `cra-to-next-migration` — the proposal names them but
  this table hasn't independently verified each publish location.
- Decide whether to pin these to a commit/tag before the pilot (an unpinned
  upstream update becomes our incident the moment it ships) — if that
  governance layer gets built later, it belongs here, not re-invented.
- Angular now has a first-party bundle (`angular/skills`) wired into both
  this table and `fe-upstream-setup` — re-check it's still current before
  the pilot, same as the Vercel rows.
- Vue and Svelte still have no first-party bundle, only named community
  candidates — someone needs to actually read one of them (license,
  content, what it scripts) before it becomes a default recommendation
  rather than an "ask the engineer" prompt. Not done as part of this pass.
