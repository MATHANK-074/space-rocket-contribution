// ─────────────────────────────────────────────────────────────
// rocket.js — 3D futuristic space-shooter rocket SVG shape.
//             Drawn pointing UP (↑)
// ─────────────────────────────────────────────────────────────

/**
 * Return the SVG markup for the 3D rocket.
 * Origin (0,0) is roughly the center of the rocket body.
 *
 * @param {"light"|"dark"} theme
 * @returns {string}
 */
export function rocketSvg(theme) {
  const isDark = theme === "dark";

  // 3D gradients and colors
  const bodyLeft = isDark ? "#94a3b8" : "#cbd5e1";
  const bodyRight = isDark ? "#475569" : "#64748b";
  const bodyCenter = isDark ? "#e2e8f0" : "#ffffff";
  const nose = "#ef4444";
  const noseDark = "#991b1b";
  const window = "#38bdf8";
  const finLight = isDark ? "#64748b" : "#94a3b8";
  const finDark = isDark ? "#334155" : "#475569";
  const engine = "#f97316";

  return `
    <defs>
      <!-- Body Gradient for 3D cylinder effect -->
      <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${bodyLeft}" />
        <stop offset="30%" stop-color="${bodyCenter}" />
        <stop offset="100%" stop-color="${bodyRight}" />
      </linearGradient>

      <!-- Nose Gradient -->
      <linearGradient id="rocketNoseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${nose}" />
        <stop offset="100%" stop-color="${noseDark}" />
      </linearGradient>

      <!-- Fin Gradient -->
      <linearGradient id="rocketFinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${finLight}" />
        <stop offset="100%" stop-color="${finDark}" />
      </linearGradient>
    </defs>

    <!-- Engine nozzle (darker underneath) -->
    <path d="M -2.5 8 L 2.5 8 L 3.5 11 L -3.5 11 Z" fill="#1e293b" />
    <path d="M -2 11 L 2 11 L 2.5 12 L -2.5 12 Z" fill="#0f172a" />

    <!-- Exhaust glow / flame -->
    <ellipse cx="0" cy="14" rx="2" ry="4" fill="${engine}" opacity="0.8">
      <animate attributeName="ry" values="4; 6; 4" dur="0.2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8; 1; 0.8" dur="0.2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="0" cy="13" rx="1" ry="2" fill="#fef08a">
      <animate attributeName="ry" values="2; 3; 2" dur="0.15s" repeatCount="indefinite" />
    </ellipse>

    <!-- Left Fin -->
    <path d="M -3 3 L -7 7 L -7 9 L -2 7 Z" fill="url(#rocketFinGrad)" />
    <!-- Right Fin -->
    <path d="M 3 3 L 7 7 L 7 9 L 2 7 Z" fill="url(#rocketFinGrad)" />

    <!-- Main Body (Cylinder) -->
    <path d="M -3 -4 C -3 -4, -4 2, -3 8 L 3 8 C 4 2, 3 -4, 3 -4 Z" fill="url(#rocketBodyGrad)" />

    <!-- Nose Cone -->
    <path d="M -3 -4 C -3 -4, 0 -10, 0 -12 C 0 -10, 3 -4, 3 -4 Z" fill="url(#rocketNoseGrad)" />

    <!-- Window -->
    <ellipse cx="0" cy="-1" rx="1.5" ry="2" fill="${window}" />
    <ellipse cx="-0.5" cy="-1.5" rx="0.5" ry="0.8" fill="#ffffff" opacity="0.6" />
    
    <!-- Subtle bottom shadow on body -->
    <path d="M -3 7 C -1 8.5, 1 8.5, 3 7 L 3 8 C 1 9.5, -1 9.5, -3 8 Z" fill="#000000" opacity="0.2" />
  `.trim();
}

/**
 * Return the SVG markup for the 3D projectile.
 */
export function projectileSvg(theme) {
  const color = theme === "dark" ? "#22d3ee" : "#0284c7";
  const glow = theme === "dark" ? "#a5f3fc" : "#7dd3fc";
  
  return `
    <defs>
      <linearGradient id="projGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.5" />
        <stop offset="50%" stop-color="${glow}" stop-opacity="1" />
        <stop offset="100%" stop-color="${color}" stop-opacity="0.5" />
      </linearGradient>
    </defs>
    <!-- Projectile body -->
    <rect x="-1" y="-4" width="2" height="8" rx="1" fill="url(#projGrad)" />
    <!-- Core highlight -->
    <rect x="-0.3" y="-3" width="0.6" height="6" rx="0.3" fill="#ffffff" />
  `.trim();
}
