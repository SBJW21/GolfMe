import {
  pad,
  sampleCoaches,
  sampleSlots,
  sampleVideos,
  sydneyToday,
} from "./data";
import { adminClient, publicClient } from "./supabase";
import type { Coach, CoachGender, FocusArea, Review, Slot, Video, VideoCategory } from "./types";

/**
 * Data access for the site. Reads from Supabase when it is connected and has published
 * coaches. Otherwise falls back to the sample data so the site never looks empty.
 */

type CoachRow = {
  id: string;
  slug: string;
  name: string;
  suburb: string;
  headline: string | null;
  bio: string | null;
  years_coaching: number | null;
  price_cents: number;
  focus: string[] | null;
  gender: CoachGender | null;
  levels: string[] | null;
};

type ReviewRow = {
  id: string;
  coach_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  author_first_name: string | null;
};

type VideoRow = {
  id: string;
  category: string;
  title: string;
  youtube_id: string;
};

export async function loadCoaches(): Promise<{ coaches: Coach[]; isSample: boolean }> {
  const db = publicClient();
  if (db) {
    const [coachRes, reviewRes] = await Promise.all([
      db.from("public_coaches").select("*"),
      db.from("public_reviews").select("*").order("created_at", { ascending: false }),
    ]);

    if (coachRes.error) {
      console.error("Could not load coaches from Supabase:", coachRes.error.message);
    } else if (coachRes.data && coachRes.data.length > 0) {
      const reviews = (reviewRes.data ?? []) as ReviewRow[];
      const coaches = (coachRes.data as CoachRow[]).map((row): Coach => {
        const mine: Review[] = reviews
          .filter((r) => r.coach_id === row.id)
          .map((r) => ({
            id: r.id,
            author: r.author_first_name || "Golfer",
            rating: r.rating,
            date: r.created_at,
            text: r.comment ?? "",
          }));
        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          suburb: row.suburb,
          priceCents: row.price_cents,
          yearsCoaching: row.years_coaching ?? 0,
          focus: (row.focus ?? []) as FocusArea[],
          headline: row.headline ?? "",
          bio: row.bio ?? "",
          gender: row.gender ?? undefined,
          levels: row.levels ?? [],
          reviews: mine,
        };
      });
      return { coaches, isSample: false };
    }
  }
  return { coaches: sampleCoaches, isSample: true };
}

export async function getCoach(slug: string) {
  const { coaches, isSample } = await loadCoaches();
  const coach = coaches.find((c) => c.slug === slug);
  return coach ? { coach, isSample } : null;
}

/** Sydney local time string (YYYY-MM-DDTHH:mm) for a timestamp. */
function toSydneyLocal(iso: string) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

type RuleRow = { weekday: number; start_time: string; end_time: string };

/**
 * Open lesson times for the next 14 days. Built from the coach's weekly availability,
 * minus anything already booked. Sample coaches use generated sample slots.
 */
export async function getSlots(coach: Coach, days = 14): Promise<Slot[]> {
  if (!coach.id) return sampleSlots(coach.slug, days);

  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("public_availability")
    .select("weekday,start_time,end_time")
    .eq("coach_id", coach.id);
  if (error || !data) {
    console.error("Could not load availability:", error?.message);
    return [];
  }

  // Which times are already taken. Needs the server-only key because bookings are private.
  const taken = new Set<string>();
  const admin = adminClient();
  if (admin) {
    const from = new Date();
    const to = new Date(Date.now() + (days + 2) * 86400000);
    const { data: booked } = await admin
      .from("bookings")
      .select("starts_at")
      .eq("coach_id", coach.id)
      .in("status", ["pending", "confirmed", "completed"])
      .gte("starts_at", from.toISOString())
      .lte("starts_at", to.toISOString());
    for (const b of booked ?? []) taken.add(toSydneyLocal(b.starts_at as string));
  }

  const t = sydneyToday();
  const nowLocal = toSydneyLocal(new Date().toISOString());
  const slots: Slot[] = [];
  for (let i = 0; i <= days; i++) {
    const d = new Date(Date.UTC(t.y, t.m - 1, t.d + i));
    const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    for (const rule of data as RuleRow[]) {
      if (rule.weekday !== d.getUTCDay()) continue;
      const startH = Number(rule.start_time.slice(0, 2));
      const endMinutes = Number(rule.end_time.slice(0, 2)) * 60 + Number(rule.end_time.slice(3, 5));
      for (let h = startH; h * 60 + 60 <= endMinutes; h++) {
        const startsAt = `${date}T${pad(h)}:00`;
        // The slot must be in the future and not already booked.
        if (startsAt <= nowLocal || taken.has(startsAt)) continue;
        slots.push({ startsAt, minutes: 60 });
      }
    }
  }
  slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return slots;
}

export async function loadVideos(): Promise<Video[]> {
  const db = publicClient();
  if (db) {
    const { data, error } = await db
      .from("videos")
      .select("*")
      .order("sort", { ascending: true });
    if (error) {
      console.error("Could not load videos:", error.message);
    } else if (data && data.length > 0) {
      return (data as VideoRow[]).map((v) => ({
        id: v.id,
        category: v.category as VideoCategory,
        title: v.title,
        youtubeId: v.youtube_id,
      }));
    }
  }
  return sampleVideos;
}
