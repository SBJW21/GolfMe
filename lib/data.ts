import type { Coach, FocusArea, Slot, Video } from "./types";

/**
 * SAMPLE DATA ONLY.
 * These coaches, reviews and prices are placeholders. The site shows them only while the
 * database has no published coaches (see lib/repo.ts).
 */
export const sampleCoaches: Coach[] = [
  {
    slug: "matt-grenot",
    photo: "/coaches/matt-grenot.jpg",
    preview: true,
    name: "Matt Grenot",
    title: "Head Professional",
    badges: ["NDIS Certified", "20 years experience", "Beginner to advanced"],
    suburb: "Balgowlah",
    priceCents: 9500,
    yearsCoaching: 0,
    focus: ["Slice", "Driving", "Irons", "General improvement", "Basics"],
    headline: "One-on-one golf lessons in Balgowlah",
    bio: "Head Professional in Balgowlah, offering lessons for golfers of all levels.",
    reviews: [
      {
        id: "matt-r1",
        author: "Golf Me student",
        rating: 5,
        date: "2026-10-22",
        text: "Matt taught me in Balgowlah recently and I thoroughly enjoyed his approach to golf. I've had lessons before from 3 to 4 different professionals, but what Matt said to me really resonated. Within 10 to 15 minutes he helped iron out a number of issues with my swing and I was hitting consistent shots. Still in touch today through Golf Me as I perfect my game and work on my handicap.",
      },
    ],
  },
  {
    slug: "sample-coach-two",
    name: "Jordan Lee",
    photo: "/coaches/jordan-lee.jpg",
    suburb: "Bondi",
    priceCents: 12000,
    yearsCoaching: 8,
    focus: ["Chipping", "Bunkers", "Putting", "General improvement"],
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
    focus: ["Driving", "Irons", "Draw", "Basics"],
    headline: "Control your ball flight with a reliable draw",
    bio: "Sample profile. Chris coaches low handicap golfers who want more control. Lessons use launch data to build a repeatable shot shape.",
    reviews: [
      { id: "r6", author: "Sample golfer", rating: 5, date: "2026-09-27", text: "Detailed and data driven." },
    ],
  },
  {
    slug: "sample-coach-five",
    photo: "/coaches/sample-coach-five.jpg",
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
    focus: ["Irons", "Chipping", "Slice", "Basics", "General improvement"],
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
  "General improvement",
  "Basics",
];

const focusPhrases: Record<FocusArea, string> = {
  Slice: "slicing",
  Draw: "shaping a draw",
  Driving: "driving",
  Irons: "iron play",
  Chipping: "chipping",
  Bunkers: "bunker play",
  Putting: "putting",
  "Course management": "course management",
  "General improvement": "general improvement",
  Basics: "the basics",
};

/** For example "slicing, chipping and iron play". No comma before "and". */
export function focusSentence(focus: FocusArea[]) {
  const phrases = focus.map((f) => focusPhrases[f] ?? f.toLowerCase());
  if (phrases.length <= 1) return phrases.join("");
  return `${phrases.slice(0, -1).join(", ")} and ${phrases[phrases.length - 1]}`;
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
