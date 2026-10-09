# frontend-common changelog

## 1.0.0 — 2026-10-08
- Initial release. Four skills, all framework-independent:
  `fe-debug`, `fe-explore`, `fe-knowledge-lookup` (procedures, not
  framework-specific knowledge — apply the same way on React, Next,
  Angular, Vue, or plain JS), and `fe-upstream-setup` (gates
  framework-specific upstream skill installs behind detection +
  engineer confirmation, so a project never ends up with every
  framework's skills loaded).
- `scripts/detect-frontend-framework.mjs`: detects `next`, `react`,
  `angular`, `vue`, `svelte`, `plain-js`, `greenfield`, or `unknown` from
  `package.json` and framework config files. Verified against synthetic
  fixtures for `next`, `angular`, `plain-js`, and `greenfield` this round.
- `fe-upstream-setup`'s install table checked 2026-10-08: Angular has a
  first-party bundle (`angular/skills`, Angular team/Google); Vue and
  Svelte do not — only community options were found, named in the skill
  but not defaulted to, per `UPSTREAM.md`'s "Trusting third-party skills"
  rule. Re-check this table periodically; it's a snapshot, not a
  guarantee the landscape hasn't moved.
