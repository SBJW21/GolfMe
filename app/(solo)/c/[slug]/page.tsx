import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CoachPhoto from "@/components/CoachPhoto";
import SampleNotice from "@/components/SampleNotice";
import SlotPicker from "@/components/SlotPicker";
import Stars from "@/components/Stars";
import { averageRating, focusSentence } from "@/lib/data";
import { formatAud } from "@/lib/pricing";
import { getCoach, getSlots } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/c/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const found = await getCoach(slug);
  if (!found) return {};
  const { coach } = found;
  const title = `${coach.name}, golf coach in ${coach.suburb}`;
  const description = `${coach.name} services ${coach.suburb} and surrounding areas. Works well with ${focusSentence(coach.focus)}.`;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, type: "profile" },
    ...(coach.preview ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * A coach's own page: the one they share on Instagram, their website or in a message.
 * It has no Golf Me menu and no links to the rest of the site.
 */
export default async function SoloCoachPage(props: PageProps<"/c/[slug]">) {
  const { slug } = await props.params;
  const found = await getCoach(slug);
  if (!found) notFound();
  const { coach, isSample } = found;
  const slots = await getSlots(coach);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <section className="flex flex-col items-center text-center">
        <CoachPhoto
          slug={coach.slug}
          name={coach.name}
          photo={coach.photo}
          className="h-32 w-32 sm:h-40 sm:w-40"
        />
        <h1 className="font-display mt-5 text-[clamp(2.6rem,9vw,4.2rem)]">
          {coach.name}
        </h1>
        {coach.title && (
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-lime">
            {coach.title}
          </p>
        )}
        <p className="mt-3 max-w-xl text-lg text-white/90">
          {coach.name} services {coach.suburb} and surrounding areas.
          {coach.focus.length > 0 && <> Works well with {focusSentence(coach.focus)}.</>}
        </p>
        {coach.badges && coach.badges.length > 0 && (
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {coach.badges.map((b) => (
              <li
                key={b}
                className="rounded-full border border-lime/50 px-3.5 py-1 text-sm font-semibold text-lime"
              >
                {b}
              </li>
            ))}
          </ul>
        )}
        {coach.reviews.length > 0 && (
          <div className="mt-3">
            <Stars rating={averageRating(coach)} count={coach.reviews.length} />
          </div>
        )}
        {coach.preview ? (
          <p className="mt-4 max-w-md text-xs uppercase tracking-[0.16em] text-white/45">
            Preview page. Price and available times are examples
          </p>
        ) : (
          isSample && (
            <div className="mt-4">
              <SampleNotice show />
            </div>
          )
        )}
      </section>

      {(coach.headline || coach.bio) && (
        <section className="mt-10 text-center">
          {coach.headline && <p className="text-xl font-semibold">{coach.headline}</p>}
          {coach.bio && <p className="mx-auto mt-3 max-w-xl text-white/85">{coach.bio}</p>}
        </section>
      )}

      <section className="glass mt-10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-bold">Book a lesson</h2>
          <p>
            <span className="text-2xl font-bold">{formatAud(coach.priceCents)}</span>
            <span className="ml-1 text-sm text-white/60">per hour</span>
          </p>
        </div>
        <p className="mt-1 text-sm text-white/70">
          Choose a time. Free cancellation up to 24 hours before.
        </p>
        <SlotPicker slots={slots} bookPath={`/c/${coach.slug}/book`} />
      </section>

      {coach.reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">
            What golfers say
          </h2>
          <ul className="mt-4 grid gap-3">
            {coach.reviews.map((r) => (
              <li key={r.id} className="glass rounded-2xl p-4">
                <Stars rating={r.rating} />
                <p className="mt-2 text-sm text-white/90">{r.text}</p>
                <p className="mt-2 text-xs text-white/55">{r.author}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
