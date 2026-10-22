import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "@/lib/courses";

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
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {sorted.map((c) => (
          <li key={c.slug}>
            <Link href={`/courses/${c.slug}`} className="glass block rounded-2xl p-4 hover:!border-lime/70">
              <p className="font-bold">{c.name}</p>
              <p className="text-sm text-white/70">{c.suburb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
