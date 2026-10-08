# Adapter: Ant Design (`antd`)

Map tokens through `ConfigProvider`'s theme token API — don't install shadcn or
another library alongside AntD.

```tsx
import { ConfigProvider } from "antd";

const fissionTokens = {
  colorPrimary: "#f25011",        // --primary
  colorError: /* --destructive */ "#TBD",
  colorSuccess: /* --success */ "#TBD",
  colorWarning: /* --warning */ "#TBD",
  colorBgContainer: /* --card */ "#TBD",
  colorText: /* --foreground */ "#TBD",
  colorTextSecondary: /* --muted-foreground */ "#TBD",
  borderRadius: 8, // placeholder until a radius token is captured
};

export function FissionThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={{ token: fissionTokens }}>{children}</ConfigProvider>
  );
}
```

For client theme switching, keep one `fissionTokens` object per theme name
(`Fission`/`Ocean`/`Forest`/`Violet`/`Slate`) and swap which one is passed to
`ConfigProvider`, reading the same `fission-ui-theme` preference the native
stack uses.

`TBD` placeholders: see `../fission-tokens.md` — don't invent values; flag the
gap instead.
