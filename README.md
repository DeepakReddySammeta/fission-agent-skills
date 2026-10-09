# Fission Labs — agent skills

Named deliberately without "Claude" in it. Every `SKILL.md` in this repo is
written to the open [Agent Skills](https://agentskills.io/home) standard —
`name` + `description` frontmatter only, no tool-specific fields. That means
the same folders load in **Claude Code**, **Cursor**, **Codex**, and
**GitHub Copilot / VS Code**. The only Claude-specific piece in this repo is
`.claude-plugin/marketplace.json` and the two `claude plugin` commands —
that's how Claude Code specifically discovers and installs these bundles.
Every other tool reads the plain `skills/` folders directly, no marketplace
step involved (see "Install" below, one section per tool).

This implements `Agentic_Skills_Platform_Proposal_for_Fission_Labs.docx`
(Sep 29, 2026) — see that doc for the full business case and risk register.

## What's here — two bundles

```text
.claude-plugin/marketplace.json        ← Claude Code marketplace manifest (2 plugins)

plugins/fl-design-system/              ← Fission's own design system, end to end
  .claude-plugin/plugin.json
  CHANGELOG.md
  references/
    fission-tokens.md                  ← Fission's token hex values, source of truth
    component-catalog.md               ← Fission's registry URLs, one row per owned component
  scripts/
    detect-fission-design-system.mjs   ← is Fission's design system installed in this project? ready / needs-setup / greenfield
    install-fission-component.sh       ← registry install/update, guards against non-owned names
    sync-tokens.mjs                    ← reads fission-tokens.md as a key/value map
  skills/
    fl-ds-setup/                       ← scaffold a new project on Fission's design system, or install/update it into an existing one
    fl-ds-button/  fl-ds-input/  fl-ds-card/  fl-ds-dialog/  fl-ds-table/
    fl-ds-form/    fl-ds-badge/  fl-ds-select/ fl-ds-tabs/    fl-ds-toast/   ← each checks the detector first, installs on the spot if needed

plugins/frontend-common/               ← framework-independent, unrelated to design systems
  .claude-plugin/plugin.json
  CHANGELOG.md
  scripts/detect-frontend-framework.mjs ← detects next/react/angular/vue/svelte/plain-js, for gating upstream installs — never auto-installs anything itself
  skills/
    fe-debug/               ← framework-agnostic debugging procedure
    fe-explore/             ← framework-agnostic "where does X live" procedure
    fe-knowledge-lookup/    ← framework-agnostic "how/why does this code work" procedure
    fe-upstream-setup/      ← confirms with the engineer before recommending any React/Next/Angular/Vue upstream skill bundle

UPSTREAM.md                            ← which high-level framework skills come from Vercel/TanStack instead of being written here
SETUP.md                               ← full install-and-verify testing runbook
```

## Why this is scoped to Fission's own design system only

An earlier round of this marketplace shipped a second, generic plugin: one
set of component skills that detected *any* project's design system (a
registered brand's shadcn registry, bare shadcn, MUI, Chakra, AntD, or
plain CSS) and adapted to it, with Fission's own system as just one
registered entry among others.

That shipped, got installed on a real client project running its own
custom (non-shadcn) design system, and broke: the detector's fallback logic
silently misclassified an unrecognized component library as "no component
library, use plain CSS" — which actively told the agent to bypass the
client's real components on part of the work, while other parts (handled
by reading existing code directly) came out fine. Generic, heuristic
detection across arbitrary, never-seen design systems wasn't reliable
enough to trust.

Direction now: drop the generic layer, and make **one thing** work
reliably end to end — scaffolding or installing Fission's own design
system in a project, and then every component skill (`fl-ds-button`,
`fl-ds-dialog`, …) working correctly the moment an engineer asks for that
component, with no ambiguity about which system is in play. Each skill
checks `detect-fission-design-system.mjs` first; if Fission's system isn't
installed yet, it installs the one component needed and continues, rather
than falling back to an unbranded element or guessing at a different
system. Supporting other clients' own design systems again, if it comes
back, is a separate, later effort — not something this bundle's component
skills try to also handle today.

`frontend-common` is unrelated to any of this — debugging, codebase
exploration, and knowledge lookup apply to any frontend work regardless of
which UI library is in play, which is why it's a separate plugin rather
than folded into the design-system one. It also owns the one piece of
process this repo enforces: before recommending or installing any
framework-specific upstream skill (React/Next/Angular/Vue practices from
Vercel/TanStack/etc. — see `UPSTREAM.md`), its `fe-upstream-setup` skill
detects the project's actual framework(s) and requires the engineer's
explicit confirmation first.

Framework-level skills (how to write good React, Next.js composition
patterns, Angular/Vue equivalents) are not written in this repo at all —
see `UPSTREAM.md` for why, and for what's installed from upstream instead.

## Install

### Claude Code

Two commands, run once per machine, via the marketplace manifest:

```bash
claude plugin marketplace add https://github.com/DeepakReddySammeta/fission-agent-skills.git
claude plugin install fl-design-system@fission-marketplace --scope user
claude plugin install frontend-common@fission-marketplace --scope user   # optional, unrelated to design systems
```

- **What each line does**: the first registers this repo as a plugin
  source (once per machine, not once per project). Each `install` line
  pulls one bundle's skills into `~/.claude/` at **user scope** — this
  means the skills become available in *every* project you open on this
  machine, and nothing is written into any project's own repository.
- **Where to run it**: anywhere — this isn't tied to being inside a
  project directory. A fresh terminal, before opening any client project,
  is the normal time to do this once.
- **Check it worked**: `claude plugin list` should show both plugins you
  installed, each with its skills listed underneath (`fl-design-system`:
  11 skills; `frontend-common`: 4 skills).
- **Important**: a Claude Code session already running when you install a
  plugin will not pick it up — start a new `claude` session (or restart
  the current one) before expecting a skill to fire. This is the single
  most common reason an installed skill seems to "not exist yet."
- If `marketplace add` fails with an auth error, it's almost always SSH
  keys against the private repo — same as any `git clone` over SSH,
  nothing special to this mechanism.

### Cursor / Codex

Neither tool has a marketplace mechanism (as of this writing) — copy or
symlink the plain `skills/` folders into the tool's own skills directory
instead. Both Cursor and Codex read `.agents/skills/` natively, so the same
copy works for either:

```bash
# from inside the project where you want these skills available
mkdir -p .agents/skills

# fl-design-system
cp -r <path-to-this-repo>/plugins/fl-design-system/skills/. .agents/skills/
mkdir -p .agents/fl-design-system
cp -r <path-to-this-repo>/plugins/fl-design-system/references .agents/fl-design-system/references
cp -r <path-to-this-repo>/plugins/fl-design-system/scripts .agents/fl-design-system/scripts

# frontend-common (optional, unrelated to design systems)
cp -r <path-to-this-repo>/plugins/frontend-common/skills/. .agents/skills/
mkdir -p .agents/frontend-common
cp -r <path-to-this-repo>/plugins/frontend-common/scripts .agents/frontend-common/scripts
```

- **What this does**: every skill in this repo sits two levels below its
  plugin's root (`plugins/<plugin-name>/skills/<skill-name>/SKILL.md`) and
  references its scripts/references two levels up (`../../scripts/...`,
  `../../references/...`). The copy recipe above preserves that exact
  depth: `.agents/skills/<skill-name>/` is also two levels below
  `.agents/`, so copying each plugin's `references/`/`scripts/` straight to
  `.agents/fl-design-system/` and `.agents/frontend-common/` (not nested
  any deeper) keeps every `../../...` reference resolving correctly with
  no edits to any `SKILL.md` needed.
- **Where to run it**: inside the specific project's own working copy —
  this is a per-project copy, not a per-machine install like Claude Code's
  plugin mechanism. Repeat it for each project that needs these skills, or
  script it once and re-run per clone.
- **Check it worked**: run a smoke test on the detector before trusting
  anything else —
  ```bash
  node .agents/skills/fl-ds-button/../../fl-design-system/scripts/detect-fission-design-system.mjs
  ```
  If this errors on a path, the copy didn't preserve the relative depth —
  re-check the folder structure above.
- **Verify the skill actually fires**: open the project in Cursor or Codex
  and ask for something that should trigger exactly one skill (e.g. "add a
  delete confirmation dialog" → `fl-ds-dialog`). If nothing fires, see
  "If a skill doesn't auto-fire" below before assuming the copy is wrong.

### GitHub Copilot / VS Code

Copilot reads agent skills from the same kind of directory, plus
`AGENTS.md`/`CLAUDE.md` for passive rules (not skills). Follow the same
copy steps as Cursor/Codex above. Check your Copilot/VS Code version's
current skills-directory location against
[Custom instructions support — GitHub Copilot](https://docs.github.com/)
before copying, since this is the newest-supported integration of the
three and most likely to have moved since this was written.

### Plain chat products (ChatGPT web, claude.ai web chat, etc.)

Out of scope. These don't read repository files at all — only their
*coding agent* counterparts (Codex, Claude Code) do. Don't expect a skill
to do anything pasted into a plain chat window.

## How skills get used, once installed

Two ways, same as any Agent Skill:

1. **Automatic** — the agent loads a skill on its own when the work
   matches its `description`. Writing a dialog pulls `fl-ds-dialog` without
   anyone typing a command.
2. **Explicit** — invoke one directly, e.g. `/fl-design-system:fl-ds-button`
   in Claude Code (exact invocation syntax depends on the tool).

### If a skill doesn't auto-fire

This has been observed (or is suspected) as a real gap — don't assume
installation alone means a skill is live. Check, in order:

1. **Restart the session.** Claude Code only picks up a plugin installed
   via `claude plugin install` on a fresh session — see the Claude Code
   install section above.
2. **Confirm it's enabled, not just installed.** Run `claude plugin list`
   (Claude Code) or check whichever panel your tool uses to list active
   skills (`/skills` in Claude Code) — an install can land in a disabled
   state depending on tool/version.
3. **Check the description is actually being read.** Open the `SKILL.md`
   and confirm the frontmatter parses (`name` + `description`, nothing
   malformed) — a YAML error in frontmatter can make a skill silently
   invisible rather than erroring loudly.
4. **Try an explicit invocation first.** If
   `/fl-design-system:fl-ds-button` works but the same prompt without `/`
   doesn't trigger it, the skill content is fine and the gap is
   specifically in automatic description-matching — narrow the ask
   (mention the component by name, e.g. "add a Dialog" rather than "add a
   popup thing") and see if that's enough; if it still doesn't fire
   unprompted, that's the bug to report, not a doc gap.
5. **Check for a context budget problem.** If many plugins/skills are
   installed at once, descriptions can get crowded out of what the model
   sees every turn (see the proposal's "one design constraint" section) —
   fewer simultaneously installed bundles is the fix, not more detail per
   description.

See `SETUP.md` for the full step-by-step verification runbook, including
offline fixtures for the detector scripts.

## Scope note

The original proposal also scoped `fl-standards` (code review checklist)
and `fl-delivery` (project scaffolding/handover) as two more Fission-owned
bundles. Not built in this round — see `UPSTREAM.md`.
