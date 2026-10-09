# Adding another client's own private design-system registry

A client with their own shadcn-based component registry (their own branded
Button/Dialog/etc., published the same way Fission's is) slots in without
touching the detector script or any of the 10 `ds-*` skills:

1. Add one entry to `../../brand-registries.json`'s `registries` array:
   `id`, `label`, `ownedComponents` (the file-name prefixes the detector
   looks for in `components/ui/`), and `adapterDoc` pointing at a new file
   here.
2. Write that new file, same shape as `fission.md` in this folder: registry
   URL pattern, the install/update command, the component → import-path
   table, and whatever is confirmed vs. inferred about its variant API.
3. Nothing else changes. The next time the detector runs against that
   client's project, `components.json` + Tailwind + a matching owned
   component file name resolves to `shadcn:<new-id>`, and each `ds-*` skill
   opens this new file instead of `fission.md`.

Keep per-project client registries out of this shared marketplace repo if
the registry itself (not just the adapter doc) contains anything
client-confidential — see the proposal's "client IP isolation" risk. A
private, per-project registry can still be registered the same way from a
project-local skills directory; it doesn't have to live in this repo.
