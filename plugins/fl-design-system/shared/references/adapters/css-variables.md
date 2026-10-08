# Adapter: plain CSS / CSS Modules / styled-components / no component library

This is the lowest-friction adapter — it's the same mechanism the native shadcn
stack uses, just without the component layer. Define the variables once and
consume them with `var(--token)` everywhere, exactly as the native stack does.

```css
/* theme/fission-tokens.css */
:root[data-theme="Fission"] {
  --primary: #f25011;
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

Set `data-theme="Fission"` on `<html>` (or `<body>`) to activate; swap the
attribute value to switch client themes once their variables are captured.

**styled-components**: wrap the same values in a `DefaultTheme` object and use
`ThemeProvider` from `styled-components`, or simply reference the CSS variables
directly inside template literals (`color: var(--primary);`) — no theme object
required if the CSS file above is already loaded globally.

**CSS Modules**: import the same `fission-tokens.css` globally (e.g. in
`_app.tsx` / root layout) and reference `var(--token)` inside module files as
normal; CSS variables aren't scoped by CSS Modules' class-name hashing.

`TBD` placeholders: see `../fission-tokens.md` — don't invent values; flag the
gap and keep moving with what's captured.
