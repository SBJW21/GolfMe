import { pad, sydneyToday } from "./data";

/** Sample data for the coach hub preview. Replace with real coach data once accounts exist. */
export type HubStudent = {
  id: string;
  name: string;
  suburb: string;
  handicap: string;
  lessons: number;
  goal: string;
  bio: string;
  next: string;
};

export const hubStudents: HubStudent[] = [
  { id: "chloe", name: "Chloe Anderson", suburb: "Manly", handicap: "24.6", lessons: 9, goal: "Cure the slice and break 100 by Christmas", bio: "Plays most weekends with friends. Works in finance, mornings suit her best. Tight right shoulder, fades the ball under pressure.", next: "Sun, 7:00 am" },
  { id: "tom", name: "Tom Wallace", suburb: "Freshwater", handicap: "18.2", lessons: 4, goal: "Consistent iron distances", bio: "Returned to golf last year after a long break. Strong off the tee, inconsistent into the green.", next: "Mon, 6:00 am" },
  { id: "priya", name: "Priya Nair", suburb: "Balgowlah", handicap: "30.0", lessons: 12, goal: "Stop three-putting", bio: "Keen and organised, does her homework. Putting is the focus before a club championship in March.", next: "Wed, 5:00 pm" },
  { id: "ben", name: "Ben Hughes", suburb: "Seaforth", handicap: "No handicap", lessons: 2, goal: "Learn the basics", bio: "Complete beginner, borrowed clubs. Wants to play with his dad over the summer.", next: "Thu, 7:00 am" },
  { id: "aisha", name: "Aisha Khan", suburb: "Dee Why", handicap: "21.4", lessons: 7, goal: "Sharper short game", bio: "Plays twice a week. Loses most shots inside 50 metres.", next: "Sat, 8:00 am" },
];

export type HubLesson = { id: string; time: string; student: string; focus: string; place: string };
export type HubDay = {
  iso: string;
  weekday: string;
  dateNum: number;
  label: string;
  isToday: boolean;
  isPast: boolean;
  lessons: HubLesson[];
};
export type HubWeek = { label: string; days: HubDay[] };

// Weekday index 0 = Monday
const TEMPLATE: Record<number, [string, string, string, string][]> = {
  0: [["6:00 am", "Tom Wallace", "Irons", "Freshwater"]],
  2: [["5:00 pm", "Priya Nair", "Putting", "Balgowlah"]],
  3: [["7:00 am", "Ben Hughes", "Beginner basics", "Seaforth"]],
  5: [["8:00 am", "Aisha Khan", "Short game", "Dee Why"]],
  6: [["7:00 am", "Chloe Anderson", "Slice and driving", "Manly"]],
};

/** Four weeks starting last week, so the calendar can step back one week and forward two. */
export function hubWeeks(): HubWeek[] {
  const t = sydneyToday();
  const today = Date.UTC(t.y, t.m - 1, t.d);
  const dow = (new Date(today).getUTCDay() + 6) % 7;
  const monday = today - dow * 86400000;
  const fmtDay = new Intl.DateTimeFormat("en-AU", { weekday: "short", timeZone: "UTC" });
  const fmtLabel = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", timeZone: "UTC" });
  return [-1, 0, 1, 2].map((w) => {
    const days: HubDay[] = Array.from({ length: 7 }, (_, i) => {
      const ms = monday + (w * 7 + i) * 86400000;
      const d = new Date(ms);
      const lessons: HubLesson[] = (TEMPLATE[i] ?? []).map(([time, student, focus, place], n) => ({
        id: `${w}-${i}-${n}`,
        time,
        student,
        focus,
        place,
      }));
      if (i === 1 && w % 2 === 0) {
        lessons.push({ id: `${w}-${i}-x`, time: "6:00 pm", student: "Tom Wallace", focus: "Driving", place: "Freshwater" });
      }
      return {
        iso: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
        weekday: fmtDay.format(d),
        dateNum: d.getUTCDate(),
        label: fmtLabel.format(d),
        isToday: ms === today,
        isPast: ms < today,
        lessons,
      };
    });
    return { label: `${days[0].label} to ${days[6].label}`, days };
  });
}

export const hubReports = [
  { id: "r1", student: "Priya Nair", when: "Yesterday, 5:00 pm", focus: "Putting" },
  { id: "r2", student: "Tom Wallace", when: "Mon, 6:00 am", focus: "Irons" },
  { id: "r3", student: "Aisha Khan", when: "Sat, 8:00 am", focus: "Short game" },
];

export const hubEarnings = {
  monthLessons: 13,
  monthCents: 123500,
  nextPayout: "1 Nov",
  payouts: [
    { id: "p1", month: "October", lessons: 17, cents: 161500 },
    { id: "p2", month: "September", lessons: 14, cents: 133000 },
    { id: "p3", month: "August", lessons: 11, cents: 104500 },
  ],
};

export const hubLearnVideos = [
  "Slices: gate drill",
  "Slices: grip fix",
  "Driving: tempo",
  "Chipping: landing spot",
  "Bunkers: open face",
  "Putting: gate drill",
];
