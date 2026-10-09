---
name: fe-explore
description: Use when finding where something lives in a frontend codebase (a component, a route, a piece of state, a style), on any frontend stack. A framework-agnostic search procedure, not a map of any one framework's conventions.
---

# Explore a frontend codebase

A procedure for locating code, not a guide to any one framework's folder
conventions — those vary per project and per framework, so this skill
never assumes `src/components` vs `app/` vs a feature-folder layout. It
finds the actual layout first.

## Step 1 — find entry points before guessing structure

- Framework config files name the real entry points and routing scheme
  (`next.config.*`, `angular.json`, `vite.config.*`, `vue.config.*`) —
  read the one present before assuming a layout from habit.
- For routing specifically: file-based routers (Next's `app`/`pages`,
  SvelteKit) encode routes as the directory structure itself; config-based
  routers (Angular, React Router, Vue Router) encode them in a routes
  file — grep for `Route`/`routes`/`router` rather than assuming either
  shape.

## Step 2 — search by what the code does, not by where you'd expect it

- Grep for the literal string, prop name, CSS class, or API endpoint path
  named in the task — this finds the real location faster than walking
  directories by guessed convention.
- Trace a feature end to end by following its data, not its folder: find
  where state/props originate, then follow every place that reads or
  writes it, rather than assuming one file "owns" a cross-cutting feature.

## Step 3 — confirm scope before reporting

- When several files match, check whether they're actually the same
  concern (a shared component reused in multiple places) or coincidentally
  similar names (two unrelated `Card` components in different folders) —
  reporting the wrong one wastes the next step entirely.
- Cite `file:line`, not just a filename — the next step (debugging,
  editing) needs the exact location, not an area to re-search.

## Scope boundary

Finding code only. For understanding *why* code already found behaves a
certain way, see `fe-knowledge-lookup`. For fixing what's found, see
`fe-debug`.
