#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// generate.js — Main entry point.
//   Fetches GitHub contribution data (or uses demo data),
//   generates animated SVGs, writes to dist/.
// ─────────────────────────────────────────────────────────────

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchContributions } from "./github.js";
import { buildGrid, generateDemoData } from "./contribution.js";
import { buildSvg } from "./svg.js";

// ── Config ──────────────────────────────────────────────────
const USERNAME = process.env.GITHUB_USER || "MATHANK-074";
const TOKEN    = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const DEMO     = process.argv.includes("--demo");

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST      = join(__dirname, "..", "dist");

// ── Main ────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Space Rocket Contribution Generator");
  console.log(`   User : ${USERNAME}`);
  console.log(`   Mode : ${DEMO ? "demo (sample data)" : "live (GitHub API)"}\n`);

  // 1. Get contribution data
  let days;
  if (DEMO) {
    console.log("  Generating demo contribution data…");
    days = generateDemoData();
  } else {
    if (!TOKEN) {
      console.warn("  ⚠  No GITHUB_TOKEN found — falling back to demo data.");
      console.warn("     Set GITHUB_TOKEN env var or use --demo flag.\n");
      days = generateDemoData();
    } else {
      console.log("  Fetching contributions from GitHub…");
      days = await fetchContributions(USERNAME, TOKEN);
    }
  }

  console.log(`  ${days.length} days loaded.\n`);

  // 2. Build grid
  const grid = buildGrid(days);
  console.log(`  Grid: ${grid.totalWeeks} weeks × 7 days\n`);

  // 3. Generate SVGs
  mkdirSync(DIST, { recursive: true });

  for (const theme of ["light", "dark"]) {
    const svg = buildSvg(grid, theme);
    const suffix = theme === "light" ? "" : `-${theme}`;
    const filename = `space-rocket${suffix}.svg`;
    const filepath = join(DIST, filename);

    writeFileSync(filepath, svg, "utf-8");

    const sizeKB = (Buffer.byteLength(svg, "utf-8") / 1024).toFixed(1);
    console.log(`  ✓ ${filename}  (${sizeKB} KB)`);
  }

  console.log(`\n  Done! Files written to dist/`);
}

main().catch((err) => {
  console.error("❌ Generation failed:", err.message);
  process.exit(1);
});
