"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listReviews, deleteReview, type Review } from "@/lib/reviewStore";

const SAMPLES = [
  {
    title: "Driver swing, down the line",
    kind: "Video with voiceover and drawings",
    coach: "Matt Grenot",
    date: "20 Oct",
    status: "New review",
    note: "Good tempo. Your club is crossing the line at the top. Watch the red circle, then try the gate drill from last week.",
  },
  {
    title: "7 iron, before and after",
    kind: "Side by side with voiceover",
    coach: "Matt Grenot",
    date: "13 Oct",
    status: "Reviewed",
    note: "Compare the two swings. Your hands now finish higher and the ball flight is straighter. Keep that.",
  },
];

export default function MyReviews() {
  const [items, setItems] = useState<Review[]>([]);
  useEffect(() => {
    listReviews()
      .then((r) => setItems(r.sort((a, b) => b.createdAt - a.createdAt)))
      .catch(() => {});
  }, []);
  if (!items.length)
    return (
      <div className="grid gap-3">
        <p className="text-sm text-white/70">
          Feedback is your coach&apos;s review of a swing video or photo you sent them. It comes back with their drawings on your swing, a voiceover and a short note. Examples:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SAMPLES.map((r) => (
            <div key={r.title} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lime">
                  <span className="h-2 w-2 rounded-full bg-lime" /> {r.status}
                </span>
                <span className="rounded-full border border-white/25 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white/60">Sample</span>
              </div>
              <p className="mt-2 font-display text-xl">{r.title}</p>
              <p className="text-sm text-white/65">{r.kind} &middot; from {r.coach} &middot; {r.date}</p>
              <p className="mt-2 text-sm text-white/85">&ldquo;{r.note}&rdquo;</p>
              <Link href="/coach/swing-analysis" className="mt-3 inline-block text-sm font-semibold text-lime underline-offset-4 hover:underline">
                See how reviews work
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <div key={r.id} className="glass rounded-2xl p-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lime">
            <span className="h-2 w-2 rounded-full bg-lime" /> New review
          </span>
          <p className="mt-2 font-display text-xl">{r.title}</p>
          <p className="text-sm text-white/65">{r.media.length === 2 ? "Side by side" : r.media[0]?.kind === "image" ? "Photo" : "Video"} with voiceover and drawings</p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <Link href={`/my-golf/review?id=${r.id}`} className="btn !px-4 !py-2 !text-sm">Watch</Link>
            <button
              type="button"
              className="text-white/60 underline-offset-4 hover:underline"
              onClick={() => deleteReview(r.id).then(() => setItems((x) => x.filter((i) => i.id !== r.id)))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
