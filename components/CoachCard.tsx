import Link from "next/link";
import type { Coach } from "@/lib/types";
import { averageRating } from "@/lib/data";
import { formatAud } from "@/lib/pricing";
import CoachPhoto from "./CoachPhoto";
import Stars from "./Stars";

export default function CoachCard({ coach }: { coach: Coach }) {
  const quote = coach.reviews.find((r) => r.text.trim() !== "")?.text;

  return (
    <Link
      href={`/coaches/${coach.slug}`}
      className="glass flex flex-col rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-lime/60 sm:p-5"
    >
      {/* Mobile: photo beside the name. Desktop: photo centred above it. */}
      <div className="flex items-start gap-3 sm:flex-col sm:items-stretch sm:gap-4">
        <CoachPhoto
          slug={coach.slug}
          name={coach.name}
          photo={coach.photo}
          className="h-14 w-14 shrink-0 sm:mx-auto sm:h-28 sm:w-28"
        />
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold sm:text-lg">{coach.name}</h3>
            <p className="text-sm text-white/70">{coach.suburb}</p>
          </div>
          <p className="shrink-0 text-right">
            <span className="text-lg font-bold sm:text-xl">
              {formatAud(coach.priceCents)}
            </span>
            <span className="block text-xs text-white/60">per hour</span>
          </p>
        </div>
      </div>

      <div className="my-3 flex flex-wrap justify-start gap-1.5 sm:mb-4">
        {coach.focus.map((f) => (
          <span
            key={f}
            className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-white/80"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-white/10 pt-3 sm:pt-4">
        {quote ? (
          <p className="mb-2 line-clamp-2 text-sm italic text-white/85 sm:min-h-[2.75rem]">
            &ldquo;{quote}&rdquo;
          </p>
        ) : (
          <div className="mb-2 hidden sm:block sm:min-h-[2.75rem]" />
        )}
        <Stars rating={averageRating(coach)} count={coach.reviews.length} />
      </div>
    </Link>
  );
}
