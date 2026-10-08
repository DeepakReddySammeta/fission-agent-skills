# Adapter: Material UI (`@mui/material`)

Don't install shadcn next to MUI. Map tokens into the existing `ThemeProvider`.

```ts
// theme/fissionTheme.ts
import { createTheme } from "@mui/material/styles";

export const fissionTheme = createTheme({
  palette: {
    primary: { main: "#f25011" },       // --primary
    error: { main: /* --destructive */ "#TBD" },
    success: { main: /* --success */ "#TBD" },
    warning: { main: /* --warning */ "#TBD" },
    background: {
      default: /* --background */ "#TBD",
      paper: /* --card */ "#TBD",
    },
    text: {
      primary: /* --foreground */ "#TBD",
      secondary: /* --muted-foreground */ "#TBD",
    },
  },
  shape: {
    borderRadius: 8, // placeholder until a radius token is captured
  },
});
```

Wrap the app root:

```tsx
<ThemeProvider theme={fissionTheme}>
  <CssBaseline />
  {children}
</ThemeProvider>
```

`/* --TOKEN */` placeholders mean: pull the real value from
`../fission-tokens.md` once it's captured for the theme in use (default
`Fission` theme has `--primary` captured; the rest are TBD — see that file's
note). Don't invent values to fill a `TBD`; leave it and flag it.

For client theme switching (Fission/Ocean/Forest/Violet/Slate), keep one
`createTheme()` per theme name and swap the `ThemeProvider`'s `theme` prop based
on the same `fission-ui-theme` preference used by the native stack, so behavior
stays consistent across a mixed fleet of projects.
