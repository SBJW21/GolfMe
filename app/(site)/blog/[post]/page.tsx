import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/blog";
import { SITE_URL } from "@/lib/suburbs";

export function generateStaticParams() {
  return posts.map((p) => ({ post: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[post]">): Promise<Metadata> {
  const { post } = await props.params;
  const p = getPost(post);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description },
  };
}

export default async function BlogPost(props: PageProps<"/blog/[post]">) {
  const { post } = await props.params;
  const p = getPost(post);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    author: { "@type": "Organization", name: "Golf Me" },
    publisher: { "@type": "Organization", name: "Golf Me" },
    mainEntityOfPage: `${SITE_URL}/blog/${p.slug}`,
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="text-sm text-lime">
        &larr; Blog
      </Link>
      <p className="mt-4 text-xs text-white/50">{p.date}</p>
      <h1 className="font-display mt-1 text-[clamp(2rem,6vw,3rem)]">{p.title}</h1>
      <article className="mt-6 grid gap-4 text-lg leading-relaxed text-white/85">
        {p.blocks.map((b, i) => (
          <section key={i} className="grid gap-4">
            {b.h && <h2 className="font-display mt-4 text-[clamp(1.5rem,5vw,2rem)] text-white">{b.h}</h2>}
            {b.p.map((t, j) => (
              <p key={j}>{t}</p>
            ))}
          </section>
        ))}
      </article>
      <section className="mt-10">
        <h2 className="font-display text-xl">Sources</h2>
        <ul className="mt-2 grid gap-1 text-sm">
          {p.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener" className="text-lime underline-offset-4 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-10">
        <Link href="/coaches" className="btn">
          Find a coach
        </Link>
      </div>
    </main>
  );
}
