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
      className="glass flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:border-lime/60"
    >
      <CoachPhoto slug={coach.slug} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold">{coach.name}</h3>
            <p className="text-sm text-white/70">{coach.suburb}</p>
            <div className="mt-3 flex flex-wrap justify-start gap-1.5">
              {coach.focus.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-white/80"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <p className="shrink-0 text-right">
            <span className="text-xl font-bold">{formatAud(coach.priceCents)}</span>
            <span className="block text-xs text-white/60">per hour</span>
          </p>
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          {quote ? (
            <p className="mb-2 line-clamp-2 min-h-[2.75rem] text-sm italic text-white/85">
              &ldquo;{quote}&rdquo;
            </p>
          ) : (
            <div className="mb-2 min-h-[2.75rem]" />
          )}
          <Stars rating={averageRating(coach)} count={coach.reviews.length} />
        </div>
      </div>
    </Link>
  );
}
