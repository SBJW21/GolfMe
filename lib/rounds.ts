import { pad, sydneyToday } from "./data";

export type Round = {
  id: string;
  course: string;
  date: string; // YYYY-MM-DD
  score: number;
  par: number;
  withFriends: string[];
};

export type Friend = { id: string; name: string; weeks: number; lastCourse: string; lastScore: number };

export const sampleCourses = [
  "Moore Park Golf",
  "Balgowlah Golf Club",
  "Long Reef Golf Club",
  "Bondi Golf Club",
  "Cammeray Golf Club",
  "Manly Golf Club",
  "Lane Cove Golf Club",
  "Rose Bay Par 3",
];

function iso(daysAgo: number) {
  const t = sydneyToday();
  const d = new Date(Date.UTC(t.y, t.m - 1, t.d - daysAgo));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Five straight weeks, then a gap, then a few older rounds. Relative to today. */
export function sampleRounds(): Round[] {
  const rows: [number, string, number, string[]][] = [
    [1, "Balgowlah Golf Club", 98, ["Jess"]],
    [8, "Long Reef Golf Club", 101, []],
    [15, "Moore Park Golf", 104, ["Tom"]],
    [22, "Balgowlah Golf Club", 103, ["Jess", "Priya"]],
    [29, "Cammeray Golf Club", 108, []],
    [57, "Bondi Golf Club", 111, ["Tom"]],
    [64, "Moore Park Golf", 109, []],
    [92, "Balgowlah Golf Club", 114, ["Priya"]],
  ];
  return rows.map(([ago, course, score, withFriends], i) => ({
    id: `r${i}`,
    course,
    date: iso(ago),
    score,
    par: 72,
    withFriends,
  }));
}

export const sampleFriends: Friend[] = [
  { id: "jess", name: "Jess", weeks: 7, lastCourse: "Balgowlah Golf Club", lastScore: 94 },
  { id: "tom", name: "Tom", weeks: 3, lastCourse: "Moore Park Golf", lastScore: 99 },
  { id: "priya", name: "Priya", weeks: 1, lastCourse: "Balgowlah Golf Club", lastScore: 106 },
];

/** Monday of the week containing the date, as a day number. */
export function weekIndex(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  return Math.floor((day + 3) / 7); // 1 Jan 1970 was a Thursday, so +3 aligns weeks to Monday
}

export function todayIso() {
  return iso(0);
}

/**
 * Weekly streak. Counts back from this week. If nothing is logged yet this week the streak
 * is still alive, counted from last week, and `atRisk` is true.
 */
export function streakInfo(rounds: Round[], today = todayIso()) {
  const played = new Set(rounds.map((r) => weekIndex(r.date)));
  const now = weekIndex(today);
  const playedThisWeek = played.has(now);
  let w = playedThisWeek ? now : now - 1;
  let current = 0;
  while (played.has(w)) {
    current++;
    w--;
  }
  const sorted = [...played].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  sorted.forEach((x, i) => {
    run = i > 0 && sorted[i - 1] === x - 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });
  const tiles = Array.from({ length: 12 }, (_, i) => {
    const idx = now - 11 + i;
    return { idx, played: played.has(idx), current: idx === now };
  });
  return { current, best, playedThisWeek, atRisk: !playedThisWeek && current > 0, tiles };
}
