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
    fl-ds-new-project/                 ← starting from scratch: scaffolds any framework/styling combo, asks about Fission only when it actually applies
    fl-ds-setup/                       ← scaffold a new Next.js project on Fission's design system, or install/update it into an existing one
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

## Skills at a glance

All 16, one line each — what fires it, and what it actually does. See
each skill's own `SKILL.md` for the full detail; this is the index.

| Skill | Fires when | What it does |
| --- | --- | --- |
| `fl-ds-new-project` | Starting a brand-new project, framework not yet decided | Asks the framework, then a styling menu scoped to that framework — Fission's design system is one directly selectable option on Next.js/React only |
| `fl-ds-setup` | Framework already settled (Next.js, or an existing project) | Scaffolds Fission's real Next.js starter, or installs/updates its components into an existing project |
| `fl-ds-button` | Adding/editing a button | Installs Fission's Button if not already present, then uses it |
| `fl-ds-input` | Adding/editing a text input | Same pattern, for Input |
| `fl-ds-card` | Adding/editing a content panel | Same pattern, for Card |
| `fl-ds-dialog` | Adding/editing a modal/confirmation dialog | Same pattern, for Dialog |
| `fl-ds-table` | Adding/editing a data table | Same pattern, for Table |
| `fl-ds-form` | Adding/editing a form with validation | Same pattern, for Form (react-hook-form + a resolver) |
| `fl-ds-badge` | Adding/editing a status tag/chip | Same pattern, for Badge |
| `fl-ds-select` | Adding/editing a dropdown | Same pattern, for Select |
| `fl-ds-tabs` | Adding/editing tabbed navigation | Same pattern, for Tabs |
| `fl-ds-toast` | Adding/editing a transient notification | Same pattern, for Toast |
| `fe-debug` | Debugging a frontend bug, any stack | Framework-agnostic root-cause procedure (reproduce, isolate, fix the root, leave a check) |
| `fe-explore` | Finding where something lives in a frontend codebase | Framework-agnostic search procedure (entry points, grep by behavior, confirm scope) |
| `fe-knowledge-lookup` | "How/why does this code work" | Reads the real installed code and version, not assumed library behavior |
| `fe-upstream-setup` | Before installing any React/Next/Angular/Vue upstream skill bundle | Detects the project's actual framework, asks for confirmation, only then names the one matching bundle |

Every `fl-ds-*` component skill (`fl-ds-button` through `fl-ds-toast`)
follows the identical three-branch pattern: `ready` → use it directly;
`needs-setup` → install just that one component, then use it; `greenfield`
→ stop and ask rather than guess. That's why there's one skill per
component instead of one umbrella skill — see `fl-ds-button`'s own
`SKILL.md` for the full version of this pattern, not repeated per file here.

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

One distinction worth being precise about: `fl-ds-new-project` *does*
scaffold projects on other frameworks and styling systems (Vue, Angular,
MUI, Bootstrap, …) when asked — that's not the same risk as before. The
thing that broke was *silently guessing* which system an **existing**,
unfamiliar project already used. Scaffolding a **brand-new** project in
whatever the engineer *explicitly names* involves no guessing at all —
Fission's design system is only ever offered as an explicit extra step on
top, never assumed, and the `fl-ds-*` component skills still only ever
know how to use Fission's own components.

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
claude plugin install fl-design-system@fission --scope user
claude plugin install frontend-common@fission --scope user   # optional, unrelated to design systems
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
  12 skills; `frontend-common`: 4 skills).
- **Important**: a Claude Code session already running when you install a
  plugin will not pick it up — start a new `claude` session (or restart
  the current one) before expecting a skill to fire. This is the single
  most common reason an installed skill seems to "not exist yet."
- If `marketplace add` fails with an auth error, it's almost always SSH
  keys against the private repo — same as any `git clone` over SSH,
  nothing special to this mechanism.
- **Already added this marketplace under the old name?** The marketplace's
  `name` changed from `fission-marketplace` to `fission` — a rename isn't
  picked up by `marketplace update`, since you register one marketplace per
  `name`. Remove the old registration first (this also uninstalls the
  plugins you got from it), then re-add and reinstall:
  ```bash
  claude plugin marketplace remove fission-marketplace
  claude plugin marketplace add https://github.com/DeepakReddySammeta/fission-agent-skills.git
  claude plugin install fl-design-system@fission --scope user
  claude plugin install frontend-common@fission --scope user
  ```

#### Update (Claude Code)

Two separate things, both needed — `marketplace update` refreshes what
the marketplace *offers*, `plugin update` actually pulls your *installed*
plugin up to that version:

```bash
claude plugin marketplace update fission
claude plugin update fl-design-system@fission
claude plugin update frontend-common@fission
```

- **What each line does**: the first fetches the latest commits from this
  repo and re-reads `marketplace.json` — without it, the second line has
  nothing new to pull even if this repo has moved on. The second and third
  lines then update each installed plugin to whatever version the
  refreshed marketplace now lists.
- **Check it worked**: `claude plugin list` should show the version number
  you expect (check `plugins/fl-design-system/.claude-plugin/plugin.json`
  and `plugins/frontend-common/.claude-plugin/plugin.json` in this repo
  for the current numbers, or the top of each plugin's `CHANGELOG.md`).
  If it still shows an old version, the `marketplace update` step didn't
  actually fetch — check for a network/auth error before re-running
  `plugin update`.
- Restart your Claude Code session afterward — same reason as a fresh
  install, an already-running session won't see the update.

#### Uninstall (Claude Code)

Remove just the plugins, keep the marketplace registered (so you can
reinstall later without re-adding it):

```bash
claude plugin uninstall fl-design-system@fission --scope user
claude plugin uninstall frontend-common@fission --scope user
```

To remove the marketplace registration entirely — this also uninstalls
every plugin you got from it, equivalent to the two lines above plus more:

```bash
claude plugin marketplace remove fission
```

- **Check it worked**: `claude plugin list` should no longer show either
  plugin (uninstall), or `claude plugin marketplace list` should no
  longer show `fission` (marketplace remove).

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

#### Update (Cursor / Codex)

There's no update command — pull the latest repo and re-run the exact
same copy commands from above. `cp -r` overwrites existing files, so this
is safe to re-run as often as you like:

```bash
cd <path-to-this-repo> && git pull
# then re-run every cp -r / mkdir -p line from the Install step above,
# from the project that has these skills copied into it
```

- **Check it worked**: open any `fl-ds-*` skill's `SKILL.md` under
  `.agents/skills/` in the project and confirm its content matches what's
  currently in this repo (e.g. check the version noted in
  `plugins/fl-design-system/CHANGELOG.md`'s latest entry against what you
  see). There's no version number stamped in the copied files themselves,
  since this mechanism doesn't track versions the way Claude Code's
  plugin system does.

#### Uninstall (Cursor / Codex)

Delete exactly the folders the install step created — **don't** delete
the whole `.agents/skills/` directory if you keep other, unrelated skills
there too:

```bash
rm -rf .agents/skills/fl-ds-new-project .agents/skills/fl-ds-setup \
       .agents/skills/fl-ds-button .agents/skills/fl-ds-input \
       .agents/skills/fl-ds-card .agents/skills/fl-ds-dialog \
       .agents/skills/fl-ds-table .agents/skills/fl-ds-form \
       .agents/skills/fl-ds-badge .agents/skills/fl-ds-select \
       .agents/skills/fl-ds-tabs .agents/skills/fl-ds-toast \
       .agents/fl-design-system

# if frontend-common was also copied in:
rm -rf .agents/skills/fe-debug .agents/skills/fe-explore \
       .agents/skills/fe-knowledge-lookup .agents/skills/fe-upstream-setup \
       .agents/frontend-common
```

### GitHub Copilot / VS Code

Copilot reads agent skills from the same kind of directory, plus
`AGENTS.md`/`CLAUDE.md` for passive rules (not skills). Follow the same
copy, update, and uninstall steps as Cursor/Codex above. Check your
Copilot/VS Code version's current skills-directory location against
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
