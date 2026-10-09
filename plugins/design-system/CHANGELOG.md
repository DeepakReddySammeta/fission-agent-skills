# design-system changelog

## 1.0.0 — 2026-10-08
- Initial release. Split out of `fl-design-system` 2.1.0's 10 per-component
  skills (`fl-ds-button`, `fl-ds-input`, …), generalized to be
  design-system-agnostic: `ds-button`, `ds-input`, `ds-card`, `ds-dialog`,
  `ds-table`, `ds-form`, `ds-badge`, `ds-select`, `ds-tabs`, `ds-toast`.
- Fission's own shadcn registry is now one entry in `shared/references/
  brand-registries.json`, the same shape another client's own private
  registry would use — the detector and all 10 skills are brand-neutral;
  adding a new client's design system is a data + one adapter-doc change,
  not a code change.
- The four token-mapping adapters (`mui.md`, `chakra.md`, `antd.md`,
  `css-variables.md`) genericized: no hardcoded brand hex values, each
  points to "the active brand's own token reference" instead (Fission's
  lives in the sibling `fl-design-system` plugin).
- This plugin has no dependency on `fl-design-system` being installed —
  verified by making the Fission registry adapter
  (`adapters/registries/fission.md`) self-contained rather than
  referencing `fl-design-system`'s install script via a cross-plugin
  relative path.
