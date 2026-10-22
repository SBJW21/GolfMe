import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoachCard from "@/components/CoachCard";
import SampleNotice from "@/components/SampleNotice";
import { areaOfSuburb } from "@/lib/areas";
import { averageRating } from "@/lib/data";
import { formatAud } from "@/lib/pricing";
import { loadCoaches } from "@/lib/repo";
import { coursesInArea } from "@/lib/courses";
import { suburbCopy } from "@/lib/suburbCopy";
import { getSuburbPage, slugify, SITE_URL, suburbPages } from "@/lib/suburbs";

export const revalidate = 3600;

export function generateStaticParams() {
  return suburbPages.map((s) => ({ suburb: s.slug }));
}

async function build(page: NonNullable<ReturnType<typeof getSuburbPage>>) {
  const { coaches, isSample } = await loadCoaches();
  const nearby = coaches.filter((c) => areaOfSuburb(c.suburb)?.id === page.area.id);
  const inSuburb = nearby.filter((c) => slugify(c.suburb) === page.slug);
  const neighbours = page.area.suburbs.filter((s) => slugify(s) !== page.slug);
  const copy = suburbCopy({
    slug: page.slug,
    name: page.name,
    areaLabel: page.area.label,
    neighbours,
    nearby,
    inSuburb,
  });
  return { isSample, nearby, inSuburb, neighbours, copy };
}

export async function generateMetadata(
  props: PageProps<"/golf-lessons/[suburb]">,
): Promise<Metadata> {
  const { suburb } = await props.params;
  const page = getSuburbPage(suburb);
  if (!page) return {};
  const { copy } = await build(page);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `/golf-lessons/${page.slug}` },
  };
}

export default async function SuburbPage(props: PageProps<"/golf-lessons/[suburb]">) {
  const { suburb } = await props.params;
  const page = getSuburbPage(suburb);
  if (!page) notFound();

  const { isSample, nearby, inSuburb, neighbours, copy } = await build(page);
  const cheapest = copy.cheapest;

  const faqs = [
    {
      q: `How do I find a golf coach in ${page.name}?`,
      a:
        nearby.length > 0
          ? `Golf Me lists ${nearby.length} ${nearby.length === 1 ? "coach" : "coaches"} serving ${page.name} and nearby suburbs including ${neighbours.slice(0, 3).join(", ")}. Compare prices and reviews, then book a time online.`
          : `We are adding coaches around ${page.name} now. Search all of Sydney or register your interest and we will let you know when a coach joins nearby.`,
    },
    {
      q: `How much are golf lessons in ${page.name}?`,
      a:
        cheapest !== null
          ? `Lessons near ${page.name} start from ${formatAud(cheapest)} per hour. Each coach sets their own price, shown on their profile.`
          : `Each coach sets their own price, shown on their profile. Sydney lessons are typically booked by the hour.`,
    },
    { q: copy.beginnerQ, a: copy.beginnerA },
    {
      q: "What if I need to cancel?",
      a: "Cancel up to 24 hours before and the full amount goes to your Golf Me account credit. Use it with any coach within 6 months.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Golf Me", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Golf lessons", item: `${SITE_URL}/golf-lessons` },
        { "@type": "ListItem", position: 3, name: page.name, item: `${SITE_URL}/golf-lessons/${page.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    ...(nearby.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Golf coaches near ${page.name}`,
            itemListElement: nearby.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/coaches/${c.slug}`,
              name: c.name,
            })),
          },
        ]
      : []),
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-white/60">
        <Link href="/golf-lessons" className="hover:text-lime">
          Golf lessons
        </Link>{" "}
        / {page.name}
      </nav>
      <h1 className="font-display mt-3 text-[clamp(2.2rem,7vw,3.6rem)]">
        {copy.h1Lead} <span className="text-lime">{page.name}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-white/85">{copy.intro}</p>
      {(copy.teaches || copy.priceLine) && (
        <p className="mt-2 max-w-2xl text-white/75">
          {copy.teaches} {copy.priceLine}
        </p>
      )}

      <div className="mt-6">
        <SampleNotice show={isSample} />
      </div>

      {nearby.length > 0 ? (
        <div className="mt-6">
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">{copy.listHeading}</h2>
        </div>
      ) : null}
      {nearby.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...nearby]
            .sort((a, b) => (averageRating(b) ?? 0) - (averageRating(a) ?? 0))
            .map((c) => (
              <CoachCard key={c.slug} coach={c} />
            ))}
        </div>
      ) : (
        <div className="glass mt-6 rounded-2xl p-6">
          <p className="font-bold">No coaches in {page.name} yet</p>
          <p className="mt-1 text-white/80">See every Sydney coach while we sign up more nearby.</p>
          <Link href="/coaches" className="btn mt-4 inline-block">
            Find a coach
          </Link>
        </div>
      )}

      <section className="mt-12">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">{copy.alsoHeading}</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
          {neighbours.map((s) => (
            <li key={s}>
              <Link
                href={`/golf-lessons/${slugify(s)}`}
                className="pill-arrow block rounded-full border border-white/20 px-3 py-1.5 hover:border-lime hover:text-lime"
              >
                {s}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {coursesInArea(page.area.id).length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Golf courses near {page.name}</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
            {coursesInArea(page.area.id).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="pill-arrow block rounded-full border border-white/20 px-3 py-1.5 hover:border-lime hover:text-lime"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12 max-w-3xl">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">
          Golf lessons in {page.name}: questions
        </h2>
        <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/15">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}
                <span aria-hidden="true" className="text-lime transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-white/80">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-sm text-white/70">
          More answers on the <Link href="/faq" className="text-lime underline-offset-4 hover:underline">FAQ page</Link>.
        </p>
      </section>
    </main>
  );
}
