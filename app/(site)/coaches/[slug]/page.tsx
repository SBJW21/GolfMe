import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoachPhoto from "@/components/CoachPhoto";
import SampleNotice from "@/components/SampleNotice";
import Stars from "@/components/Stars";
import SlotPicker from "@/components/SlotPicker";
import { averageRating } from "@/lib/data";
import { getCoach, getSlots } from "@/lib/repo";
import { formatAud } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/coaches/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const found = await getCoach(slug);
  if (!found) return {};
  const { coach } = found;
  return {
    title: `${coach.name}, golf coach in ${coach.suburb}`,
    description: coach.headline,
  };
}

export default async function CoachPage(props: PageProps<"/coaches/[slug]">) {
  const { slug } = await props.params;
  const found = await getCoach(slug);
  if (!found) notFound();
  const { coach, isSample } = found;

  const slots = await getSlots(coach);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/coaches" className="text-sm text-lime">
        &larr; All coaches
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex items-center gap-4 sm:gap-5">
            <CoachPhoto
              slug={coach.slug}
              name={coach.name}
              photo={coach.photo}
              className="h-20 w-20 shrink-0 sm:h-28 sm:w-28"
            />
            <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">
              {coach.name}
            </h1>
          </div>
          <p className="mt-2 text-white/80">
            {coach.title ? `${coach.title}, ` : ""}
            {coach.suburb}
            {coach.yearsCoaching > 0 && <> &middot; {coach.yearsCoaching} years coaching</>}
          </p>
          <div className="mt-2">
            <Stars rating={averageRating(coach)} count={coach.reviews.length} />
          </div>

          <p className="mt-6 text-xl font-semibold">{coach.headline}</p>
          <p className="mt-3 text-white/85">{coach.bio}</p>

          {coach.badges && coach.badges.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {coach.badges.map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-lime/50 px-3 py-1 text-sm font-semibold text-lime"
                >
                  {b}
                </li>
              ))}
            </ul>
          )}

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
            <SampleNotice show={isSample && !coach.preview} />
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
            Choose a time. Cancel up to 24 hours before for full account credit.
          </p>
          <SlotPicker slots={slots} bookPath={`/book/${coach.slug}`} sidebar />
        </aside>
      </div>
    </main>
  );
}
