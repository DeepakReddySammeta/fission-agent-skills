---
name: fe-debug
description: Use when debugging a frontend bug, build failure, or runtime error of any kind, on any frontend stack. A framework-agnostic procedure for isolating root cause before changing code — not React/Angular/Vue-specific guidance.
---

# Debug a frontend issue

This is a procedure, not framework knowledge — it applies the same way
whether the project is React, Next, Angular, Vue, or plain JS. For
framework-specific debugging idioms (e.g. a Next.js hydration mismatch),
that's the matching upstream skill's job (see `fe-upstream-setup`) layered
on top of this procedure, not a replacement for it.

## Step 1 — read the actual error, not the symptom

The report names a symptom ("the page is blank", "the button does
nothing"). Before touching code:

- Build-time error → read the full compiler/bundler output, not just the
  first line; the real cause is often several lines down (a re-thrown
  error, a stack trace through a loader).
- Runtime error → open the browser console and the Network tab. A blank
  page is very often a thrown error during render that the console already
  names.
- Silent failure (no error at all, just wrong behavior) → that's the
  hardest case; go to Step 2 before guessing.

## Step 2 — reproduce, then isolate

- Get a minimal, reliable reproduction first. "Sometimes happens" is not
  enough to confirm a fix — find the exact action/input that triggers it
  every time.
- Bisect by removing or commenting out code, not by reasoning about what
  "should" be happening — a recent regression bisects fastest with
  `git bisect` or by diffing against the last known-good commit.
- Narrow which layer owns the bug before editing: is this a build
  problem, a runtime/render problem, a network/API problem, or a stale
  state problem? Each has different fixes and guessing the wrong layer
  wastes the edit.

## Step 3 — fix the root cause, not the caller

Before editing, check every caller of the function/component you're about
to touch (grep for it). A guard added in one caller that leaves every
sibling caller still broken isn't the fix — it's a patch on the symptom
the report happened to hit. Fix it once, where all callers route through.

## Step 4 — leave a check behind

Non-trivial logic (a branch, a loop, a parser, anything on a money/auth
path) should leave one runnable check behind that fails if the bug
reappears — not a full test suite, the smallest thing that would have
caught this one.

## Scope boundary

Procedure only. For "how does this specific piece of code actually work"
before you can even isolate the bug, see `fe-knowledge-lookup`. For
"where in this codebase does X live", see `fe-explore`.
