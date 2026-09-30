// ─────────────────────────────────────────────────────────────
// grid.js — Render the contribution grid as SVG elements with
//           subtle 3D depth (bottom/right borders).
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
    shadow: "rgba(27,31,35,0.06)",
    highlight: "rgba(255,255,255,0.4)"
  },
  dark: {
    bg: "#0d1117",
    empty: "#161b22",
    levels: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    shadow: "rgba(1,4,9,0.8)",
    highlight: "rgba(255,255,255,0.1)"
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

  // Shuffle slightly but keep chronological order mostly
  // Let's divide into `count` chunks and pick one random from each chunk
  const targets = [];
  const chunkSize = Math.floor(grid.weeks.length / count);
  
  for(let i=0; i<count; i++) {
    const chunkStart = i * chunkSize;
    const chunkEnd = (i === count-1) ? grid.weeks.length : (i + 1) * chunkSize;
    const chunkCandidates = candidates.filter(c => c.w >= chunkStart && c.w < chunkEnd);
    
    if (chunkCandidates.length > 0) {
      // Pick one randomly
      const pick = chunkCandidates[Math.floor(Math.random() * chunkCandidates.length)];
      targets.push(pick);
    }
  }
  return targets;
}

/**
 * Render the contribution grid cells.
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

      // Render cell with subtle 3D border
      // We use a base rect, and two small inset paths for shadow/highlight
      lines.push(
        `<g class="cell" data-w="${w}" data-d="${d}" transform="translate(${x}, ${y})">
          <rect width="${CELL.size}" height="${CELL.size}" rx="${CELL.radius}" fill="${fill}" />
          <!-- Inner bottom-right shadow -->
          <path d="M 0 ${CELL.size - CELL.radius} A ${CELL.radius} ${CELL.radius} 0 0 0 ${CELL.radius} ${CELL.size} L ${CELL.size} ${CELL.size} L ${CELL.size} ${CELL.radius} A ${CELL.radius} ${CELL.radius} 0 0 0 ${CELL.size - CELL.radius} 0 L ${CELL.size} 0 L ${CELL.size} ${CELL.size} L 0 ${CELL.size} Z" fill="${palette.shadow}" opacity="0.6" />
          <!-- Inner top-left highlight -->
          <path d="M 0 ${CELL.size - CELL.radius} L 0 0 L ${CELL.size - CELL.radius} 0 A ${CELL.radius} ${CELL.radius} 0 0 0 0 ${CELL.radius} Z" fill="${palette.highlight}" opacity="0.3" />
          
          <!-- Animation element injected via CSS/SMIL later if targeted -->
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
