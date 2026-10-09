---
name: fe-knowledge-lookup
description: Use when answering "how does this work" or "why is this built this way" about existing frontend code, on any frontend stack. A framework-agnostic procedure for answering from the actual code and its actual installed versions, not from training-data assumptions.
---

# Frontend knowledge lookup

A procedure for answering questions about existing code correctly, not a
knowledge base of any one framework's behavior — assumed behavior from
training data goes stale the moment a library's major version changes, and
guessing silently gives a confident wrong answer.

## Step 1 — read the real code before answering

- Open the actual file and read the actual implementation — don't answer
  "how does X work here" from what X usually does in general; this
  project's version may differ, or may wrap/override the default.
- Check `package.json` for the actual installed version of anything whose
  behavior changed across major versions before explaining "how it works"
  — citing v4 behavior for a project pinned to v2 is a wrong answer
  delivered confidently.

## Step 2 — check what the project already documents

- `README.md`, `AGENTS.md`/`CLAUDE.md`, and any per-project skill
  (installed outside the client repo, per the platform's per-project
  pattern) often already answer "why is this built this way" — read those
  before re-deriving an explanation from the code alone, and prefer the
  documented reason when one exists.
- If the documented reason and the code visibly disagree, say so rather
  than picking one silently — that mismatch is itself the useful answer.

## Step 3 — cite, don't summarize from memory

- Answer with `file:line` references to what was actually read, not a
  paraphrase of what the pattern "usually" looks like.
- If the honest answer is "I don't know without checking X" (a build step,
  a runtime value, a deployed config this session can't see), say that
  instead of filling the gap with a plausible guess.

## Scope boundary

Understanding existing code only. For locating which files are relevant in
the first place, see `fe-explore`. For root-causing a bug once the
relevant code is understood, see `fe-debug`.
