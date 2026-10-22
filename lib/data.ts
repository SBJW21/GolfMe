import type { Coach, FocusArea, Slot, Video } from "./types";

/**
 * SAMPLE DATA ONLY.
 * These coaches, reviews and prices are placeholders. The site shows them only while the
 * database has no published coaches (see lib/repo.ts).
 */
export const sampleCoaches: Coach[] = [
  {
    slug: "sample-coach-one",
    photo: "/coaches/sample-coach-one.jpg",
    name: "Alex Morgan",
    suburb: "Manly",
    priceCents: 9500,
    yearsCoaching: 12,
    focus: ["Slice", "Driving", "Irons"],
    headline: "Fix your slice and add distance off the tee",
    bio: "Sample profile. Alex works with golfers who are tired of losing the ball right. Lessons start with a short video review of your swing and finish with two or three drills to practise before the next session.",
    reviews: [
      { id: "r1", author: "Sample golfer", rating: 5, date: "2026-09-12", text: "Clear advice and I could see the difference within the hour." },
      { id: "r2", author: "Sample golfer", rating: 4, date: "2026-08-30", text: "Good drills to take away and practise." },
    ],
  },
  {
    slug: "sample-coach-two",
    name: "Jordan Lee",
    suburb: "Bondi",
    priceCents: 12000,
    yearsCoaching: 8,
    focus: ["Chipping", "Bunkers", "Putting"],
    headline: "Short game that saves you strokes",
    bio: "Sample profile. Jordan focuses on the short game, where most golfers lose the most shots. Expect plenty of time on the practice green and a simple routine you can repeat under pressure.",
    reviews: [
      { id: "r3", author: "Sample golfer", rating: 5, date: "2026-09-20", text: "My bunker play went from a worry to a strength." },
    ],
  },
  {
    slug: "sample-coach-three",
    photo: "/coaches/sample-coach-three.jpg",
    name: "Sam Taylor",
    suburb: "Parramatta",
    priceCents: 7500,
    yearsCoaching: 5,
    focus: ["Slice", "Draw", "Course management"],
    headline: "Beginner friendly lessons with no jargon",
    bio: "Sample profile. Sam works with beginners and returning golfers. The aim is to get you hitting the ball solidly and feeling comfortable on the course.",
    reviews: [
      { id: "r4", author: "Sample golfer", rating: 5, date: "2026-10-02", text: "Patient and easy to understand." },
      { id: "r5", author: "Sample golfer", rating: 5, date: "2026-09-04", text: "Great for a complete beginner." },
    ],
  },
  {
    slug: "sample-coach-four",
    name: "Chris Evans",
    suburb: "Chatswood",
    priceCents: 14500,
    yearsCoaching: 18,
    focus: ["Driving", "Irons", "Draw"],
    headline: "Control your ball flight with a reliable draw",
    bio: "Sample profile. Chris coaches low handicap golfers who want more control. Lessons use launch data to build a repeatable shot shape.",
    reviews: [
      { id: "r6", author: "Sample golfer", rating: 5, date: "2026-09-27", text: "Detailed and data driven." },
    ],
  },
  {
    slug: "sample-coach-five",
    name: "Riley Chen",
    suburb: "Mosman",
    priceCents: 10500,
    yearsCoaching: 9,
    focus: ["Putting", "Course management", "Chipping"],
    headline: "Lower scores through smarter decisions",
    bio: "Sample profile. Riley helps golfers play to their strengths, with on-course sessions that cover club selection, targets and putting routines.",
    reviews: [
      { id: "r7", author: "Sample golfer", rating: 4, date: "2026-08-18", text: "Changed how I think about each hole." },
      { id: "r8", author: "Sample golfer", rating: 5, date: "2026-07-29", text: "Practical and friendly." },
    ],
  },
  {
    slug: "sample-coach-six",
    name: "Morgan Reid",
    suburb: "Penrith",
    priceCents: 6500,
    yearsCoaching: 3,
    focus: ["Irons", "Chipping", "Slice"],
    headline: "Affordable lessons for steady improvement",
    bio: "Sample profile. Morgan offers relaxed lessons for golfers who want to improve at a sensible price, with regular check-ins between sessions.",
    reviews: [],
  },
];

export const focusAreas: FocusArea[] = [
  "Slice",
  "Draw",
  "Driving",
  "Irons",
  "Chipping",
  "Bunkers",
  "Putting",
  "Course management",
];

export function suburbsOf(list: Coach[]) {
  return Array.from(new Set(list.map((c) => c.suburb))).sort();
}

export function averageRating(coach: Coach) {
  if (coach.reviews.length === 0) return null;
  const total = coach.reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / coach.reviews.length;
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Today's date in Sydney as year, month (1-12) and day, whatever time zone the server runs in. */
export function sydneyToday() {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

/**
 * Sample availability: weekday early mornings and evenings, weekend mornings.
 * Returns local Sydney times for the next `days` days, starting tomorrow.
 * Real availability will come from each coach's calendar.
 */
export function sampleSlots(slug: string, days = 14): Slot[] {
  const seed = slug.length;
  const slots: Slot[] = [];
  const t = sydneyToday();
  for (let i = 1; i <= days; i++) {
    const d = new Date(Date.UTC(t.y, t.m - 1, t.d + i));
    const day = d.getUTCDay(); // 0 Sunday
    const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    const hours =
      day === 0 || day === 6 ? [8, 9, 10] : [6, 7, 17, 18];
    hours.forEach((h, idx) => {
      // skip some slots so the calendar looks realistic
      if ((i + idx + seed) % 3 === 0) return;
      slots.push({ startsAt: `${date}T${pad(h)}:00`, minutes: 60 });
    });
  }
  return slots;
}

/** Used only if the database has no videos yet. Add real videos in the Supabase "videos" table. */
export const sampleVideos: Video[] = [];

export const videoCategories = [
  "Slices",
  "Draws",
  "Driving",
  "Chipping",
  "Bunkers",
  "Putting",
] as const;
