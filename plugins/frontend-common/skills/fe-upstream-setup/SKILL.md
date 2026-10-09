---
name: fe-upstream-setup
description: Use before recommending or running any framework-specific upstream skill install (React/Next/Angular/Vue practices, e.g. vercel-labs/agent-skills). Detects the project's actual frontend framework(s) and requires engineer confirmation first, so a project never ends up with every framework's skills installed at once.
---

# Upstream frontend-skill setup

Framework-specific high-level skills (React/Next.js composition patterns,
accessibility rule sets, framework upgrade/migration skills) are not written
by Fission — see the repo's `UPSTREAM.md`. They're real, substantial skill
bundles meant for whichever framework a project actually runs, not every
framework at once. Installing a React bundle onto an Angular project (or
all of them "just in case") burns the fixed per-turn description budget
described in the platform proposal for skills that will never fire, and can
make the agent reach for React idioms on a project that isn't React.

## Step 1 — detect, don't assume

```bash
node ../../scripts/detect-frontend-framework.mjs
```

Reads the last line: one of `next`, `react`, `angular`, `vue`, `svelte` (or
a comma-separated combination, for a monorepo with more than one), or
`plain-js`, `greenfield`, `unknown`.

## Step 2 — confirm with the engineer before doing anything

Never run an upstream install command off the detector's result alone.
Show what was found and ask:

> "This looks like a `<detected>` project — install the matching upstream
> skill bundle (`<bundle name>`)? If this project actually mixes
> frameworks, or the detector got it wrong, tell me which to install."

Only proceed once the engineer confirms. If the detector found nothing
(`plain-js`) or couldn't tell (`unknown`), ask directly which framework(s)
are in play rather than guessing or installing nothing.

## Step 3 — install only the confirmed bundle(s)

See `UPSTREAM.md` at the repo root for the current table of what maps to
what. As of this writing (checked 2026-10-08):

| Detected | Install |
| --- | --- |
| `next` or `react` | `npx skills add vercel-labs/agent-skills` (React/Next composition patterns), optionally `vercel-labs/openreview` |
| `angular` | `npx skills add https://github.com/angular/skills` — first-party (Angular team, Google), ships `angular-developer` + `angular-new-app` |
| `vue` | No first-party bundle found — community options exist (`frontend-agent-skills`, Nuxt-specific skills) but need reading before install, per `UPSTREAM.md`'s "Trusting third-party skills" rule; ask the engineer which (if any) they want vetted rather than defaulting to one |
| `svelte` | Same as `vue` — no first-party bundle found; community options exist (`spences10/skills`, `agent-studio`'s `svelte-expert`, `svelte5-best-practices`) but need reading first, ask before installing |

Accessibility (`web-design-guidelines`) and framework upgrade/migration
skills (`next-upgrade`, `cra-to-next-migration`) are separate, narrower
bundles — install only the ones relevant to the actual task at hand, not
as a bundle with the framework pick.

## Scope boundary

This skill only gates **framework-specific** upstream installs. It has
nothing to do with Fission's own design-system skills (the
`fl-design-system` plugin, which is framework-agnostic by construction)
or this plugin's own `fe-debug`/`fe-explore`/`fe-knowledge-lookup`, which
apply regardless of framework and need no gating.
