// ─────────────────────────────────────────────────────────────
// path.js — Generate a smooth flight path for the rocket
//            through the contribution grid.
// ─────────────────────────────────────────────────────────────

import { CELL } from "./grid.js";

/**
 * Generate an SVG path `d` string for the rocket to follow.
 *
 * The rocket enters from the left, weaves through the grid
 * in a smooth sinusoidal wave, and exits to the right.
 *
 * @param {{ weeks: Array<Array<{level:number}>> }} grid
 * @param {number} originX  grid top-left X
 * @param {number} originY  grid top-left Y
 * @param {number} gridW    grid pixel width
 * @param {number} gridH    grid pixel height
 * @returns {string}  SVG path d attribute
 */
export function generateRocketPath(grid, originX, originY, gridW, gridH) {
  const midY = originY + gridH / 2;
  const amplitude = gridH * 0.38;           // vertical swing
  const cycles = 5;                          // number of wave oscillations
  const enterX = originX - 25;              // start off-screen left
  const exitX = originX + gridW + 25;       // exit off-screen right
  const totalW = exitX - enterX;

  // Build waypoints along the sinusoidal wave
  const numPoints = 60;
  const points = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = enterX + t * totalW;
    const y = midY + Math.sin(t * Math.PI * 2 * cycles) * amplitude;
    points.push({ x, y });
  }

  // Refine: bias the wave toward cells with actual contributions
  // (subtle pull toward higher-activity rows at each column)
  for (let i = 1; i < points.length - 1; i++) {
    const pt = points[i];
    const weekIdx = Math.floor((pt.x - originX) / CELL.step);
    if (weekIdx < 0 || weekIdx >= grid.weeks.length) continue;

    const week = grid.weeks[weekIdx];
    // Find the row with highest activity in this column
    let bestDay = -1, bestLevel = -1;
    for (let d = 0; d < week.length; d++) {
      if (week[d].level > bestLevel) {
        bestLevel = week[d].level;
        bestDay = d;
      }
    }
    if (bestLevel >= 2 && bestDay >= 0) {
      const targetY = originY + bestDay * CELL.step + CELL.size / 2;
      // Gently pull toward this cell (30% blend)
      pt.y = pt.y * 0.7 + targetY * 0.3;
    }
  }

  // Convert points to a smooth cubic bézier path (Catmull-Rom → cubic)
  return catmullRomToCubicPath(points);
}

/**
 * Convert an array of {x,y} points into a smooth SVG cubic bézier path
 * using Catmull-Rom spline interpolation.
 */
function catmullRomToCubicPath(points, tension = 0.3) {
  if (points.length < 2) return "";

  const d = [`M ${r(points[0].x)} ${r(points[0].y)}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    // Control points
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d.push(`C ${r(cp1x)} ${r(cp1y)}, ${r(cp2x)} ${r(cp2y)}, ${r(p2.x)} ${r(p2.y)}`);
  }

  return d.join(" ");
}

/** Round to 1 decimal place. */
function r(n) {
  return Math.round(n * 10) / 10;
}
