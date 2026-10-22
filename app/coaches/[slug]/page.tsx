import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SampleNotice from "@/components/SampleNotice";
import Stars from "@/components/Stars";
import { averageRating, getCoach, sampleSlots } from "@/lib/data";
import { formatAud } from "@/lib/pricing";

export async function generateMetadata(
  props: PageProps<"/coaches/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const coach = getCoach(slug);
  if (!coach) return {};
  return {
    title: `${coach.name}, golf coach in ${coach.suburb}`,
    description: coach.headline,
  };
}

function dayLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function timeLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
}

export default async function CoachPage(props: PageProps<"/coaches/[slug]">) {
  const { slug } = await props.params;
  const coach = getCoach(slug);
  if (!coach) notFound();

  const slots = sampleSlots(coach.slug);
  const byDay = new Map<string, string[]>();
  for (const s of slots) {
    const [date, time] = s.startsAt.split("T");
    byDay.set(date, [...(byDay.get(date) ?? []), time]);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/coaches" className="text-sm text-lime">
        &larr; All coaches
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">
            {coach.name}
          </h1>
          <p className="mt-2 text-white/80">
            {coach.suburb} &middot; {coach.yearsCoaching} years coaching
          </p>
          <div className="mt-2">
            <Stars rating={averageRating(coach)} count={coach.reviews.length} />
          </div>

          <p className="mt-6 text-xl font-semibold">{coach.headline}</p>
          <p className="mt-3 text-white/85">{coach.bio}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {coach.focus.map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/85"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <SampleNotice />
          </div>

          <h2 className="font-display mt-10 text-[clamp(1.7rem,5vw,2.3rem)]">
            Reviews
          </h2>
          {coach.reviews.length === 0 ? (
            <p className="mt-3 text-white/70">No reviews yet.</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {coach.reviews.map((r) => (
                <li key={r.id} className="glass rounded-2xl p-4">
                  <Stars rating={r.rating} />
                  <p className="mt-2 text-sm text-white/90">{r.text}</p>
                  <p className="mt-2 text-xs text-white/55">
                    {r.author} &middot;{" "}
                    {new Date(r.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="glass h-fit rounded-2xl p-5 lg:sticky lg:top-20">
          <p>
            <span className="text-3xl font-bold">{formatAud(coach.priceCents)}</span>
            <span className="ml-1 text-white/60">per hour</span>
          </p>
          <h2 className="mt-4 text-lg font-bold">Book a lesson</h2>
          <p className="text-sm text-white/70">
            Choose a time. Free cancellation up to 24 hours before.
          </p>
          <div className="mt-4 grid max-h-[420px] gap-4 overflow-y-auto pr-1">
            {Array.from(byDay.entries()).map(([date, times]) => (
              <div key={date}>
                <p className="mb-1.5 text-sm font-semibold">{dayLabel(date)}</p>
                <div className="flex flex-wrap gap-2">
                  {times.map((t) => (
                    <Link
                      key={t}
                      href={`/book/${coach.slug}?slot=${encodeURIComponent(`${date}T${t}`)}`}
                      className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:border-lime hover:bg-lime hover:text-black"
                    >
                      {timeLabel(t)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
