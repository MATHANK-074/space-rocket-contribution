// ─────────────────────────────────────────────────────────────
// contribution.js — Parse + normalize contribution data into
//                    a grid structure (weeks × days).
// ─────────────────────────────────────────────────────────────

/**
 * Convert a flat array of day objects into a 2-D grid.
 *
 * @param {Array<{date:string, count:number, level:number, weekday:number}>} days
 * @returns {{ weeks: Array<Array<{date:string, count:number, level:number}>>, totalWeeks:number }}
 */
export function buildGrid(days) {
  // Group days into weeks (7 days each).
  // GitHub contribution data already comes in chronological week order,
  // but we normalise to make sure.
  const weeks = [];
  let currentWeek = [];

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    // Pad the last partial week
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: 0, weekday: currentWeek.length });
    }
    weeks.push(currentWeek);
  }

  return { weeks, totalWeeks: weeks.length };
}

/**
 * Generate realistic demo contribution data (for offline / CI testing).
 * Mimics a full year: 52 weeks × 7 days.
 */
export function generateDemoData() {
  const days = [];
  const now = new Date();
  const oneDay = 86400000;
  // Go back ~364 days to start on a Sunday
  const startOffset = 364;
  const start = new Date(now.getTime() - startOffset * oneDay);
  // Align to Sunday
  start.setDate(start.getDate() - start.getDay());

  // Seed-able pseudo-random for reproducibility
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 52 * 7; i++) {
    const d = new Date(start.getTime() + i * oneDay);
    const weekIndex = Math.floor(i / 7);

    // Create natural-looking activity patterns
    let level;
    const r = rand();
    // Higher activity in middle of the year + recent weeks
    const yearProgress = weekIndex / 52;
    const activityBoost =
      (yearProgress > 0.3 && yearProgress < 0.7 ? 0.15 : 0) +
      (yearProgress > 0.8 ? 0.2 : 0);

    // Weekdays are more active
    const dayOfWeek = i % 7;
    const weekdayBoost = dayOfWeek >= 1 && dayOfWeek <= 5 ? 0.1 : 0;

    const threshold = r + activityBoost + weekdayBoost;

    if (threshold < 0.30) level = 0;
    else if (threshold < 0.55) level = 1;
    else if (threshold < 0.75) level = 2;
    else if (threshold < 0.90) level = 3;
    else level = 4;

    const counts = [0, 2, 5, 9, 14];

    days.push({
      date: d.toISOString().slice(0, 10),
      count: counts[level] + Math.floor(rand() * 3),
      level,
      weekday: dayOfWeek,
    });
  }

  return days;
}
