import Link from "next/link";
import type { Coach } from "@/lib/types";
import { averageRating } from "@/lib/data";
import { formatAud } from "@/lib/pricing";
import Stars from "./Stars";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Link
      href={`/coaches/${coach.slug}`}
      className="glass flex flex-col gap-3 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-lime/60"
    >
      <div className="flex items-center gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime/15 font-display text-xl text-lime"
          aria-hidden="true"
        >
          {initials(coach.name)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{coach.name}</h3>
          <p className="text-sm text-white/70">{coach.suburb}</p>
        </div>
        <p className="ml-auto text-right">
          <span className="text-xl font-bold">{formatAud(coach.priceCents)}</span>
          <span className="block text-xs text-white/60">per hour</span>
        </p>
      </div>
      <p className="text-sm text-white/85">{coach.headline}</p>
      <div className="flex flex-wrap gap-1.5">
        {coach.focus.map((f) => (
          <span
            key={f}
            className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-white/80"
          >
            {f}
          </span>
        ))}
      </div>
      <Stars rating={averageRating(coach)} count={coach.reviews.length} />
    </Link>
  );
}
