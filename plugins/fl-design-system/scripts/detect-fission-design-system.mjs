#!/usr/bin/env node
/**
 * Detects whether Fission's own design system is already installed and ready to
 * use in this project. This plugin only cares about Fission's own system — it
 * does not try to detect or adapt to any other design system (MUI, Chakra, AntD,
 * a different client's own component library, etc.). That generic multi-brand
 * detection was tried and caused real problems (a client's own design system got
 * silently misclassified, producing inconsistent output) — this version trades
 * that breadth for one thing working reliably end to end: set up Fission's design
 * system, then its component skills just work.
 *
 * Exit behavior: always exits 0 and prints a single-word result on the last line
 * so the calling skill can parse it with `tail -n1`. Everything above that line is
 * a human-readable report.
 *
 * Result (last line):
 *   ready        — shadcn + Tailwind present, and at least one Fission-owned
 *                  component is already installed in components/ui (or similar)
 *   needs-setup  — a real project exists (package.json + a src/app/pages/
 *                  components directory), but Fission's design system isn't
 *                  installed yet — install it, don't fall back to plain CSS
 *   greenfield   — no project scaffolded yet (no package.json, no
 *                  src|app|pages|components directory)
 *
 * Usage: node detect-fission-design-system.mjs [projectRoot]
 */
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || process.cwd();

const FISSION_OWNED = ["button", "input", "card", "dialog", "table", "form", "badge", "select", "tabs", "toast"];

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
const hasAnyUiCode =
  exists("src") || exists("app") || exists("pages") || exists("components");

if (!pkg || !hasAnyUiCode) {
  console.log("No package.json / no src|app|pages|components directory found.");
  console.log("greenfield");
  process.exit(0);
}

const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };
const componentsJson = readJSON(path.join(root, "components.json"));
const hasShadcnConfig = !!componentsJson;
const hasTailwind =
  !!deps.tailwindcss || !!findFirst(["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"]);

const uiDir = findFirst(["components/ui", "src/components/ui", "app/components/ui"]);
let uiFiles = [];
if (uiDir) {
  try {
    uiFiles = fs.readdirSync(path.join(root, uiDir));
  } catch {
    // ignore
  }
}
const fissionComponentsFound = FISSION_OWNED.filter((name) =>
  uiFiles.some((f) => f.toLowerCase().startsWith(name))
);

const report = [];
report.push(`package.json: ${pkg ? "found" : "missing"}`);
report.push(`components.json (shadcn): ${hasShadcnConfig ? "found" : "not found"}`);
report.push(`tailwindcss: ${hasTailwind ? "found" : "not found"}`);
report.push(
  `Fission-owned components found in ${uiDir || "(no ui dir)"}: ${
    fissionComponentsFound.length ? fissionComponentsFound.join(", ") : "none"
  }`
);
console.log(report.join("\n"));

const ready = hasShadcnConfig && hasTailwind && fissionComponentsFound.length > 0;
console.log(ready ? "ready" : "needs-setup");
