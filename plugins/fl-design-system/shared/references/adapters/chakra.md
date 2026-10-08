# Adapter: Chakra UI (`@chakra-ui/react`)

Map tokens via `extendTheme`, don't add a second component system.

```ts
// theme/fissionTheme.ts
import { extendTheme } from "@chakra-ui/react";

export const fissionTheme = extendTheme({
  colors: {
    brand: {
      500: "#f25011", // --primary
    },
    danger: { 500: /* --destructive */ "#TBD" },
    success: { 500: /* --success */ "#TBD" },
    warning: { 500: /* --warning */ "#TBD" },
  },
  styles: {
    global: {
      body: {
        bg: /* --background */ "#TBD",
        color: /* --foreground */ "#TBD",
      },
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false, // org style: no near-black dark theme by default
  },
});
```

```tsx
<ChakraProvider theme={fissionTheme}>{children}</ChakraProvider>
```

Component defaults (so engineers don't have to pass `colorScheme="brand"`
everywhere): override `components.Button.defaultProps.colorScheme = "brand"` in
the same theme object, matching the Fission-owned Button's default look.

`TBD` placeholders: see `../fission-tokens.md` — don't invent values.
