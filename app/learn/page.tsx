import type { Metadata } from "next";
import { videoCategories, videos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Golf training videos",
  description:
    "Free golf training videos on slices, draws, chipping, bunkers and more.",
};

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">Learn</h1>
      <p className="mt-2 max-w-xl text-white/80">
        Training videos to work on between lessons, sorted by what you want to fix.
      </p>

      {videos.length === 0 ? (
        <div className="glass mt-8 rounded-2xl p-6">
          <p className="font-semibold">Videos are being added.</p>
          <p className="mt-1 text-sm text-white/75">
            Categories: {videoCategories.join(", ")}.
          </p>
        </div>
      ) : (
        videoCategories.map((cat) => {
          const items = videos.filter((v) => v.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="mt-10">
              <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">
                {cat}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((v) => (
                  <div key={v.id} className="glass overflow-hidden rounded-2xl">
                    <iframe
                      className="aspect-video w-full"
                      src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <p className="p-3 text-sm font-semibold">{v.title}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
