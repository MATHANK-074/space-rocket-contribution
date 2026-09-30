// ─────────────────────────────────────────────────────────────
// rocket.js — Small flat space-shooter rocket SVG shape.
//             Drawn pointing UP (↑)
// ─────────────────────────────────────────────────────────────

/**
 * Return the SVG markup for the simple flat rocket.
 * Origin (0,0) is roughly the center of the rocket body.
 *
 * @param {"light"|"dark"} theme
 * @returns {string}
 */
export function rocketSvg(theme) {
  const isDark = theme === "dark";

  // Flat colors
  const body   = isDark ? "#c8d0dc" : "#a0aab8";
  const nose   = "#ef4444";
  const window = "#60a5fa";
  const fin    = isDark ? "#64748b" : "#475569";
  const engine = "#f97316";

  return `
    <!-- Exhaust glow / flame -->
    <ellipse cx="0" cy="11" rx="2" ry="4" fill="${engine}" opacity="0.8">
      <animate attributeName="ry" values="3; 5; 3" dur="0.2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6; 1; 0.6" dur="0.2s" repeatCount="indefinite" />
    </ellipse>

    <!-- Engine nozzle -->
    <rect x="-2" y="8" width="4" height="2" rx="0.5" fill="#374151" />

    <!-- Left Fin -->
    <path d="M -3 3 L -6 7 L -6 9 L -2 7 Z" fill="${fin}" />
    <!-- Right Fin -->
    <path d="M 3 3 L 6 7 L 6 9 L 2 7 Z" fill="${fin}" />

    <!-- Main Body -->
    <path d="M -3 -4 C -3 -4, -3 2, -3 8 L 3 8 C 3 2, 3 -4, 3 -4 Z" fill="${body}" />

    <!-- Nose Cone -->
    <path d="M -3 -4 L 0 -9 L 3 -4 Z" fill="${nose}" />

    <!-- Window -->
    <circle cx="0" cy="-1.5" r="1.5" fill="${window}" />
    <circle cx="-0.5" cy="-2" r="0.5" fill="#ffffff" opacity="0.6" />
  `.trim();
}

/**
 * Return the SVG markup for a simple flat projectile.
 */
export function projectileSvg(theme) {
  const color = theme === "dark" ? "#38bdf8" : "#0284c7";
  
  return `
    <!-- Thin simple laser -->
    <rect x="-0.5" y="-4" width="1" height="8" rx="0.5" fill="${color}" />
  `.trim();
}
