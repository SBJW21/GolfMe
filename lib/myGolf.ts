import { pad, sydneyToday } from "./data";

/** Sample student used to show what a My Golf page looks like. Replace with real account data later. */
export const sampleStudent = {
  name: "Chloe Anderson",
  email: "chloe.anderson@example.com",
  phone: "0400 000 000",
  suburb: "Manly, NSW",
  handicap: "24.6",
  memberSince: "March 2026",
  goal: "Cure my slice and break 100 by Christmas",
};

export const sampleStats = {
  lessonsDone: 9,
  lessonsUpcoming: 3,
  hoursCoached: 9,
  totalSpentCents: 91500,
};

export const sampleCoachesWorkedWith = [
  { slug: "matt-grenot", name: "Matt Grenot", title: "Head Professional", suburb: "Balgowlah", photo: "/coaches/matt-grenot.jpg", lessons: 6 },
  { slug: "sample-coach-two", name: "Jordan Lee", title: "", suburb: "Bondi", photo: "/coaches/jordan-lee.jpg", lessons: 3 },
];

export type Appointment = {
  id: string;
  coachName: string;
  coachSlug: string;
  coachPhoto: string;
  focus: string;
  place: string;
  time: string;
  dateLabel: string;
  weekday: string;
  priceCents: number;
  past: boolean;
  reportHref?: string;
};

function dayOffset(offset: number) {
  const t = sydneyToday();
  const d = new Date(Date.UTC(t.y, t.m - 1, t.d + offset));
  return {
    iso: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    weekday: new Intl.DateTimeFormat("en-AU", { weekday: "short", timeZone: "UTC" }).format(d),
    label: new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", timeZone: "UTC" }).format(d),
  };
}

const REPORT = "/sample/lesson-report-sample.pdf";

/** Three upcoming then three past, always relative to today in Sydney. */
export function sampleAppointments(): Appointment[] {
  const matt = { coachName: "Matt Grenot", coachSlug: "matt-grenot", coachPhoto: "/coaches/matt-grenot.jpg", priceCents: 9500 };
  const jordan = { coachName: "Jordan Lee", coachSlug: "sample-coach-two", coachPhoto: "/coaches/jordan-lee.jpg", priceCents: 12000 };
  const rows: [number, string, typeof matt, string, string, boolean, boolean][] = [
    [3, "7:00 am", matt, "Slice and driving", "Balgowlah", false, false],
    [10, "8:00 am", jordan, "Bunkers and chipping", "Bondi", false, false],
    [17, "7:00 am", matt, "Irons", "Balgowlah", false, false],
    [-4, "7:00 am", matt, "Slice and driving", "Balgowlah", true, true],
    [-11, "9:00 am", jordan, "Short game", "Bondi", true, false],
    [-18, "6:00 pm", matt, "Grip and stance", "Balgowlah", true, true],
  ];
  return rows.map(([off, time, c, focus, place, past, report], i) => {
    const d = dayOffset(off);
    return {
      id: `a${i}`,
      ...c,
      focus,
      place,
      time,
      dateLabel: d.label,
      weekday: d.weekday,
      past,
      reportHref: report ? REPORT : undefined,
    };
  });
}

export const sampleMattVideos = [
  { id: "v1", title: "Your slice: gate drill walkthrough", date: "14 Oct", length: "2:41" },
  { id: "v2", title: "Driver tempo and the three-count", date: "14 Oct", length: "1:58" },
  { id: "v3", title: "Swing review: down the line", date: "7 Oct", length: "3:12" },
  { id: "v4", title: "Grip check and setup", date: "30 Sep", length: "2:05" },
];

export const sampleReports = [
  { id: "r1", title: "Lesson report: slice and driving", date: "14 Oct", coach: "Matt Grenot", href: REPORT },
  { id: "r2", title: "Lesson report: grip and stance", date: "30 Sep", coach: "Matt Grenot", href: REPORT },
];

export const samplePayments = [
  { id: "p1", date: "14 Oct", item: "Lesson with Matt Grenot", cents: 9500 },
  { id: "p2", date: "7 Oct", item: "Lesson with Jordan Lee", cents: 12000 },
  { id: "p3", date: "30 Sep", item: "Lesson with Matt Grenot", cents: 9500 },
  { id: "p4", date: "23 Sep", item: "Lesson with Matt Grenot", cents: 9500 },
];
