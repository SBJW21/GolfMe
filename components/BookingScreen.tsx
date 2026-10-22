import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import { CREDIT_VALID_MONTHS, FREE_CANCELLATION_HOURS, formatAud } from "@/lib/pricing";
import type { Coach } from "@/lib/types";

/** The booking page content, shared by the main site and a coach's own page. */
export default function BookingScreen({
  coach,
  slot,
  valid,
  backHref,
  source,
}: {
  coach: Coach;
  slot: string | undefined;
  valid: boolean;
  backHref: string;
  source: "site" | "solo";
}) {
  if (!slot || !valid) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="font-display text-4xl">Choose a time</h1>
        <p className="mt-3 text-white/80">
          That time is no longer available. Please pick another time on the coach&apos;s page.
        </p>
        <Link href={backHref} className="btn mt-6">
          Back to {coach.name}
        </Link>
      </main>
    );
  }

  const whenLabel = new Date(slot).toLocaleString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <Link href={backHref} className="text-sm text-lime">
        &larr; Back to {coach.name}
      </Link>
      <h1 className="font-display mt-4 text-[clamp(2.2rem,7vw,3.4rem)]">
        Book your lesson
      </h1>

      <div className="glass mt-6 rounded-2xl p-5">
        <p className="text-lg font-bold">{coach.name}</p>
        <p className="text-white/80">{coach.suburb}</p>
        <p className="mt-3">{whenLabel}</p>
        <p className="text-white/70">60 minutes</p>
        <p className="mt-3 text-2xl font-bold">{formatAud(coach.priceCents)}</p>
        <p className="mt-2 text-sm text-white/70">
          Cancel up to {FREE_CANCELLATION_HOURS} hours before the lesson and the full amount
          goes to your Golf Me account credit. Use it with any coach within {CREDIT_VALID_MONTHS}{" "}
          months. Inside {FREE_CANCELLATION_HOURS} hours no credit is given.
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-card p-5">
        <BookingForm slug={coach.slug} slot={slot} source={source} />
      </div>
    </main>
  );
}
