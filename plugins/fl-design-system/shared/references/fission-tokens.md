# Fission UI tokens — source of truth

Pulled from `FissionHQ/ui-design-system`, `templates/poc-starter/app/globals.css`
and `tailwind.config.ts` (checked 2026-10-08). The repo's `tokens/` directory is
the actual source; this file is a cache for the skill to read without a network
call, and must be re-synced whenever that repo's tokens change (see VERSIONING.md
→ "dependency-triggered review").

## Component tokens (CSS variables, mapped into Tailwind utilities)

| Token | Default (`Fission` theme) | Notes |
| --- | --- | --- |
| `--primary` | `#f25011` | Fission brand orange — this is the *component* default, set via `data-theme="Fission"` |
| `--background` | *(theme-dependent)* | see `globals.css` per theme |
| `--foreground` | *(theme-dependent)* | |
| `--card` | *(theme-dependent)* | |
| `--border` | *(theme-dependent)* | |
| `--muted-foreground` | *(theme-dependent)* | |
| `--ring` | *(theme-dependent)* | focus ring, usually matches `--primary` |
| `--sidebar-background` | *(theme-dependent)* | |
| `--destructive` | *(theme-dependent)* | error / danger state |
| `--success` | *(theme-dependent)* | |
| `--warning` | *(theme-dependent)* | |

Exact hex values for every non-`Fission` theme (`Ocean`, `Forest`, `Violet`,
`Slate`) and for spacing/typography/radius/shadow are **not yet captured here** —
pull them from `templates/poc-starter/app/globals.css` in the upstream repo when
first needed, and add the row. Don't invent a value.

Client theme is selected via `data-theme="Fission|Ocean|Forest|Violet|Slate"` on
`:root`, persisted to `localStorage` under `fission-ui-theme`, and dark mode is a
`.dark` class on `<html>` — independent of which theme is selected.

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

## Adapter path values

When mapping into MUI/Chakra/AntD/plain CSS (see `../adapters/`), use the
component tokens above, not the brand-deck palette — the adapters are styling
product UI, not decks.
