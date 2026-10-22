import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Golf Me blog",
  description: "Guides to golf lessons, courses and improving your game in Sydney.",
};

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">Blog</h1>
      <div className="mt-8 grid gap-4">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="glass block rounded-2xl p-5 hover:!border-lime/70">
            <p className="text-xs text-white/50">{p.date}</p>
            <h2 className="font-display mt-1 text-2xl text-lime">{p.title}</h2>
            <p className="mt-2 text-white/80">{p.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
