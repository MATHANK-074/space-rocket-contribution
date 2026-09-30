// ─────────────────────────────────────────────────────────────
// svg.js — Assemble the complete animated SVG document.
// ─────────────────────────────────────────────────────────────

import { renderGrid, gridDimensions, CELL, PALETTE } from "./grid.js";
import { rocketSvg } from "./rocket.js";
import { generateRocketPath } from "./path.js";

/**
 * Generate a self-contained animated SVG string.
 *
 * @param {{ weeks: Array<Array<{level:number}>> }} grid
 * @param {"light"|"dark"} theme
 * @returns {string}  Complete SVG markup
 */
export function buildSvg(grid, theme) {
  const palette = PALETTE[theme];

  // Layout
  const padding = 20;
  const { width: gw, height: gh } = gridDimensions(grid.totalWeeks);
  const originX = padding;
  const originY = padding;
  const svgW = gw + padding * 2;
  const svgH = gh + padding * 2;

  // Rocket flight path
  const flightPath = generateRocketPath(grid, originX, originY, gw, gh);

  // Grid cells
  const gridCells = renderGrid(grid, theme, originX, originY);

  // Rocket shape
  const rocket = rocketSvg(theme);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${svgW} ${svgH}"
  width="${svgW}"
  height="${svgH}"
  role="img"
  aria-label="GitHub contribution graph with animated space rocket"
>
  <title>GitHub contribution space rocket animation</title>
  <desc>A futuristic space-shooter rocket flies through the GitHub contribution calendar for MATHANK-074.</desc>

  <style>
    .rocket-group {
      will-change: transform;
    }
  </style>

  <!-- Background -->
  <rect width="${svgW}" height="${svgH}" rx="6" fill="${palette.bg}" />

  <!-- Contribution grid -->
  <g id="grid">
    ${gridCells}
  </g>

  <!-- Rocket + flight animation -->
  <g class="rocket-group">
    ${rocket}
    <animateMotion
      dur="12s"
      repeatCount="indefinite"
      rotate="auto"
      calcMode="spline"
      keySplines="${generateKeySplines(60)}"
      keyTimes="${generateKeyTimes(60)}"
      path="${flightPath}"
    />
  </g>

</svg>`;
}

/**
 * Generate evenly-spaced keyTimes for N segments.
 */
function generateKeyTimes(n) {
  const times = [];
  for (let i = 0; i <= n; i++) {
    times.push((i / n).toFixed(4));
  }
  return times.join(";");
}

/**
 * Generate cubic-bezier keySplines for smooth motion across N segments.
 * Uses ease-in-out for a natural gliding feel.
 */
function generateKeySplines(n) {
  const spline = "0.4 0 0.6 1";
  return Array(n).fill(spline).join("; ");
}
