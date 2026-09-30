// ─────────────────────────────────────────────────────────────
// svg.js — Assemble the complete animated SVG document.
// ─────────────────────────────────────────────────────────────

import { renderGrid, gridDimensions, CELL, PALETTE, getTargetCells } from "./grid.js";
import { rocketSvg, projectileSvg } from "./rocket.js";

/**
 * Generate a self-contained animated SVG string.
 */
export function buildSvg(grid, theme) {
  const palette = PALETTE[theme];

  // Layout
  const paddingX = 20;
  const paddingYTop = 20;
  const paddingYBottom = 40; // Extra room for rocket below grid
  const { width: gw, height: gh } = gridDimensions(grid.totalWeeks);
  const originX = paddingX;
  const originY = paddingYTop;
  
  const svgW = gw + paddingX * 2;
  const svgH = gh + paddingYTop + paddingYBottom;

  // Select target cells for the rocket to shoot
  const targets = getTargetCells(grid, 4); 
  if (targets.length === 0) {
    targets.push({ w: Math.floor(grid.totalWeeks / 2), d: 3, level: 2 });
  }

  // Animation configuration
  const TOTAL_DURATION = targets.length * 2.5; // 2.5 seconds per target cycle
  
  // Build SMIL keyframes for rocket position and projectile
  const rocketKeyTimes = [];
  const rocketValuesX = [];
  const rocketValuesY = [];
  
  const projectileAnimations = [];
  const targetHighlightAnimations = [];

  const rocketBaseY = originY + gh + 15;

  targets.forEach((target, index) => {
    // Each target gets a 2.5-second window (0 to 1 in normalized time)
    const startTime = index / targets.length;
    const durFraction = 1 / targets.length;
    
    const tMoveStart = startTime;
    const tMoveEnd = startTime + durFraction * 0.3;
    const tShootPeak = startTime + durFraction * 0.4;
    const tShootEnd = startTime + durFraction * 0.6;
    
    // Target position in pixels
    const targetX = originX + target.w * CELL.step + CELL.size / 2;
    const targetY = originY + target.d * CELL.step + CELL.size / 2;
    
    // Previous target X for movement
    const prevTarget = index === 0 ? targets[targets.length - 1] : targets[index - 1];
    const prevX = originX + prevTarget.w * CELL.step + CELL.size / 2;

    rocketKeyTimes.push(
      tMoveStart.toFixed(3), 
      tMoveEnd.toFixed(3), 
      tShootPeak.toFixed(3), 
      tShootEnd.toFixed(3)
    );
    
    rocketValuesX.push(
      `${prevX}`, 
      `${targetX}`, 
      `${targetX}`, 
      `${targetX}`
    );
    
    rocketValuesY.push(
      `${rocketBaseY}`, 
      `${rocketBaseY}`, 
      `${rocketBaseY - 3}`, // tiny bump up
      `${rocketBaseY}`
    );

    // Projectile Animation (visible only during shooting)
    const pStart = tMoveEnd;
    const pEnd = pStart + (durFraction * 0.15); // Travels fast
    
    projectileAnimations.push(`
      <g opacity="0" transform="translate(${targetX}, ${rocketBaseY})">
        ${projectileSvg(theme)}
        <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; ${pStart}; ${pEnd}; 1" dur="${TOTAL_DURATION}s" repeatCount="indefinite" />
        <animate attributeName="transform" values="translate(${targetX}, ${rocketBaseY}); translate(${targetX}, ${rocketBaseY}); translate(${targetX}, ${targetY}); translate(${targetX}, ${targetY})" keyTimes="0; ${pStart}; ${pEnd}; 1" dur="${TOTAL_DURATION}s" repeatCount="indefinite" />
      </g>
    `);
    
    // Target Highlight Animation
    const hStart = pEnd;
    const hEnd = pEnd + (durFraction * 0.15);
    
    targetHighlightAnimations.push(`
      <style>
        .cell[data-w="${target.w}"][data-d="${target.d}"] .hit-overlay {
          animation: hit${index} ${TOTAL_DURATION}s infinite;
        }
        @keyframes hit${index} {
          0%, ${hStart * 100}%, ${hEnd * 100}%, 100% { opacity: 0; }
          ${(hStart + 0.02) * 100}% { opacity: 0.8; }
        }
      </style>
    `);
  });

  rocketKeyTimes.push("1.000");
  rocketValuesX.push(`${rocketValuesX[0]}`);
  rocketValuesY.push(`${rocketBaseY}`);

  const gridCells = renderGrid(grid, theme, originX, originY);
  const rocket = rocketSvg(theme);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${svgW} ${svgH}"
  width="${svgW}"
  height="${svgH}"
  role="img"
  aria-label="GitHub contribution graph with space rocket animation"
>
  <title>GitHub contribution space rocket animation</title>
  ${targetHighlightAnimations.join("\n  ")}

  <!-- Background -->
  <rect width="${svgW}" height="${svgH}" rx="6" fill="${palette.bg}" />

  <!-- Contribution grid -->
  <g id="grid">
    ${gridCells}
  </g>

  <!-- Projectiles -->
  ${projectileAnimations.join("\n  ")}

  <!-- Rocket -->
  <g id="rocket">
    ${rocket}
    <animate 
      attributeName="transform" 
      type="translate"
      values="${rocketValuesX.map((x, i) => `translate(${x}, ${rocketValuesY[i]})`).join('; ')}"
      keyTimes="${rocketKeyTimes.join('; ')}"
      calcMode="spline"
      keySplines="${Array(rocketKeyTimes.length - 1).fill("0.4 0 0.6 1").join('; ')}"
      dur="${TOTAL_DURATION}s" 
      repeatCount="indefinite" 
    />
  </g>

</svg>`;
}
