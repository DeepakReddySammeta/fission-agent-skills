# Component catalog — what this bundle covers

Ten UI "slots," each with its own skill (`ds-button`, `ds-input`, `ds-card`,
`ds-dialog`, `ds-table`, `ds-form`, `ds-badge`, `ds-select`, `ds-tabs`,
`ds-toast`). None of them assume a specific design system — each detects
the project's actual stack first (see `../scripts/detect-design-system.mjs`)
and only then opens the matching adapter section:

- **A registered branded shadcn registry** (Fission's or another client's
  own — see `adapters/registries/`) → install/update that brand's real
  component code.
- **Bare shadcn** (no registered brand detected) → ask which brand applies,
  or confirm stock shadcn is fine as-is for this project.
- **MUI / Chakra / AntD / plain CSS** (`adapters/mui.md`, `chakra.md`,
  `antd.md`, `css-variables.md`) → map the active brand's tokens into that
  system's existing theming layer. Never installs a second component
  library alongside an existing one.

## Style rules (framework/brand-agnostic)

- No raw `<button>`, `<input>`, `<select>` in product UI when a design
  system is already in play on the project.
- No hardcoded hex colors in component files — use the token / theme value,
  whichever brand is active.
- Forms go through the design system's form primitives (e.g. shadcn's
  `<Form>` + `<FormField>`), not ad hoc state + raw inputs.

## Brand-specific detail

Which components a given brand actually owns, their registry URL, exact
variant names, and token hex values are **not** catalogued here — that's
brand data, kept next to whichever brand owns it (see
`adapters/registries/<id>.md` for install/usage, and that brand's own
plugin — e.g. `fl-design-system` — for token hex values). This file only
describes the shape of the catalog, not any one brand's content.
