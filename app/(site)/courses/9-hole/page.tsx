import type { Metadata } from "next";
import Link from "next/link";
import { courses, regionOf } from "@/lib/courses";
import { courseDetails } from "@/lib/courseDetails";

export const metadata: Metadata = {
  title: "9 hole golf courses in Sydney",
  description:
    "Sydney golf courses with nine holes, with par and what each club states about its course. Find a coach nearby before you play.",
  alternates: { canonical: "/courses/9-hole" },
};

export default function NineHole() {
  const list = courses.filter((c) => c.holes === 9).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-white/60">
        <Link href="/courses" className="hover:text-lime">Golf courses</Link> / 9 hole
      </nav>
      <h1 className="font-display mt-3 text-[clamp(2.2rem,7vw,3.4rem)]">9 hole golf courses in Sydney</h1>
      <p className="mt-2 max-w-2xl text-white/80">
        Nine hole courses suit a shorter round, a first game or a practice loop after a lesson. These are the nine hole courses we have confirmed details for. Contact each course for fees, hours and tee times.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((c) => {
          const d = courseDetails[c.slug];
          return (
            <li key={c.slug}>
              <Link href={`/courses/${c.slug}`} className="glass block h-full rounded-2xl p-5 hover:!border-lime/70">
                <p className="font-display text-2xl">{c.name}</p>
                <p className="text-sm text-white/70">{c.suburb}, {regionOf(c)}{c.par ? `, par ${c.par}` : ""}</p>
                {d?.highlights?.[0] && <p className="mt-2 text-white/85">{d.highlights[0]}</p>}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-sm text-white/65">
        Want to lower your score first? <Link href="/coaches" className="text-lime underline-offset-4 hover:underline">Meet our coaches</Link>.
      </p>
    </main>
  );
}
