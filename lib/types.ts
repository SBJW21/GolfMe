export type FocusArea =
  | "Slice"
  | "Draw"
  | "Driving"
  | "Irons"
  | "Chipping"
  | "Bunkers"
  | "Putting"
  | "Course management";

export type Review = {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string; // ISO date
  text: string;
};

export type Coach = {
  slug: string;
  name: string;
  suburb: string;
  /** Lesson price in cents (AUD) for a 60 minute lesson */
  priceCents: number;
  yearsCoaching: number;
  focus: FocusArea[];
  headline: string;
  bio: string;
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
