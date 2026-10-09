#!/usr/bin/env node
/**
 * Detects which UI design system a project is already using, so the design-system
 * skills can adapt to it instead of assuming any one stack. Generic across clients:
 * the list of "branded shadcn registries" it recognizes comes from
 * ../references/brand-registries.json, not from hardcoded Fission logic — add a
 * row there (plus an adapters/registries/<id>.md file) to support another client's
 * own private design system with no code change here.
 *
 * Exit behavior: always exits 0 and prints a single-word/token result on the last
 * line so the calling skill can parse it with `tail -n1`. Everything above that
 * line is a human-readable report.
 *
 * Result shapes:
 *   shadcn:<brand-id>   e.g. shadcn:fission  — shadcn project, a registered brand's
 *                       owned components are already present
 *   shadcn-bare         — shadcn + Tailwind present, no registered brand detected
 *   mui | chakra | antd | css-only | greenfield | unknown
 *
 * Usage: node detect-design-system.mjs [projectRoot]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

const registryFile = path.join(__dirname, "..", "references", "brand-registries.json");
const registryData = readJSON(registryFile) || { registries: [] };

const uiDir = findFirst(["components/ui", "src/components/ui", "app/components/ui"]);
let uiFiles = [];
if (uiDir) {
  try {
    uiFiles = fs.readdirSync(path.join(root, uiDir));
  } catch {
    // ignore
  }
}

function matchBrand() {
  for (const brand of registryData.registries) {
    const found = (brand.ownedComponents || []).filter((name) =>
      uiFiles.some((f) => f.toLowerCase().startsWith(name))
    );
    if (found.length > 0) return { brand, found };
  }
  return null;
}

const brandMatch = matchBrand();

const report = [];
report.push(`package.json: ${pkg ? "found" : "missing"}`);
report.push(`components.json (shadcn): ${hasShadcnConfig ? "found" : "not found"}`);
report.push(`tailwindcss: ${hasTailwind ? "found" : "not found"}`);
report.push(`@mui/material: ${deps["@mui/material"] ? deps["@mui/material"] : "not found"}`);
report.push(`@chakra-ui/react: ${deps["@chakra-ui/react"] ? deps["@chakra-ui/react"] : "not found"}`);
report.push(`antd: ${deps["antd"] ? deps["antd"] : "not found"}`);
report.push(
  `Registered brands checked: ${registryData.registries.map((b) => b.id).join(", ") || "(none registered)"}`
);
report.push(
  brandMatch
    ? `Match in ${uiDir}: brand "${brandMatch.brand.id}" (${brandMatch.found.join(", ")})`
    : `No registered brand's components found in ${uiDir || "(no ui dir)"}`
);
console.log(report.join("\n"));

let result = "unknown";
if (hasShadcnConfig && hasTailwind && brandMatch) {
  result = `shadcn:${brandMatch.brand.id}`;
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
