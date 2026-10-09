#!/usr/bin/env node
/**
 * Detects which frontend framework(s) a project actually uses, so
 * fe-upstream-setup can point at the one matching upstream skill bundle
 * (Vercel's React/Next skills, an Angular equivalent, etc.) instead of
 * suggesting all of them. This is a signal to confirm with the engineer,
 * not an auto-install trigger — see fe-upstream-setup's SKILL.md.
 *
 * Exit behavior: always exits 0, prints a human-readable report, then a
 * single comma-separated last line (e.g. "next", "react,angular", "none",
 * "greenfield", "unknown") the calling skill parses with `tail -n1`.
 *
 * Usage: node detect-frontend-framework.mjs [projectRoot]
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

const pkg = readJSON(path.join(root, "package.json"));
const hasAnyCode = exists("src") || exists("app") || exists("pages") || exists("components");

if (!pkg && !hasAnyCode) {
  console.log("No package.json / no src|app|pages|components directory found.");
  console.log("greenfield");
  process.exit(0);
}

const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };

const checks = [
  { id: "next", match: !!deps["next"] || exists("next.config.js") || exists("next.config.mjs") || exists("next.config.ts") },
  { id: "react", match: !!deps["react"] && !deps["next"] },
  { id: "angular", match: !!deps["@angular/core"] || exists("angular.json") },
  { id: "vue", match: !!deps["vue"] },
  { id: "svelte", match: !!deps["svelte"] },
];

const detected = checks.filter((c) => c.match).map((c) => c.id);

const report = [];
report.push(`package.json: ${pkg ? "found" : "missing"}`);
for (const c of checks) {
  report.push(`${c.id}: ${c.match ? "detected" : "not detected"}`);
}
console.log(report.join("\n"));

if (detected.length === 0) {
  console.log(pkg ? "plain-js" : "unknown");
} else {
  console.log(detected.join(","));
}
