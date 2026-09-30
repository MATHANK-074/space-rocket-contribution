// ─────────────────────────────────────────────────────────────
// github.js — Fetch real GitHub contribution data
// ─────────────────────────────────────────────────────────────

/**
 * Fetch contribution calendar from GitHub GraphQL API.
 *
 * @param {string}  username  GitHub username
 * @param {string}  token     GitHub token (PAT or GITHUB_TOKEN from Actions)
 * @returns {Promise<Array<{date:string, count:number, level:number, weekday:number}>>}
 */
export async function fetchContributions(username, token) {
  const query = `query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
              weekday
            }
          }
        }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "space-rocket-contribution/1.0",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  const calendar = json.data.user.contributionsCollection.contributionCalendar;
  const days = [];

  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      days.push({
        date: day.date,
        count: day.contributionCount,
        level: colorToLevel(day.color),
        weekday: day.weekday,
      });
    }
  }

  console.log(`  Fetched ${days.length} days, ${calendar.totalContributions} total contributions`);
  return days;
}

/**
 * Map GitHub's hex color to a 0–4 intensity level.
 */
function colorToLevel(hex) {
  const map = {
    "#ebedf0": 0, "#9be9a8": 1, "#40c463": 2, "#30a14e": 3, "#216e39": 4,
    "#161b22": 0, "#0e4429": 1, "#006d32": 2, "#26a641": 3, "#39d353": 4,
  };
  return map[hex?.toLowerCase()] ?? guessLevel(hex);
}

function guessLevel(hex) {
  if (!hex) return 0;
  // Fallback: parse lightness
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lightness = (r + g + b) / 3;
  if (lightness < 30) return 0;
  if (lightness < 80) return 1;
  if (lightness < 130) return 2;
  if (lightness < 180) return 3;
  return 4;
}
