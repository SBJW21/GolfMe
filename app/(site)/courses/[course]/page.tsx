import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoachCard from "@/components/CoachCard";
import CoachPhoto from "@/components/CoachPhoto";
import CourseMap from "@/components/CourseMap";
import CourseWeather from "@/components/CourseWeather";
import { formatAud } from "@/lib/pricing";
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
  const bookingHref = d?.bookingUrl ?? c.website;
  const shown = rows.filter(([, v]) => v) as [string, string][];
  const facts = [
    ["Suburb", c.suburb],
    ["Region", regionOf(c)],
    ...(c.holes ? [["Holes", String(c.holes)]] : []),
    ...(c.par ? [["Par", String(c.par)]] : []),
  ];

  const faq: [string, string][] = [];
  if (c.holes) faq.push([`How many holes is ${c.name}?`, `${c.name} has ${c.holes} holes${c.par ? ` and is par ${c.par}` : ""}.`]);
  else if (c.par) faq.push([`What is the par at ${c.name}?`, `${c.name} is listed as par ${c.par}.`]);
  if (bookingHref) faq.push([`How do I book a tee time at ${c.name}?`, `Book directly with the club through its own site. Tee times, fees and hours are set by the club, so check them there before you travel.`]);
  if (d?.bar || d?.social) faq.push([`Is there food and drink at ${c.name}?`, [d?.bar, d?.social].filter(Boolean).join(". ") + "."]);
  if (d?.nearestTrain || d?.nearestBus || d?.parking) faq.push([`How do I get to ${c.name}?`, [d?.nearestTrain && `Train: ${d.nearestTrain}`, d?.nearestBus && `Bus: ${d.nearestBus}`, d?.parking && `Parking: ${d.parking}`].filter(Boolean).join(". ") + "."]);
  faq.push([
    `Can I get golf lessons near ${c.name}?`,
    nearby.length > 0
      ? `Yes. ${nearby.length === 1 ? "A coach" : `${nearby.length} coaches`} on Golf Me teach${nearby.length === 1 ? "es" : ""} near ${c.suburb}. Compare prices and reviews, then book online.`
      : `We are signing up coaches near ${c.suburb}. Browse every coach on Golf Me to compare prices and book online.`,
  ]);
  const sameRegion = courses.filter((x) => x.slug !== c.slug && regionOf(x) === regionOf(c)).slice(0, 6);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Golf courses", item: `${SITE_URL}/courses` },
      { "@type": "ListItem", position: 2, name: c.name, item: `${SITE_URL}/courses/${c.slug}` },
    ],
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
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
        Course details from club, council and Golf Australia pages and Fairway Finders, checked 23 October 2026. Contact the course for fees, hours and tee times.
      </p>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Course map</h2>
          <CourseMap name={c.name} interactive holeData={d?.holeData} scorecardUrl={bookingHref} />
        </div>
        <div className="grid content-start gap-4">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-2xl">Ready to tee off?</h2>
            {bookingHref ? (
              <>
                <p className="mt-1 text-sm text-white/75">Book your round directly with the club. It opens the club&apos;s own site.</p>
                <a href={bookingHref} target="_blank" rel="noopener" className="btn mt-4 inline-block">
                  Book a tee time
                </a>
              </>
            ) : (
              <p className="mt-1 text-sm text-white/75">Contact {c.name} directly for tee times, fees and hours.</p>
            )}
          </div>
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-2xl">Want to lower your score first?</h2>
            <p className="mt-1 text-sm text-white/75">Meet our coaches near {c.suburb}.</p>
            {nearby.length > 0 ? (
              <ul className="mt-3 grid gap-2">
                {nearby.slice(0, 3).map((k) => (
                  <li key={k.slug}>
                    <Link
                      href={`/coaches/${k.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-white/10 p-2 hover:border-lime/60"
                    >
                      <CoachPhoto slug={k.slug} name={k.name} photo={k.photo} className="h-12 w-12 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold">{k.name}</span>
                        <span className="block truncate text-xs text-white/65">
                          {k.title ? `${k.title}, ` : ""}
                          {k.suburb}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-sm font-bold">
                        {formatAud(k.priceCents)}
                        <span className="block text-[0.65rem] font-normal text-white/55">per hour</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-white/75">We are signing up coaches across Sydney.</p>
            )}
            <Link href="/coaches" className="btn mt-4 inline-block !text-base">
              Find a coach
            </Link>
          </div>
        </div>
      </section>

      {d?.howItPlays && (
        <section className="mt-10">
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">How it plays</h2>
          <div className="glass mt-4 rounded-2xl p-5">
            <p className="text-white/90">{d.howItPlays}</p>
            {d.howItPlaysBy && <p className="mt-3 text-sm text-white/60">By {d.howItPlaysBy}, Golf Me coach</p>}
          </div>
        </section>
      )}

      {d?.highlights && d.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Good to know</h2>
          <ul className="glass mt-4 grid gap-3 rounded-2xl p-5">
            {d.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      <CourseWeather suburb={c.suburb} />

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

      <section className="mt-10">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Questions about {c.name}</h2>
        <div className="mt-4 grid gap-3">
          {faq.map(([q, a]) => (
            <details key={q} className="glass rounded-2xl p-4">
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-2 text-white/85">{a}</p>
            </details>
          ))}
        </div>
      </section>

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

      {sameRegion.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">More courses in {regionOf(c)}</h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            {sameRegion.map((x) => (
              <li key={x.slug}>
                <Link href={`/courses/${x.slug}`} className="inline-block rounded-full border border-white/20 px-3 py-1.5 hover:border-lime hover:text-lime">
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
