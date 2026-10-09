# When the detector reports `unknown`

Read the detector's full report (not just the last line) before asking
anything — it already tells you *why* it couldn't classify the project:

- **A component directory was found** (`Largest component directory: ...`)
  but didn't match any registered shadcn brand and wasn't `components/ui`
  at all — this is very likely a client's own existing component library
  under a different folder convention.
- **A design-systemish dependency was found** (`Dependency that looks
  like...`) — this is very likely the actual package name of their design
  system.
- **Neither was found** — this is a genuinely unclear case (no
  package.json signal at all beyond what's already checked); ask broadly.

## What to do, in order

1. **Open the directory the report found** (or search the dependency's
   `node_modules` / check its README) before asking anything — the actual
   component files usually answer "what's the import path and prop API"
   directly, faster than asking and waiting.
2. **If that's enough to proceed**, use what you found for this task.
   Don't fall back to plain CSS, native elements, or a different system
   (MUI/Chakra/shadcn) just because this one isn't in the adapter list —
   that's the exact failure mode this file exists to prevent. A client's
   own real components, even undocumented ones, are always the right
   choice over inventing unstyled markup.
3. **If the API genuinely isn't discoverable from the code** (minified,
   external package with no local source, no docs), ask the engineer
   directly: the package/import path, and the Button/Input/Dialog (or
   whichever components this task needs) prop API — don't guess variant
   names.
4. **Flag it for a proper adapter.** A one-off answer only fixes this
   task; the next `ds-*` skill invocation on this same project will hit
   `unknown` again. Tell the engineer this project's design system should
   be registered properly — see
   `adapters/registries/README.md` if it turns out to be a shadcn-based
   registry, or ask Fission's platform team to add it as a registered
   custom library if it's a plain installed package. Don't silently
   re-derive this every session.
