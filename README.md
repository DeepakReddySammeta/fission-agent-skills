# Fission Labs — agent skills

Named deliberately without "Claude" in it. The skill content here (every
`SKILL.md`) is written to the open [Agent Skills](https://agentskills.io/home)
standard — `name` + `description` frontmatter only, no tool-specific fields
(checked by hand across all 10, see "What's confirmed vs. inferred" below).
That means the same folders load in Cursor and Codex (`.agents/skills/`) and
Copilot, not only Claude Code. The **only** Claude-specific piece is the
`.claude-plugin/marketplace.json` manifest and the two `claude plugin`
install commands — that mechanism is how Claude Code specifically discovers
and installs the bundle; an engineer on Cursor or Codex would instead just
copy or symlink the `skills/` folders into their tool's own skills
directory, no marketplace step needed. Calling the repo `claude-marketplace`
would have baked in a false assumption that the first thing happens to be
the only thing.

Scope for this round, per direction: get the **design-system skills right,
split one per component**, and document the high-level/upstream split. The
standards bundle, delivery bundle, CI tooling, onboarding CLI, versioning
docs, and the catalog site from an earlier pass are deferred, not part of
this build — see `UPSTREAM.md` for where the deferred Fission bundles stand.

This implements `Agentic_Skills_Platform_Proposal_for_Fission_Labs.docx`
(Sep 29, 2026) at the scope above — see that doc for the full business case
and risk register.

## What's here

```
.claude-plugin/marketplace.json     ← marketplace manifest (1 plugin, 10 skills)
plugins/fl-design-system/
  .claude-plugin/plugin.json
  CHANGELOG.md
  shared/
    scripts/
      detect-design-system.mjs      ← which design system a project already has
      install-fission-component.sh  ← registry install/update, any owned component
      sync-tokens.mjs                ← reads fission-tokens.md as a key/value map
    references/
      fission-tokens.md              ← canonical token values + a flagged discrepancy
      component-catalog.md           ← all 10 owned components, import paths
      adapters/{mui,chakra,antd,css-variables}.md
  skills/
    fl-ds-button/SKILL.md
    fl-ds-input/SKILL.md
    fl-ds-card/SKILL.md
    fl-ds-dialog/SKILL.md
    fl-ds-table/SKILL.md
    fl-ds-form/SKILL.md
    fl-ds-badge/SKILL.md
    fl-ds-select/SKILL.md
    fl-ds-tabs/SKILL.md
    fl-ds-toast/SKILL.md
UPSTREAM.md                         ← which high-level skills come from Vercel/TanStack instead
```

## Why one skill per component

Each component skill triggers on its own narrow description (building a
dialog pulls only `fl-ds-dialog`, not all ten), and each one is scoped to
exactly one decision: is this project Fission-native, or does it already run
MUI/Chakra/AntD/plain CSS — and if the latter, what does *this specific
component* look like on that system (a Dialog is `<Modal>` in Chakra, not
`<Dialog>` — that kind of per-component detail doesn't fit in one umbrella
skill without either bloating it or going generic).

All 10 descriptions are under 200 characters (checked by hand this round;
see the earlier pass's `VERSIONING.md` reasoning for why that number
matters if that governance layer gets rebuilt later).

## How a component skill works (same shape all 10 follow)

1. Run the shared detector once per project:
   ```bash
   node ../../shared/scripts/detect-design-system.mjs
   ```
   Result is one of: `fission-shadcn`, `shadcn-bare`, `mui`, `chakra`,
   `antd`, `css-only`, `greenfield`, `unknown`.
2. **Fission-native** (`fission-shadcn`/`shadcn-bare`/`greenfield`) → install
   or update that one component from the real Fission registry:
   ```bash
   ../../shared/scripts/install-fission-component.sh <component>
   ```
   This never falls back to the bare shadcn command for an owned component —
   that would silently install the unbranded default.
3. **Adapter path** (`mui`/`chakra`/`antd`/`css-only`) → open that
   component's section in the matching file under
   `shared/references/adapters/` and map Fission's token values into the
   project's existing theming layer. Never installs a second component
   library alongside an existing one.

Verified end to end this round:
- `detect-design-system.mjs` correctly classifies synthetic MUI, Fission-
  shadcn, and CSS-only test projects.
- `install-fission-component.sh` correctly refuses a non-owned name and
  points to the plain shadcn command instead.
- Both scripts resolve correctly via the `../../shared/...` relative path a
  real installed skill would use, tested from inside a skill folder.

## What's confirmed vs. inferred

- **Confirmed from the live demo**: Button and Badge share a non-stock
  variant set — `Default, Secondary, Outline, Error, Success, Warning` —
  different from stock shadcn's `default/destructive/outline/secondary/
  ghost/link`. Encoded directly in both skills.
- **Inferred, not read from source**: the exact lowercase prop strings
  (`error`, `success`, `warning`), and every other component's prop API
  beyond standard shadcn composition patterns. Each affected skill says so
  and asks to be corrected via PR once checked against the real registry
  source in `FissionHQ/ui-design-system`.
- **Still `TBD`**: every token value except `--primary` (`#f25011`) in
  `shared/references/fission-tokens.md`, and a flagged discrepancy between
  that component-library default (orange) and the separately-recorded
  brand-deck palette (green/blue) — needs design sign-off, not a silent pick.

## High-level skills

Not built here on purpose — see `UPSTREAM.md` for the full table of what
comes from Vercel/TanStack instead of being written by Fission, and where
the two deferred Fission-owned bundles (`fl-standards`, `fl-delivery`) stand.

## Install

**Claude Code** (via the marketplace manifest):

```bash
claude plugin marketplace add git@github.com:DeepakReddySammeta/fission-agent-skills.git
claude plugin install fl-design-system@fission --scope user
```

User scope (default) writes to `~/.claude/settings.json` — nothing enters a
client repository. (The onboarding CLI that asked installation questions
interactively was part of the deferred scope — plain `claude plugin install`
is the whole mechanism this round.)

**Cursor / Codex** (no marketplace mechanism in either tool — copy or
symlink instead):

```bash
mkdir -p .agents/skills
cp -r plugins/fl-design-system/skills/fl-ds-button .agents/skills/
cp -r plugins/fl-design-system/shared .agents/shared
```

Every component skill's relative path (`../../shared/...`) means "up two
levels, then into `shared/`" — in the original repo that's
`plugins/fl-design-system/shared/`; copied into `.agents/skills/`, the
matching location is `.agents/shared/` (two levels up from
`.agents/skills/fl-ds-button/`, same depth as before). Get this wrong and
the scripts/references simply won't resolve — worth a quick
`node .agents/skills/fl-ds-button/../../shared/scripts/detect-design-system.mjs`
smoke test after copying.
