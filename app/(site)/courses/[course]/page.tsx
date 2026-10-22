import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoachCard from "@/components/CoachCard";
import { areaOfSuburb } from "@/lib/areas";
import { courseSuburbSlug, courses, getCourse, regionOf } from "@/lib/courses";
import { courseDetails } from "@/lib/courseDetails";
import { loadCoaches } from "@/lib/repo";
import { SITE_URL } from "@/lib/suburbs";

export const revalidate = 3600;

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export async function generateMetadata(props: PageProps<"/courses/[course]">): Promise<Metadata> {
  const { course } = await props.params;
  const c = getCourse(course);
  if (!c) return {};
  return {
    title: `${c.name}, ${c.suburb}: golf lessons nearby`,
    description: `Playing at ${c.name} in ${c.suburb}? Compare golf coaches nearby and book a lesson online before your next round.`,
    alternates: { canonical: `/courses/${c.slug}` },
  };
}

export default async function CoursePage(props: PageProps<"/courses/[course]">) {
  const { course } = await props.params;
  const c = getCourse(course);
  if (!c) notFound();

  const area = areaOfSuburb(c.suburb);
  const { coaches } = await loadCoaches();
  const nearby = area ? coaches.filter((k) => areaOfSuburb(k.suburb)?.id === area.id) : [];
  const suburbSlug = courseSuburbSlug(c);
  const d = courseDetails[c.slug];
  const rows: [string, string | undefined][] = d
    ? [["Bar", d.bar], ["Social area", d.social], ["Parking", d.parking], ["Nearest train", d.nearestTrain], ["Nearest bus", d.nearestBus]]
    : [];
  const shown = rows.filter(([, v]) => v) as [string, string][];
  const facts = [
    ["Suburb", c.suburb],
    ["Region", regionOf(c)],
    ...(c.holes ? [["Holes", String(c.holes)]] : []),
    ...(c.par ? [["Par", String(c.par)]] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GolfCourse",
    name: c.name,
    address: { "@type": "PostalAddress", addressLocality: c.suburb, addressRegion: "NSW", addressCountry: "AU" },
    url: c.website ?? `${SITE_URL}/courses/${c.slug}`,
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-white/60">
        <Link href="/courses" className="hover:text-lime">
          Golf courses
        </Link>{" "}
        / {c.name}
      </nav>
      <h1 className="font-display mt-3 text-[clamp(2.2rem,7vw,3.6rem)]">
        {c.name}, <span className="text-lime">{c.suburb}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-white/85">
        {c.name} is a golf course in {c.suburb}, in Sydney&apos;s {regionOf(c)}. Before your next round there, a lesson with a
        local coach can take shots off your score.
      </p>

      <dl className="mt-6 flex flex-wrap gap-3">
        {facts.map(([k, v]) => (
          <div key={k} className="glass rounded-2xl px-5 py-3">
            <dt className="text-xs uppercase tracking-[0.14em] text-white/50">{k}</dt>
            <dd className="font-display text-2xl text-lime">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-white/50">
        Course details from Fairway Finders, checked 22 October 2026. Contact the course for fees, hours and tee times.
      </p>

      {c.website && (
        <p className="mt-4">
          <a href={c.website} target="_blank" rel="noopener" className="text-lime underline-offset-4 hover:underline">
            Book a round on the course website
          </a>
        </p>
      )}

      {shown.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Facilities and getting there</h2>
          <dl className="glass mt-4 grid gap-x-8 gap-y-4 rounded-2xl p-5 sm:grid-cols-2">
            {shown.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">{k}</dt>
                <dd className="mt-0.5 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {d?.source && (
            <p className="mt-2 text-xs text-white/50">
              Checked {d.checked ?? "recently"}.{" "}
              <a href={d.source} target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
                Source
              </a>
            </p>
          )}
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Golf lessons near {c.name}</h2>
        {nearby.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((k) => (
              <CoachCard key={k.slug} coach={k} />
            ))}
          </div>
        ) : (
          <div className="glass mt-4 rounded-2xl p-6">
            <p className="font-bold">No coaches listed near {c.suburb} yet</p>
            <p className="mt-1 text-white/80">We are signing up coaches across Sydney. See everyone available now.</p>
            <Link href="/coaches" className="btn mt-4 inline-block">
              Find a coach
            </Link>
          </div>
        )}
        {suburbSlug && (
          <p className="mt-4 text-sm text-white/70">
            More on{" "}
            <Link href={`/golf-lessons/${suburbSlug}`} className="text-lime underline-offset-4 hover:underline">
              golf lessons in {c.suburb}
            </Link>
            .
          </p>
        )}
      </section>
    </main>
  );
}
