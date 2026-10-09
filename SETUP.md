# Setup & testing runbook

Repo is pushed: <https://github.com/DeepakReddySammeta/fission-agent-skills>
(private). This is the exact sequence to get from there to "installed and
verified working," across both bundles. I can't run the `claude plugin`
steps myself — this session has no `claude` CLI pointed at your account —
so these are commands for you to run, with what each one should show you
if it worked.

## 0. Before you start

- Node 18+ locally (the scripts use `node:fs`/`node:child_process`, nothing
  exotic).
- The `claude` CLI, logged in, on a machine that is **not** this sandbox —
  see the registry-reachability note in step 3, this matters.

## 1. Register the marketplace, install the plugins

```bash
claude plugin marketplace add https://github.com/DeepakReddySammeta/fission-agent-skills.git
claude plugin install fl-design-system@fission --scope user
claude plugin install frontend-common@fission --scope user
```

**Check it worked**: `claude plugin list` (confirm this exact flag against
`code.claude.com/docs/en/plugins` for your installed CLI version — the
marketplace mechanism's command surface isn't something I can verify from
here) should list both plugins — `fl-design-system` (12 skills:
`fl-ds-new-project`, `fl-ds-setup`, plus 10 component skills),
`frontend-common` (4 skills).

If this errors on the `marketplace add` step with an auth failure, it's
almost always SSH keys — same as any private-repo clone, nothing special to
this mechanism.

**Restart your Claude Code session after installing** — a session already
running when you install a plugin will not pick it up. This is the first
thing to check if step 4 below seems to find nothing.

## 2. Test the detectors offline (no GitHub needed, re-runs what I already verified)

### 2a. Fission design-system detector

Three states only — this plugin deliberately doesn't try to detect any
other design system:

```bash
# greenfield: nothing scaffolded yet
mkdir -p /tmp/fl-test/greenfield-proj
node <path-to-repo>/plugins/fl-design-system/scripts/detect-fission-design-system.mjs /tmp/fl-test/greenfield-proj
# expect last line: greenfield

# needs-setup: a real project exists, Fission's components aren't installed yet
mkdir -p /tmp/fl-test/plain-proj/src
echo '{ "dependencies": { "react": "^18.0.0" } }' > /tmp/fl-test/plain-proj/package.json
node <path-to-repo>/plugins/fl-design-system/scripts/detect-fission-design-system.mjs /tmp/fl-test/plain-proj
# expect last line: needs-setup

# ready: shadcn + Tailwind + at least one Fission-owned component already present
mkdir -p /tmp/fl-test/ready-proj/components/ui
echo '{ "rsc": true }' > /tmp/fl-test/ready-proj/components.json
echo '{ "dependencies": { "tailwindcss": "^3.4.0" } }' > /tmp/fl-test/ready-proj/package.json
touch /tmp/fl-test/ready-proj/components/ui/button.tsx
node <path-to-repo>/plugins/fl-design-system/scripts/detect-fission-design-system.mjs /tmp/fl-test/ready-proj
# expect last line: ready
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
`destructive`/`ghost`/`link`). If the variant names come back different
from what `fl-ds-button`'s `SKILL.md` claims, that's the TBD flagged there
— fix that file (and `component-catalog.md`), not your component.

Also sanity-check the guard rail:

```bash
plugins/fl-design-system/scripts/install-fission-component.sh accordion
# expect: refuses, tells you to run `npx shadcn add accordion` instead —
# accordion isn't one of the 10 Fission-owned components
```

## 4. Test the full setup-to-prompt flow in a real session — the step that validates the whole premise

This is the step most likely to surface the "installed but doesn't
auto-fire" gap raised before this round, and the one that actually proves
the goal this round is built around: set up Fission's design system, then
a plain prompt uses it correctly.

1. Open a completely empty folder (no `package.json` at all), with both
   plugins installed (step 1), **in a fresh session** (see the restart
   note above). Ask for a brand-new project without naming a framework —
   "set up a new project" or similar. Confirm `fl-ds-new-project` fires,
   shows the framework support table, and actually waits for an answer
   rather than defaulting to Next.js unprompted.
2. Answer "Next.js" and confirm it hands off to `fl-ds-setup`'s Step 2 (the
   real scaffold command runs, not a re-explanation of the same table).
   Separately, try answering "Vue" in a different empty folder and confirm
   it refuses clearly (no Fission install attempted) rather than silently
   proceeding or silently doing nothing.
3. Open a project that does **not** yet have Fission's design system
   installed, with both plugins installed, **in a fresh session**.
4. Ask for a component directly — "add a button" — without mentioning
   setup at all. Confirm the skill that fires (`fl-ds-button`) runs the
   detector, sees `needs-setup`, installs the component itself, and then
   uses it — not a plain unbranded `<button>`, and not a stop-and-ask for
   something this low-risk.
5. Ask for a second, different component in the same project. Confirm the
   detector now reports `ready` (since at least one Fission component is
   already installed) and the skill goes straight to using it, no install
   step repeated.
6. Repeat on a project that already has Fission's design system fully set
   up — confirm `ready` is reported immediately and no install happens.
7. Repeat once for `fe-debug` or `fe-explore` — ask a framework-agnostic
   question ("why is this component re-rendering") and confirm one of
   `frontend-common`'s skills fires without typing `/`.
8. **If nothing fires unprompted but an explicit `/plugin:skill` invocation
   works**, that confirms the skill content is fine and isolates the gap
   to automatic description-matching specifically — report that distinction
   rather than "skills don't work," since the fix differs (a session/cache
   issue vs. a description-wording issue).
9. **If an explicit invocation also does nothing**, check `claude plugin
   list` again — the plugin may have installed in a disabled state, or the
   session genuinely predates the install (see step 1's restart note).

This is the one step with no fixture I can hand you — it depends on your
actual CLI version's UI for showing which skill fired, which I can't see
from here. Record what you find (fires / doesn't fire / fires only on
explicit invocation) per tool.

## 5. Cross-tool portability check

I checked this repo's frontmatter and confirmed every `SKILL.md` uses only
`name` and `description` — no Claude-specific fields — so nothing here
should block loading elsewhere. To actually confirm:

```bash
# Cursor and Codex both read .agents/skills/ natively
mkdir -p .agents/skills
cp -r plugins/fl-design-system/skills/fl-ds-button .agents/skills/
mkdir -p .agents/fl-design-system
cp -r plugins/fl-design-system/scripts .agents/fl-design-system/scripts
```

Open the same project in Cursor or Codex and try the same "add a button"
prompt. This only proves portability for one skill — treat it as a smoke
test, not full coverage. Repeat for `frontend-common`'s `fe-debug` if you
want a non-design-system data point too.

## Exit criteria for this round

- [ ] `claude plugin marketplace add` resolves the repo
- [ ] Both plugins install; 12 (`fl-design-system`) + 4 (`frontend-common`)
      skills are visible
- [ ] Each detector fixture above (Fission design-system + frontend-
      framework) returns the expected result
- [ ] `fl-ds-new-project` fires on an empty folder with no framework named,
      shows the support table, and waits for an answer rather than
      defaulting to Next.js
- [ ] A "Vue" answer to `fl-ds-new-project` is refused clearly, with no
      Fission install attempted
- [ ] A real `npx shadcn add .../button.json` pull succeeds from a real
      machine, and the variant names match (or `fl-ds-button`'s `SKILL.md`
      gets corrected to match what actually ships)
- [ ] On a project with no Fission design system yet, a plain "add a
      button" prompt in a fresh session results in the design system being
      installed and the component used correctly — **without** typing `/`
      first, and without a separate manual setup step
- [ ] A second component request on the same (now-`ready`) project doesn't
      repeat the install
- [ ] At least one `frontend-common` skill (`fe-debug`/`fe-explore`/
      `fe-knowledge-lookup`) observed firing the same way
- [ ] `fe-upstream-setup` observed asking for confirmation before any
      framework-specific upstream install, on both a React/Next project and
      a non-React project
- [ ] The auto-fire audit outcome from step 4 recorded (fires / doesn't /
      only on explicit invocation), per tool tested
- [ ] One cross-tool smoke test, if you want that proposal claim verified
      now rather than later
