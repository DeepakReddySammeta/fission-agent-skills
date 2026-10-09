# Adapter: Ant Design (`antd`)

Map the active brand's tokens through `ConfigProvider`'s theme token API —
don't install shadcn or another library alongside AntD.

```tsx
import { ConfigProvider } from "antd";

const brandTokens = {
  colorPrimary: /* brand "primary" token */ "#TBD",
  colorError: /* brand "destructive" token */ "#TBD",
  colorSuccess: /* brand "success" token */ "#TBD",
  colorWarning: /* brand "warning" token */ "#TBD",
  colorBgContainer: /* brand "card" token */ "#TBD",
  colorText: /* brand "foreground" token */ "#TBD",
  colorTextSecondary: /* brand "muted-foreground" token */ "#TBD",
  borderRadius: 8, // placeholder until a radius token is captured for the active brand
};

export function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={{ token: brandTokens }}>{children}</ConfigProvider>
  );
}
```

For client theme switching, keep one `brandTokens` object per theme name and
swap which one is passed to `ConfigProvider`, reading whichever preference
key the active brand's native stack uses.

**Real token values**: see `mui.md`'s note — pull from the active brand's own
reference, never invent a `"#TBD"`.
