import { pad, sydneyToday } from "./data";

export type Round = {
  id: string;
  course: string;
  date: string; // YYYY-MM-DD
  score: number;
  par: number;
  withFriends: string[];
  putts?: number;
  points?: number; // Stableford points, when scored hole by hole
  friendScores?: Record<string, number>;
};

/** A generic par 72 layout used until we hold each course's real card. */
export const defaultPars = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 3, 4, 4, 5];
export const defaultStrokeIndex = [7, 11, 17, 1, 9, 13, 15, 5, 3, 8, 18, 12, 2, 10, 16, 14, 6, 4];

/** Stableford points for one hole. Shots received follow the stroke index. */
export function holePoints(strokes: number, par: number, si: number, handicap: number) {
  if (!strokes) return 0;
  const hc = Math.round(handicap);
  const received = Math.floor(hc / 18) + (si <= hc % 18 ? 1 : 0);
  return Math.max(0, 2 + par - (strokes - received));
}

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
  const rows: [number, string, number, string[], number, Record<string, number>][] = [
    [1, "Balgowlah Golf Club", 98, ["Jess"], 34, { Jess: 94 }],
    [8, "Long Reef Golf Club", 101, [], 36, {}],
    [15, "Moore Park Golf", 104, ["Tom"], 37, { Tom: 99 }],
    [22, "Balgowlah Golf Club", 103, ["Jess", "Priya"], 35, { Jess: 96, Priya: 108 }],
    [29, "Cammeray Golf Club", 108, [], 38, {}],
    [57, "Bondi Golf Club", 111, ["Tom"], 38, { Tom: 102 }],
    [64, "Moore Park Golf", 109, [], 37, {}],
    [92, "Balgowlah Golf Club", 114, ["Priya"], 39, { Priya: 110 }],
  ];
  return rows.map(([ago, course, score, withFriends, putts, friendScores], i) => ({
    id: `r${i}`,
    course,
    date: iso(ago),
    score,
    par: 72,
    withFriends,
    putts,
    friendScores,
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

export const milestones = [
  { weeks: 2, name: "Off the tee" },
  { weeks: 4, name: "Fairway" },
  { weeks: 8, name: "On the green" },
  { weeks: 12, name: "Birdie run" },
  { weeks: 26, name: "Eagle" },
  { weeks: 52, name: "Hole in one" },
];

export function milestoneProgress(streak: number) {
  const earned = milestones.filter((m) => streak >= m.weeks);
  const next = milestones.find((m) => streak < m.weeks) ?? null;
  const prev = earned[earned.length - 1]?.weeks ?? 0;
  const pct = next ? Math.round(((streak - prev) / (next.weeks - prev)) * 100) : 100;
  return { earned, next, pct, toGo: next ? next.weeks - streak : 0 };
}
