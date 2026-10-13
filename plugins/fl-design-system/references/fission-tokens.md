# Fission UI tokens — source of truth

Pulled from `FissionHQ/ui-design-system`, `templates/poc-starter/app/globals.css`
and `tailwind.config.ts`. The repo's `tokens/` directory is the actual source;
this file is a cache for the skill to read without a network call, and must be
re-synced whenever that repo's tokens change (see VERSIONING.md →
"dependency-triggered review").

This plugin's `fl-ds-*` skills read this file directly — there's no separate
adapter layer; Fission's design system is the only one this marketplace
targets (see the repo's `README.md` for why).

## Component tokens — confirmed from a real scaffold (2026-10-09)

Read directly from `app/globals.css` in an actual project scaffolded by
`fl-ds-setup`'s Step 2, not inferred. Supersedes the "not yet captured"
placeholders this file previously carried.

The semantic tokens below are defined via `var()` against an underlying
layer of raw primitives (`--color-brand`, `--color-zinc-50`...`950`,
`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`,
`--color-border`, `--color-sidebar`) — map the semantic names into an
adapter or theme object, not the raw `--color-*` ones, since the semantic
layer is what the components actually consume.

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `--primary` | `#f25011` | *(same as light — not redefined in `.dark`)* | Fission brand orange, via `--color-brand` |
| `--primary-hover` | `#e0470f` | *(same as light)* | |
| `--primary-active` | `#cf400d` | *(same as light)* | |
| `--primary-foreground` | `#ffffff` | *(same as light)* | via `--color-on-brand` |
| `--background` | `#fafafa` | `#09090b` | |
| `--foreground` | `#18181b` | `#f4f4f5` | |
| `--card` | `#ffffff` | `#18181b` | |
| `--card-foreground` | `#18181b` | `#f4f4f5` | |
| `--secondary` | `#f4f4f5` (zinc-100) | `#27272a` (zinc-800) | |
| `--secondary-foreground` | `#18181b` (zinc-900) | `#fafafa` (zinc-50) | |
| `--muted` | `#f4f4f5` (zinc-100) | `#27272a` (zinc-800) | |
| `--muted-foreground` | `#71717a` | *(same as light)* | |
| `--accent` | `#f4f4f5` (zinc-100) | `#27272a` (zinc-800) | |
| `--accent-foreground` | `#18181b` (zinc-900) | `#fafafa` (zinc-50) | |
| `--border` | `#e4e4e7` | `#3f3f46` | |
| `--input` | same as `--border` | same as `--border` | |
| `--ring` | `#f25011` (= `--color-brand`) | *(same as light)* | |
| `--destructive` | `#dc2626` | *(same as light)* | |
| `--destructive-foreground` | `#ffffff` | *(same as light)* | |
| `--success` | `#16a34a` | *(same as light)* | |
| `--success-foreground` | `#ffffff` | *(same as light)* | |
| `--warning` | `#d97706` | *(same as light)* | |
| `--warning-foreground` | `#ffffff` | *(same as light)* | |
| `--sidebar-background` | `#1c1e2e` | *(same as light)* | |
| `--sidebar-foreground` | `#ffffff` | *(same as light)* | |
| `--sidebar-muted` | `#9ca3af` | *(same as light)* | |
| `--sidebar-accent` | `rgba(242, 80, 17, 0.12)` | *(same as light)* | |
| `--sidebar-border` | `rgba(255, 255, 255, 0.08)` | *(same as light)* | |
| `--chart-1` … `--chart-6` | `#8b5cf6` `#3b82f6` `#ec4899` `#10b981` `#f59e0b` `#f43f5e` | *(same as light)* | dashboard chart accent colors |
| `--radius` | `0.5rem` | *(same as light)* | |

Dark mode in the real scaffold only redefines `background`/`foreground`/
`card`/`secondary`/`muted`/`accent`/`border`/`input` — `destructive`/
`success`/`warning`/`primary`/`ring`/`sidebar-*`/`chart-*` are not
redefined under `.dark` and so inherit the light value. If that's
unintentional, it's an upstream gap, not something to silently "fix" here.

## ⚠ Multi-theme claim — unconfirmed, possibly stale

An earlier version of this file claimed client theme switching via
`data-theme="Fission|Ocean|Forest|Violet|Slate"` on `:root`, persisted to
`localStorage` under `fission-ui-theme`. **That was not observed** in the
real scaffold's `globals.css` — it only has a plain `:root` block and a
`.dark` class, no `data-theme` attribute selector at all. This could mean
the claim is simply outdated, or that theme-switching lives somewhere else
in the project (a `ThemeProvider` component, a separate CSS file) that
wasn't checked — only `globals.css` was inspected. Don't rely on the
`data-theme` mechanism existing until someone confirms it against the rest
of the scaffolded project, not just this one file.

## ⚠ Known discrepancy to resolve with design, not silently picked

Fission's brand-deck palette (used for slides/docs, recorded separately) is:

- Cerulean `#007ea7`
- Medium Jungle `#469d49` (recorded as the primary/main brand color there)
- Strong Cyan `#3fc0c1`
- Pumpkin Spice `#ed7d31`
- Mauve Shadow `#75485e`
- Old Gold `#dbb957`

That is a **different primary** from the coded design system's default
(`--primary: #f25011`, orange). Both can be legitimate — a presentation palette
and a component-library default theme aren't required to match — but this skill
treats the **component tokens above as authoritative for code**, since that's
what's actually shipped and testable. Flag this to whoever owns both before the
pilot ships broadly; don't let an engineer "fix" one to match the other without
design sign-off.
