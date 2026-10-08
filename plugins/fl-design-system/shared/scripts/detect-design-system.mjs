#!/usr/bin/env node
/**
 * Detects which UI design system a project is already using, so fl-design-system
 * can adapt to it instead of forcing a swap to Fission's own shadcn stack.
 *
 * Exit behavior: always exits 0 and prints a single-word result on the last line
 * (fission-shadcn | shadcn-bare | mui | chakra | antd | css-only | greenfield | unknown)
 * so the calling skill can parse it with `tail -n1`. Everything above that line is
 * a human-readable report.
 *
 * Usage: node detect-design-system.mjs [projectRoot]
 */
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || process.cwd();

function readJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function exists(p) {
  return fs.existsSync(path.join(root, p));
}

function findFirst(globs) {
  return globs.find((g) => exists(g));
}

const pkg = readJSON(path.join(root, "package.json"));
const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };

const hasAnyUiCode =
  exists("src") || exists("app") || exists("pages") || exists("components");

if (!pkg || !hasAnyUiCode) {
  console.log("No package.json / no src|app|pages|components directory found.");
  console.log("greenfield");
  process.exit(0);
}

const componentsJson = readJSON(path.join(root, "components.json"));
const hasShadcnConfig = !!componentsJson;
const hasTailwind =
  !!deps.tailwindcss || !!findFirst(["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"]);

// Look for at least one Fission-owned component actually installed, not just shadcn.
const FISSION_OWNED = ["button", "input", "card", "dialog", "table", "form", "badge", "select", "tabs", "toast"];
const uiDir = findFirst(["components/ui", "src/components/ui", "app/components/ui"]);
let fissionComponentsFound = [];
if (uiDir) {
  try {
    const files = fs.readdirSync(path.join(root, uiDir));
    fissionComponentsFound = FISSION_OWNED.filter((name) =>
      files.some((f) => f.toLowerCase().startsWith(name))
    );
  } catch {
    // ignore
  }
}

const report = [];
report.push(`package.json: ${pkg ? "found" : "missing"}`);
report.push(`components.json (shadcn): ${hasShadcnConfig ? "found" : "not found"}`);
report.push(`tailwindcss: ${hasTailwind ? "found" : "not found"}`);
report.push(`@mui/material: ${deps["@mui/material"] ? deps["@mui/material"] : "not found"}`);
report.push(`@chakra-ui/react: ${deps["@chakra-ui/react"] ? deps["@chakra-ui/react"] : "not found"}`);
report.push(`antd: ${deps["antd"] ? deps["antd"] : "not found"}`);
report.push(
  `Fission-owned components detected in ${uiDir || "(no ui dir)"}: ${
    fissionComponentsFound.length ? fissionComponentsFound.join(", ") : "none"
  }`
);
console.log(report.join("\n"));

let result = "unknown";
if (hasShadcnConfig && hasTailwind && fissionComponentsFound.length > 0) {
  result = "fission-shadcn";
} else if (hasShadcnConfig && hasTailwind) {
  result = "shadcn-bare";
} else if (deps["@mui/material"]) {
  result = "mui";
} else if (deps["@chakra-ui/react"]) {
  result = "chakra";
} else if (deps["antd"]) {
  result = "antd";
} else if (!deps["@mui/material"] && !deps["@chakra-ui/react"] && !deps["antd"] && !hasShadcnConfig) {
  result = "css-only";
}

console.log(result);
