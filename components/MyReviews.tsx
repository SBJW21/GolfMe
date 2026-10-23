"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listReviews, deleteReview, type Review } from "@/lib/reviewStore";

export default function MyReviews() {
  const [items, setItems] = useState<Review[]>([]);
  useEffect(() => {
    listReviews()
      .then((r) => setItems(r.sort((a, b) => b.createdAt - a.createdAt)))
      .catch(() => {});
  }, []);
  if (!items.length) return <p className="text-sm text-white/60">Reviews from your coach, with their drawings and voiceover, appear here.</p>;
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
