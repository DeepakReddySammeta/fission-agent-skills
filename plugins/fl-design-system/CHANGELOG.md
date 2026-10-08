# fl-design-system changelog

## 2.0.0 — 2026-10-08
- **Breaking restructure**: split from one umbrella skill into 10 — one per
  Fission-owned component (`fl-ds-button`, `fl-ds-input`, `fl-ds-card`,
  `fl-ds-dialog`, `fl-ds-table`, `fl-ds-form`, `fl-ds-badge`, `fl-ds-select`,
  `fl-ds-tabs`, `fl-ds-toast`). Reasoning: a component-level description
  triggers more precisely than one broad "any UI work" description, and only
  the skills actually in play for a given change load into context.
- Shared detector, token reference, and 4 adapter files moved to `shared/`,
  referenced by every component skill via a `../../shared/...` relative path
  — kept out of each skill folder to avoid duplicating the same content 10x.
- Each component skill now documents that component's adapter mapping
  specifically (e.g. Dialog → MUI `<Dialog>` vs. Chakra `<Modal>`, which use
  different names for the same concept) rather than a generic pointer to one
  shared adapter file.
- Confirmed from the live demo: Button and Badge share a non-stock variant
  set (`Default, Secondary, Outline, Error, Success, Warning`) — encoded
  directly in both skills. Exact prop-string casing is inferred, not read
  from source — flagged in both SKILL.md files for first-use confirmation.

## 1.0.0 — 2026-10-08 (superseded)
- Initial release as a single umbrella skill with an internal detect/adapt
  branch. Replaced by 2.0.0 per direction to split per component.
