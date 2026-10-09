# Setup & testing runbook

Repo is pushed: <https://github.com/DeepakReddySammeta/fission-agent-skills>
(private). This is the exact sequence to get from there to "installed and
verified working," across all three bundles. I can't run the `claude
plugin` steps myself — this session has no `claude` CLI pointed at your
account — so these are commands for you to run, with what each one should
show you if it worked.

## 0. Before you start

- Node 18+ locally (the scripts use `node:fs`/`node:child_process`, nothing
  exotic).
- The `claude` CLI, logged in, on a machine that is **not** this sandbox —
  see the registry-reachability note in step 3, this matters.

## 1. Register the marketplace, install the plugins

```bash
claude plugin marketplace add https://github.com/DeepakReddySammeta/fission-agent-skills.git
claude plugin install design-system@fission-marketplace --scope user
claude plugin install fl-design-system@fission-marketplace --scope user
claude plugin install frontend-common@fission-marketplace --scope user
```

**Check it worked**: `claude plugin list` (confirm this exact flag against
`code.claude.com/docs/en/plugins` for your installed CLI version — the
marketplace mechanism's command surface isn't something I can verify from
here) should list all three plugins — `design-system` (10 skills),
`fl-design-system` (1 skill), `frontend-common` (4 skills).

If this errors on the `marketplace add` step with an auth failure, it's
almost always SSH keys — same as any private-repo clone, nothing special to
this mechanism.

**Restart your Claude Code session after installing** — a session already
running when you install a plugin will not pick it up. This is the first
thing to check if step 4 below seems to find nothing.

## 2. Test the detectors offline (no GitHub needed, re-runs what I already verified)

### 2a. Design-system detector

```bash
mkdir -p /tmp/fl-test/mui-proj && cd /tmp/fl-test/mui-proj
echo '{ "dependencies": { "@mui/material": "^5.15.0" } }' > package.json
mkdir src
node <path-to-repo>/plugins/design-system/shared/scripts/detect-design-system.mjs .
# expect last line: mui

cd /tmp/fl-test && mkdir -p fission-proj/components/ui && cd fission-proj
touch components/ui/button.tsx
echo '{ "rsc": true }' > components.json
echo '{ "dependencies": { "tailwindcss": "^3.4.0" } }' > package.json
node <path-to-repo>/plugins/design-system/shared/scripts/detect-design-system.mjs .
# expect last line: shadcn:fission

cd /tmp/fl-test && mkdir -p css-proj/src && cd css-proj
echo '{ "dependencies": { "react": "^18.0.0" } }' > package.json
node <path-to-repo>/plugins/design-system/shared/scripts/detect-design-system.mjs .
# expect last line: css-only
```

### 2b. Frontend-framework detector

```bash
cd /tmp/fl-test && mkdir -p next-proj/app && cd next-proj
echo '{ "dependencies": { "next": "^14.0.0", "react": "^18.0.0" } }' > package.json
node <path-to-repo>/plugins/frontend-common/scripts/detect-frontend-framework.mjs .
# expect last line: next

cd /tmp/fl-test && mkdir -p angular-proj/src && cd angular-proj
echo '{ "dependencies": { "@angular/core": "^17.0.0" } }' > package.json
node <path-to-repo>/plugins/frontend-common/scripts/detect-frontend-framework.mjs .
# expect last line: angular
```

If any of these don't match, the bug is in the detector script, not in
Claude Code's plugin mechanism — isolate it here before suspecting the
install.

## 3. Test a real registry pull — do this from your own machine, not a sandboxed CI runner

I tried to hit the live registry from this session to verify it end-to-end
and got blocked:

```text
gateway answered 403 to CONNECT — host: fissionhq.github.io
```

That's this sandbox's own outbound allowlist (it only permits npm/GitHub's
core domains, not arbitrary GitHub Pages hosts), not a problem with
Fission's registry. Run this from a normal machine:

```bash
npx shadcn add https://FissionHQ.github.io/ui-design-system/r/button.json
```

**Check it worked**: a branded `button.tsx` lands in `components/ui/`, and
it defines the `error`/`success`/`warning` variants (not stock shadcn's
`destructive`/`ghost`/`link`). If the variant names come back different from
what `design-system`'s `adapters/registries/fission.md` claims, that's the
TBD flagged there — fix that file (and `fl-design-system`'s matching
`component-catalog.md` entry), not your component.

Also sanity-check the guard rail:

```bash
plugins/fl-design-system/scripts/install-fission-component.sh accordion
# expect: refuses, tells you to run `npx shadcn add accordion` instead —
# accordion isn't one of the 10 Fission-owned components
```

## 4. Test that a skill actually fires in a real session — the step that validates the whole premise

This is the step most likely to surface the "installed but doesn't
auto-fire" gap raised before this round. Treat it as a real audit, not a
formality:

1. Open a real project with all three plugins installed (step 1), **in a
   fresh session** (see the restart note above).
2. Ask for something that should trigger exactly one skill — "add a delete
   confirmation dialog to this page" should pull `ds-dialog`, not all ten,
   and not zero.
3. Confirm (via whatever this Claude Code version surfaces for active
   skills — `/skills` or similar) that only the relevant skill loaded, and
   that it ran the detector before suggesting any code.
4. Repeat once in a project that already uses MUI or Chakra — the output
   should go through that component's adapter section, not suggest
   installing shadcn.
5. Repeat once for `fe-debug` or `fe-explore` — ask a framework-agnostic
   question ("why is this component re-rendering") and confirm one of
   `frontend-common`'s skills fires without typing `/`.
6. **If nothing fires unprompted but an explicit `/plugin:skill` invocation
   works**, that confirms the skill content is fine and isolates the gap
   to automatic description-matching specifically — report that distinction
   rather than "skills don't work," since the fix differs (a session/cache
   issue vs. a description-wording issue).
7. **If an explicit invocation also does nothing**, check `claude plugin
   list` again — the plugin may have installed in a disabled state, or the
   session genuinely predates the install (see step 1's restart note).

This is the one step with no fixture I can hand you — it depends on your
actual CLI version's UI for showing which skill fired, which I can't see
from here. Record what you find (fires / doesn't fire / fires only on
explicit invocation) per tool — this is the audit outcome for the
auto-fire question raised this round, not an assumption to carry forward
unverified.

## 5. Cross-tool portability check

I checked this repo's frontmatter and confirmed every `SKILL.md` uses only
`name` and `description` — no Claude-specific fields — so nothing here
should block loading elsewhere. To actually confirm:

```bash
# Cursor and Codex both read .agents/skills/ natively
mkdir -p .agents/skills
cp -r plugins/design-system/skills/ds-button .agents/skills/
cp -r plugins/design-system/shared .agents/shared
```

Open the same project in Cursor or Codex and try the same "add a button"
prompt. This only proves portability for one skill — treat it as a smoke
test, not full coverage. Repeat for `frontend-common`'s `fe-debug` if you
want a non-design-system data point too.

## Exit criteria for this round

- [ ] `claude plugin marketplace add` resolves the repo
- [ ] All three plugins install; 10 + 1 + 4 skills are visible
- [ ] Each detector fixture above (design-system + frontend-framework)
      returns the expected result
- [ ] A real `npx shadcn add .../button.json` pull succeeds from a real
      machine, and the variant names match (or the registry adapter docs
      get corrected to match what actually ships)
- [ ] At least one `design-system` skill observed firing correctly inside a
      real session, on both a Fission-native and a non-Fission (MUI/Chakra/
      etc.) project, **without** typing `/` first
- [ ] At least one `frontend-common` skill (`fe-debug`/`fe-explore`/
      `fe-knowledge-lookup`) observed firing the same way
- [ ] `fe-upstream-setup` observed asking for confirmation before any
      framework-specific upstream install, on both a React/Next project and
      a non-React project
- [ ] The auto-fire audit outcome from step 4 recorded (fires / doesn't /
      only on explicit invocation), per tool tested
- [ ] One cross-tool smoke test, if you want that proposal claim verified
      now rather than later
