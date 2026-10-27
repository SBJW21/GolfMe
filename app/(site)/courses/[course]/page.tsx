import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoachPhoto from "@/components/CoachPhoto";
import CourseMap from "@/components/CourseMap";
import { formatAud } from "@/lib/pricing";
import { areaOfSuburb } from "@/lib/areas";
import { courseSuburbSlug, courses, getCourse, regionOf } from "@/lib/courses";
import { courseDetails } from "@/lib/courseDetails";
import { loadCoaches } from "@/lib/repo";
import { SITE_URL } from "@/lib/suburbs";

export const revalidate = 3600;

const cta = "btn !px-5 !py-2.5 !text-sm";

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

  const sameRegion = courses.filter((x) => x.slug !== c.slug && regionOf(x) === regionOf(c)).slice(0, 6);
  const nineNear = courses.filter((x) => x.slug !== c.slug && x.holes === 9 && regionOf(x) === regionOf(c)).slice(0, 4);
  const sameSuburb = nearby.filter((k) => k.suburb === c.suburb);
  const faq: [string, string][] = [];
  if (c.holes) faq.push([`How many holes is ${c.name}?`, `${c.name} has ${c.holes} holes${c.par ? ` and is par ${c.par}` : ""}.`]);
  else if (c.par) faq.push([`What is the par at ${c.name}?`, `${c.name} is listed as par ${c.par}.`]);
  if (bookingHref) faq.push([`How do I book a tee time at ${c.name}?`, `Book directly with the club through its own site. Tee times, fees and hours are set by the club, so check them there before you travel.`]);
  if (d?.bar || d?.social) faq.push([`Is there food and drink at ${c.name}?`, [d?.bar, d?.social].filter(Boolean).join(". ") + "."]);
  if (d?.nearestTrain || d?.nearestBus || d?.parking) faq.push([`How do I get to ${c.name}?`, [d?.nearestTrain && `Train: ${d.nearestTrain}`, d?.nearestBus && `Bus: ${d.nearestBus}`, d?.parking && `Parking: ${d.parking}`].filter(Boolean).join(". ") + "."]);
  if (d?.highlights?.length) faq.push([`What should I know before playing ${c.name}?`, d.highlights.join(". ") + "."]);
  if (c.holes === 9)
    faq.push([
      `Are there other nine hole courses near ${c.name}?`,
      nineNear.length > 0
        ? `In the ${regionOf(c)} region, other nine hole courses include ${nineNear.map((x) => x.name).join(", ")}. See every nine hole course we have confirmed on our nine hole courses page.`
        : `See every nine hole course we have confirmed on our nine hole courses page.`,
    ]);
  if (sameRegion.length > 0)
    faq.push([`What other golf courses are in the ${regionOf(c)} region?`, `Other courses in the ${regionOf(c)} region include ${sameRegion.map((x) => x.name).join(", ")}.`]);
  faq.push([
    `Can I get golf lessons near ${c.name}?`,
    sameSuburb.length > 0
      ? `Yes. ${sameSuburb.map((k) => `${k.name}${k.title ? ` (${k.title})` : ""}`).join(" and ")} teach${sameSuburb.length === 1 ? "es" : ""} in ${c.suburb}. Compare prices and reviews, then book online.`
      : nearby.length > 0
      ? `Yes. ${nearby.length === 1 ? "A coach" : `${nearby.length} coaches`} on Golf Me teach${nearby.length === 1 ? "es" : ""} near ${c.suburb}. Compare prices and reviews, then book online.`
      : `We are signing up coaches near ${c.suburb}. Browse every coach on Golf Me to compare prices and book online.`,
  ]);
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-white/60">
        <Link href="/courses" className="hover:text-lime">
          Find a course
        </Link>{" "}
        / {c.name}
      </nav>
      <h1 className="font-display mt-2 text-[clamp(2.2rem,7vw,3.6rem)]">
        {c.name}, <span className="text-lime">{c.suburb}</span>
      </h1>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
        {facts.map(([k, v]) => (
          <li key={k} className="rounded-full border border-white/20 px-3 py-1">
            {k === "Holes" ? `${v} holes` : k === "Par" ? `Par ${v}` : v}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-3">
        {bookingHref && (
          <a href={bookingHref} target="_blank" rel="noopener" className={cta}>
            Book a tee time
          </a>
        )}
        <a href="#coaches" className={cta}>
          Find a coach nearby
        </a>
      </div>

      <section className="mt-8">
        <CourseMap name={c.name} interactive viewer showHoleMap holeData={d?.holeData} scorecardUrl={bookingHref} />
      </section>

      <section className="mt-10 grid items-start gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-2xl">Good to know</h2>
          {d?.howItPlays && <p className="mt-3 text-white/90">{d.howItPlays}</p>}
          {d?.highlights && d.highlights.length > 0 && (
            <ul className="mt-3 grid gap-2.5">
              {d.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[0.95rem]">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          {shown.length > 0 && (
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-white/10 pt-4 text-sm">
              {shown.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-white/55">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-3 text-xs text-white/50">
            Checked {d?.checked ?? "23 October 2026"}.
            {d?.source && (
              <>
                {" "}
                <a href={d.source} target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
                  Source
                </a>
                .
              </>
            )}{" "}
            Contact the course for fees, hours and tee times.
          </p>
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-2xl">Questions</h2>
          <div className="mt-2 divide-y divide-white/10">
            {faq.slice(0, 6).map(([q, a], i) => (
              <details key={q} open={i === 0} className="py-3">
                <summary className="cursor-pointer font-bold">{q}</summary>
                <p className="mt-2 text-sm text-white/80">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="coaches" className="mt-10 scroll-mt-20">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Lower your score first</h2>
        {nearby.length > 0 ? (
          <ul className="mt-3 grid gap-3 md:grid-cols-3">
            {nearby.slice(0, 3).map((k) => (
              <li key={k.slug}>
                <Link href={`/coaches/${k.slug}`} className="glass flex items-center gap-3 rounded-2xl p-3 hover:!border-lime/70">
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
          <p className="mt-3 text-white/75">We are signing up coaches near {c.suburb}. See everyone available now.</p>
        )}
        <div className="mt-4">
          <Link href="/coaches" className={cta}>
            See all coaches
          </Link>
          {suburbSlug && (
            <Link href={`/golf-lessons/${suburbSlug}`} className="ml-4 text-sm text-lime underline-offset-4 hover:underline">
              Golf lessons in {c.suburb}
            </Link>
          )}
        </div>
        {sameRegion.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            {sameRegion.map((x) => (
              <li key={x.slug}>
                <Link href={`/courses/${x.slug}`} className="inline-block rounded-full border border-white/20 px-3 py-1.5 hover:border-lime hover:text-lime">
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
