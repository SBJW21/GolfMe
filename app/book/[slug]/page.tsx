import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { getCoach, sampleSlots } from "@/lib/data";
import { FREE_CANCELLATION_HOURS, formatAud } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Book a lesson",
  robots: { index: false },
};

export default async function BookPage(props: PageProps<"/book/[slug]">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const coach = getCoach(slug);
  if (!coach) notFound();

  const slot = Array.isArray(sp.slot) ? sp.slot[0] : sp.slot;
  const valid = slot && sampleSlots(coach.slug).some((s) => s.startsAt === slot);

  if (!slot || !valid) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="font-display text-4xl">Choose a time</h1>
        <p className="mt-3 text-white/80">
          That time is no longer available. Please pick another time on the coach&apos;s page.
        </p>
        <Link href={`/coaches/${coach.slug}`} className="btn mt-6">
          Back to {coach.name}
        </Link>
      </main>
    );
  }

  const when = new Date(slot);
  const whenLabel = when.toLocaleString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <Link href={`/coaches/${coach.slug}`} className="text-sm text-lime">
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
          Free cancellation up to {FREE_CANCELLATION_HOURS} hours before the lesson.
          Inside {FREE_CANCELLATION_HOURS} hours the lesson is not refundable.
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-card p-5">
        <BookingForm slug={coach.slug} slot={slot} />
      </div>
    </main>
  );
}
