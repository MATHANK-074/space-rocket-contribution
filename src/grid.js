// ─────────────────────────────────────────────────────────────
// grid.js — Render the contribution grid as SVG elements.
// ─────────────────────────────────────────────────────────────

/** Cell dimensions (matches GitHub's sizing) */
export const CELL = {
  size: 10,
  gap: 3,
  get step() { return this.size + this.gap; },
  radius: 2,
};

/** Color palettes */
export const PALETTE = {
  light: {
    bg: "#ffffff",
    empty: "#ebedf0",
    levels: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  },
  dark: {
    bg: "#0d1117",
    empty: "#161b22",
    levels: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
};

/**
 * Render the contribution grid cells.
 *
 * @param {{ weeks: Array<Array<{level:number}>> }} grid
 * @param {"light"|"dark"} theme
 * @param {number} originX  - top-left X of the grid area
 * @param {number} originY  - top-left Y of the grid area
 * @returns {string}  SVG markup for all cells
 */
export function renderGrid(grid, theme, originX, originY) {
  const palette = PALETTE[theme];
  const lines = [];

  for (let w = 0; w < grid.weeks.length; w++) {
    const week = grid.weeks[w];
    for (let d = 0; d < week.length; d++) {
      const { level } = week[d];
      const x = originX + w * CELL.step;
      const y = originY + d * CELL.step;
      const fill = palette.levels[level] ?? palette.empty;

      lines.push(
        `<rect x="${x}" y="${y}" width="${CELL.size}" height="${CELL.size}" rx="${CELL.radius}" ry="${CELL.radius}" fill="${fill}" />`
      );
    }
  }

  return lines.join("\n    ");
}

/**
 * Compute the overall grid dimensions.
 */
export function gridDimensions(totalWeeks) {
  return {
    width: totalWeeks * CELL.step - CELL.gap,
    height: 7 * CELL.step - CELL.gap,
  };
}
