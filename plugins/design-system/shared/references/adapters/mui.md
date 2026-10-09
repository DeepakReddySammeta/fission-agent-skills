# Adapter: Material UI (`@mui/material`)

Don't install shadcn next to MUI. Map the active brand's tokens into the
existing `ThemeProvider` — this file is the mapping pattern, not a specific
brand's values.

```ts
// theme/brandTheme.ts
import { createTheme } from "@mui/material/styles";

export const brandTheme = createTheme({
  palette: {
    primary: { main: /* brand "primary" token */ "#TBD" },
    error: { main: /* brand "destructive"/"error" token */ "#TBD" },
    success: { main: /* brand "success" token */ "#TBD" },
    warning: { main: /* brand "warning" token */ "#TBD" },
    background: {
      default: /* brand "background" token */ "#TBD",
      paper: /* brand "card" token */ "#TBD",
    },
    text: {
      primary: /* brand "foreground" token */ "#TBD",
      secondary: /* brand "muted-foreground" token */ "#TBD",
    },
  },
  shape: {
    borderRadius: 8, // placeholder until a radius token is captured for the active brand
  },
});
```

Wrap the app root:

```tsx
<ThemeProvider theme={brandTheme}>
  <CssBaseline />
  {children}
</ThemeProvider>
```

**Where the real hex values come from**: never invent them. Pull from
whichever brand is active for this project:

- **Fission's own design system** → `fl-design-system`'s
  `references/fission-tokens.md` (install that plugin alongside this one if
  the project carries Fission's brand). If it isn't installed, ask rather
  than guess a value.
- **A different client's own design system** → that project's per-project
  skill (see `frontend-common`'s project-skill guidance) should hold the
  equivalent token reference; ask the team if one hasn't been written yet.

For client theme switching (if the active brand supports multiple named
themes), keep one `createTheme()` per theme name and swap the
`ThemeProvider`'s `theme` prop based on whatever preference key that brand
uses, so behavior stays consistent with its native shadcn stack.
