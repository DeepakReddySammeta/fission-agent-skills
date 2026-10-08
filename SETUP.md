# Setup & testing runbook

Repo is pushed: <https://github.com/DeepakReddySammeta/fission-agent-skills>
(private). This is the exact sequence to get from there to "installed and
verified working." I can't run the `claude plugin` steps myself — this
session has no `claude` CLI pointed at your account — so these are commands
for you to run, with what each one should show you if it worked.

## 0. Before you start

- Node 18+ locally (the scripts use `node:fs`/`node:child_process`, nothing
  exotic).
- The `claude` CLI, logged in, on a machine that is **not** this sandbox —
  see the registry-reachability note in step 3, this matters.

## 1. Register the marketplace, install the plugin

```bash
claude plugin marketplace add git@github.com:DeepakReddySammeta/fission-agent-skills.git
claude plugin install fl-design-system@fission --scope user
```

**Check it worked**: `claude plugin list` (confirm this exact flag against
`code.claude.com/docs/en/plugins` for your installed CLI version — the
marketplace mechanism's command surface isn't something I can verify from
here) should list `fl-design-system` with all 10 skills under it.

If this errors on the `marketplace add` step with an auth failure, it's
almost always SSH keys — same as any private-repo clone, nothing special to
this mechanism.

## 2. Test the detector offline (no GitHub needed, re-runs what I already verified)

These three fixtures reproduce exactly what I tested while building this —
re-run them yourself so you're not taking my word for it:

```bash
mkdir -p /tmp/fl-test/mui-proj && cd /tmp/fl-test/mui-proj
echo '{ "dependencies": { "@mui/material": "^5.15.0" } }' > package.json
mkdir src
node <path-to-repo>/plugins/fl-design-system/shared/scripts/detect-design-system.mjs .
# expect last line: mui

cd /tmp/fl-test && mkdir -p fission-proj/components/ui && cd fission-proj
touch components/ui/button.tsx
echo '{ "rsc": true }' > components.json
echo '{ "dependencies": { "tailwindcss": "^3.4.0" } }' > package.json
node <path-to-repo>/plugins/fl-design-system/shared/scripts/detect-design-system.mjs .
# expect last line: fission-shadcn

cd /tmp/fl-test && mkdir -p css-proj/src && cd css-proj
echo '{ "dependencies": { "react": "^18.0.0" } }' > package.json
node <path-to-repo>/plugins/fl-design-system/shared/scripts/detect-design-system.mjs .
# expect last line: css-only
```

If any of these don't match, the bug is in `detect-design-system.mjs`, not
in Claude Code's plugin mechanism — isolate it here before suspecting the
install.

## 3. Test a real registry pull — do this from your own machine, not a sandboxed CI runner

I tried to hit the live registry from this session to verify it end-to-end
and got blocked:

```
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
what `fl-ds-button`'s `SKILL.md` claims, that's the TBD I flagged — fix the
skill file, not your component.

Also sanity-check the guard rail:

```bash
plugins/fl-design-system/shared/scripts/install-fission-component.sh accordion
# expect: refuses, tells you to run `npx shadcn add accordion` instead —
# accordion isn't one of the 10 Fission-owned components
```

## 4. Test that a skill actually fires in a real Claude Code session

This is the step that validates the whole premise, not just the scripts:

1. Open a real project with the plugin installed (step 1).
2. Ask for something that should trigger exactly one skill — "add a delete
   confirmation dialog to this page" should pull `fl-ds-dialog`, not all ten.
3. Confirm (via whatever this Claude Code version surfaces for active
   skills) that only the relevant skill loaded, and that it ran the detector
   before suggesting any code.
4. Repeat once in a project that already uses MUI or Chakra — the output
   should go through that component's adapter section, not suggest
   installing shadcn.

This is the one step with no fixture I can hand you — it depends on your
actual CLI version's UI for showing which skill fired, which I can't see
from here.

## 5. Cross-tool portability check (optional, from the original proposal)

I checked this repo's frontmatter and confirmed every one of the 10 skills
uses only `name` and `description` — no Claude-specific fields — so nothing
here should block loading elsewhere. To actually confirm:

```bash
# Cursor and Codex both read .agents/skills/ natively
mkdir -p .agents/skills
cp -r plugins/fl-design-system/skills/fl-ds-button .agents/skills/
cp -r plugins/fl-design-system/shared .agents/skills/fl-ds-button/../../shared  # keep the relative path intact
```

Open the same project in Cursor or Codex and try the same "add a button"
prompt. This only proves portability for one skill — treat it as a smoke
test, not full coverage.

## Exit criteria for this round

- [ ] `claude plugin marketplace add` resolves the repo
- [ ] `fl-design-system` installs; all 10 skills are visible
- [ ] Each of the 3 detector fixtures above returns the expected result
- [ ] A real `npx shadcn add .../button.json` pull succeeds from a real
      machine, and the variant names match (or `fl-ds-button`'s `SKILL.md`
      gets corrected to match what actually ships)
- [ ] At least one skill observed firing correctly inside a real session,
      on both a Fission-native and a non-Fission (MUI/Chakra/etc.) project
- [ ] One cross-tool smoke test, if you want that proposal claim verified
      now rather than later
