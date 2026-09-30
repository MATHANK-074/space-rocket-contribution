// ─────────────────────────────────────────────────────────────
// rocket.js — Small futuristic space-shooter rocket SVG shape.
//             Drawn pointing RIGHT (→) so animateMotion
//             rotate="auto" aligns it with the path.
// ─────────────────────────────────────────────────────────────

/**
 * Return the SVG markup for the rocket.
 * Origin (0,0) is at the rocket's center.
 * Total size ≈ 16 × 10 px — roughly 1.5 cells wide.
 *
 * @param {"light"|"dark"} theme
 * @returns {string}
 */
export function rocketSvg(theme) {
  const isDark = theme === "dark";

  // Slightly brighter body for dark backgrounds
  const body   = isDark ? "#c8d0dc" : "#a0aab8";
  const nose   = "#ef4444";
  const window = "#60a5fa";
  const fin    = isDark ? "#64748b" : "#475569";
  const engine = "#f97316";
  const exCore = "#fbbf24";

  return `
    <!-- exhaust (subtle) -->
    <ellipse cx="-9" cy="0" rx="5" ry="2.2" fill="${engine}" opacity="0.35">
      <animate attributeName="rx" values="5;6.5;5" dur="0.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.35;0.55;0.35" dur="0.4s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="-7.5" cy="0" rx="2.5" ry="1.2" fill="${exCore}" opacity="0.55">
      <animate attributeName="rx" values="2.5;3.5;2.5" dur="0.3s" repeatCount="indefinite" />
    </ellipse>

    <!-- body -->
    <path d="M 7 0 L 3.5 -3.2 L -4 -3.2 L -4 3.2 L 3.5 3.2 Z" fill="${body}" />

    <!-- nose cone -->
    <path d="M 7 0 L 4.5 -2 L 4.5 2 Z" fill="${nose}" />

    <!-- cockpit window -->
    <circle cx="1.5" cy="0" r="1.4" fill="${window}" />
    <circle cx="1" cy="-0.5" r="0.5" fill="#ffffff" opacity="0.5" />

    <!-- top fin -->
    <path d="M -3.5 -3.2 L -5.5 -6 L -5 -3.2 Z" fill="${fin}" />
    <!-- bottom fin -->
    <path d="M -3.5 3.2 L -5.5 6 L -5 3.2 Z" fill="${fin}" />

    <!-- engine nozzle -->
    <rect x="-5.5" y="-2" width="1.8" height="4" rx="0.4" fill="#374151" />
  `.trim();
}
