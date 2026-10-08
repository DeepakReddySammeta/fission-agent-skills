# High-level skills — what we reuse instead of writing

The component skills in `plugins/fl-design-system/` are the first tier:
narrow, Fission-specific, ours to own. There's a second tier — broader,
"how to write good React/Next.js" type guidance — that this marketplace
deliberately does **not** build, because maintainers already publish it.

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

None of these are mirrored into this marketplace repo. An engineer installs
them directly from the publisher, on top of `fl-design-system`:

```bash
npx skills add vercel-labs/agent-skills
```

That package updates from Vercel on its own schedule — not from us, and not
through `claude plugin install`. The two install mechanisms (this
marketplace's `claude plugin` commands, and the publisher's own `npx skills
add`) coexist in the same project without conflicting.

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
