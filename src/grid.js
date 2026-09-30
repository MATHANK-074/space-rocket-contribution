// ─────────────────────────────────────────────────────────────
// grid.js — Render the contribution grid as SVG elements.
// ─────────────────────────────────────────────────────────────

/** Cell dimensions */
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
 * Extract target cells (level >= 2) spread out across the grid.
 */
export function getTargetCells(grid, count) {
  const candidates = [];
  for (let w = 0; w < grid.weeks.length; w++) {
    for (let d = 0; d < grid.weeks[w].length; d++) {
      if (grid.weeks[w][d].level >= 2) {
        candidates.push({ w, d, level: grid.weeks[w][d].level });
      }
    }
  }

  const targets = [];
  const chunkSize = Math.floor(grid.weeks.length / count);
  
  for(let i = 0; i < count; i++) {
    const chunkStart = i * chunkSize;
    const chunkEnd = (i === count - 1) ? grid.weeks.length : (i + 1) * chunkSize;
    const chunkCandidates = candidates.filter(c => c.w >= chunkStart && c.w < chunkEnd);
    
    if (chunkCandidates.length > 0) {
      const pick = chunkCandidates[Math.floor(Math.random() * chunkCandidates.length)];
      targets.push(pick);
    }
  }
  return targets;
}

/**
 * Render the flat contribution grid cells.
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
        `<g class="cell" data-w="${w}" data-d="${d}" transform="translate(${x}, ${y})">
          <rect width="${CELL.size}" height="${CELL.size}" rx="${CELL.radius}" fill="${fill}" />
          <!-- Hit overlay for animation -->
          <rect class="hit-overlay" width="${CELL.size}" height="${CELL.size}" rx="${CELL.radius}" fill="#ffffff" opacity="0" />
        </g>`
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
