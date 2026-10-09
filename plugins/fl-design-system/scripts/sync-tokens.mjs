#!/usr/bin/env node
/**
 * Prints the canonical Fission component tokens as a plain key/value map, read
 * from this skill's own references/fission-tokens.md, so an adapter (MUI, Chakra,
 * AntD) can be generated or checked for drift without hand-copying hex values.
 *
 * This intentionally does NOT write into the target project automatically —
 * theme files are hand-authored and framework-specific; see the `design-system`
 * plugin's shared/references/adapters/.
 * It exists so a future CI "token drift" check (see VERSIONING.md) has one place
 * to read values from.
 *
 * Usage: node sync-tokens.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensFile = path.join(__dirname, "..", "references", "fission-tokens.md");
const md = fs.readFileSync(tokensFile, "utf8");

// Token lines look like: | `--primary` | `#f25011` | Fission brand orange |
const rowRe = /\|\s*`(--[\w-]+)`\s*\|\s*`(#[0-9a-fA-F]{3,8}|[^`]+)`\s*\|/g;
const tokens = {};
let m;
while ((m = rowRe.exec(md))) {
  tokens[m[1]] = m[2];
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(tokens, null, 2));
} else {
  for (const [k, v] of Object.entries(tokens)) {
    console.log(`${k} = ${v}`);
  }
  console.log(`\n${Object.keys(tokens).length} tokens read from ${tokensFile}`);
}
