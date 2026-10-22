export type FocusArea =
  | "Slice"
  | "Draw"
  | "Driving"
  | "Irons"
  | "Chipping"
  | "Bunkers"
  | "Putting"
  | "Course management"
  | "General improvement"
  | "Basics";

export type Review = {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string; // ISO date
  text: string;
};

export type CoachGender = "woman" | "man" | "non_binary";

export type Coach = {
  /** Database id. Missing for sample coaches. */
  id?: string;
  slug: string;
  name: string;
  suburb: string;
  /** Role line, for example "Head Professional". */
  title?: string;
  /** Short credentials shown as pills, for example "NDIS Certified". */
  badges?: string[];
  /** A real coach shown as a draft preview. Price, times and details are examples. */
  preview?: boolean;
  /** Lesson price in cents (AUD) for a 60 minute lesson */
  priceCents: number;
  yearsCoaching: number;
  focus: FocusArea[];
  headline: string;
  bio: string;
  /** Path or URL of the coach's photo. Falls back to a holding image. */
  photo?: string;
  gender?: CoachGender;
  levels?: string[];
  reviews: Review[];
};

export type Slot = {
  /** Local Sydney time, format YYYY-MM-DDTHH:mm */
  startsAt: string;
  /** Length in minutes */
  minutes: number;
};

export type VideoCategory =
  | "Slices"
  | "Draws"
  | "Chipping"
  | "Bunkers"
  | "Putting"
  | "Driving";

export type Video = {
  id: string;
  category: VideoCategory;
  title: string;
  /** YouTube video ID, for example dQw4w9WgXcQ */
  youtubeId: string;
};
