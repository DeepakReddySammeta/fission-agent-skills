# Adapter: Chakra UI (`@chakra-ui/react`)

Map the active brand's tokens via `extendTheme`, don't add a second
component system.

```ts
// theme/brandTheme.ts
import { extendTheme } from "@chakra-ui/react";

export const brandTheme = extendTheme({
  colors: {
    brand: {
      500: /* brand "primary" token */ "#TBD",
    },
    danger: { 500: /* brand "destructive" token */ "#TBD" },
    success: { 500: /* brand "success" token */ "#TBD" },
    warning: { 500: /* brand "warning" token */ "#TBD" },
  },
  styles: {
    global: {
      body: {
        bg: /* brand "background" token */ "#TBD",
        color: /* brand "foreground" token */ "#TBD",
      },
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});
```

```tsx
<ChakraProvider theme={brandTheme}>{children}</ChakraProvider>
```

Component defaults (so engineers don't have to pass `colorScheme="brand"`
everywhere): override `components.Button.defaultProps.colorScheme = "brand"`
in the same theme object, matching the active brand's owned Button default.

**Real token values**: see `mui.md`'s note above — pull from the active
brand's own reference (e.g. Fission's `fl-design-system/references/
fission-tokens.md`), never invent a `"#TBD"`.
