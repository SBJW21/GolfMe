import type { Metadata } from "next";
import Link from "next/link";
import { areas } from "@/lib/areas";
import { slugify } from "@/lib/suburbs";

export const metadata: Metadata = {
  title: "Golf lessons across Sydney",
  description:
    "Find golf lessons in your Sydney suburb. Compare local coaches, prices and reviews, then book online.",
};

export default function GolfLessonsIndex() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">
        Golf lessons across Sydney
      </h1>
      <p className="mt-2 max-w-xl text-white/80">
        Pick your suburb to see coaches nearby, what they charge and when they are free.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {areas.map((a) => (
          <section key={a.id} className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl text-lime">{a.label}</h2>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
              {a.suburbs.map((s) => (
                <li key={s}>
                  <Link href={`/golf-lessons/${slugify(s)}`} className="text-white/85 hover:text-lime">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
