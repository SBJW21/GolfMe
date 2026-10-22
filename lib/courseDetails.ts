/**
 * Extra facts per course. Only add a field when the club or an official transport source states it.
 * Pages show each section only when the data is here. `source` is the page the facts came from.
 */
export type CourseDetails = {
  bar?: string;
  social?: string;
  parking?: string;
  nearestTrain?: string;
  nearestBus?: string;
  checked?: string; // e.g. "22 October 2026"
  source?: string; // URL
};

export const courseDetails: Record<string, CourseDetails> = {};
