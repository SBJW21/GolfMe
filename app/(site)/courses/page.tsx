import type { Metadata } from "next";
import Link from "next/link";
import { courses, regions } from "@/lib/courses";
import { regionOf } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Sydney golf courses and nearby lessons",
  description:
    "Sydney golf courses by suburb, with coaches who teach nearby. Find a lesson before your next round.",
};

export default function CoursesIndex() {
  const sorted = [...courses].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">Sydney golf courses</h1>
      <p className="mt-2 max-w-xl text-white/80">
        Playing at one of these courses soon? Find a coach nearby and sharpen your game first.
      </p>
      <p className="mt-3 text-sm">
        <Link href="/courses/9-hole" className="text-lime underline-offset-4 hover:underline">Browse 9 hole courses</Link>
      </p>
      <nav aria-label="Regions" className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
        {regions.map((r) => (
          <a key={r} href={`#${r.toLowerCase().replace(/ /g, "-")}`} className="rounded-full border border-white/20 px-3 py-1.5 hover:border-lime hover:text-lime">
            {r}
          </a>
        ))}
      </nav>
      {regions.map((r) => {
        const list = sorted.filter((c) => regionOf(c) === r);
        if (list.length === 0) return null;
        return (
          <section key={r} id={r.toLowerCase().replace(/ /g, "-")} className="mt-10 scroll-mt-24">
            <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)] text-lime">{r}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {list.map((c) => (
                <li key={c.slug}>
                  <Link href={`/courses/${c.slug}`} className="glass block rounded-2xl p-4 hover:!border-lime/70">
                    <p className="font-bold">{c.name}</p>
                    <p className="text-sm text-white/70">{c.suburb}, {r}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
