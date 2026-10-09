# Adapter: plain CSS / CSS Modules / styled-components / no component library

This is the lowest-friction adapter — it's the same mechanism a native
shadcn stack uses, just without the component layer. Define the active
brand's variables once and consume them with `var(--token)` everywhere.

```css
/* theme/brand-tokens.css */
:root[data-theme="<brand-theme-name>"] {
  --primary: /* TBD */;
  --destructive: /* TBD */;
  --success: /* TBD */;
  --warning: /* TBD */;
  --background: /* TBD */;
  --foreground: /* TBD */;
  --card: /* TBD */;
  --border: /* TBD */;
  --muted-foreground: /* TBD */;
  --ring: /* TBD */;
}
```

Set `data-theme="<brand-theme-name>"` on `<html>` (or `<body>`) to activate;
swap the attribute value to switch themes once a brand's variants are
captured.

**styled-components**: wrap the same values in a `DefaultTheme` object and
use `ThemeProvider` from `styled-components`, or simply reference the CSS
variables directly inside template literals (`color: var(--primary);`) — no
theme object required if the CSS file above is already loaded globally.

**CSS Modules**: import the same `brand-tokens.css` globally (e.g. in
`_app.tsx` / root layout) and reference `var(--token)` inside module files
as normal; CSS variables aren't scoped by CSS Modules' class-name hashing.

**Real token values**: never invent a `/* TBD */`. Pull from the active
brand's own reference — for Fission, `fl-design-system`'s
`references/fission-tokens.md`; for another client's own design system,
that project's per-project skill. Ask if neither exists yet.
