"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getReview, type Review } from "@/lib/reviewStore";
import { drawShape, prepCanvas } from "@/lib/swingDraw";

const clock = () => performance.now();

export default function ReviewViewer({ id }: { id: string }) {
  const [review, setReview] = useState<Review | null | undefined>(undefined);
  const [urls, setUrls] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ms, setMs] = useState(0);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const cans = useRef<(HTMLCanvasElement | null)[]>([]);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let alive = true;
    const made: string[] = [];
    getReview(id)
      .then((r) => {
        if (!alive) return;
        setReview(r ?? null);
        if (!r) return;
        const u = r.media.map((m) => URL.createObjectURL(m.blob));
        made.push(...u);
        setUrls(u);
        if (r.audio) {
          const a = URL.createObjectURL(r.audio);
          made.push(a);
          setAudioUrl(a);
        }
      })
      .catch(() => alive && setReview(null));
    return () => {
      alive = false;
      made.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [id]);

  useEffect(() => {
    if (!review) return;
    review.media.forEach((_, v) => {
      const c = cans.current[v];
      if (!c) return;
      const prep = prepCanvas(c);
      if (!prep) return;
      const { g, w, h } = prep;
      review.strokes
        .filter((s) => s.view === v)
        .filter((s) => (playing ? s.atMs === null || (s.atMs <= ms && (s.removedMs === null || s.removedMs > ms)) : s.removedMs === null))
        .forEach((s) => drawShape(g, w, h, s.tool, s.pts, s.color));
    });
  }, [review, ms, playing, urls]);

  function stop() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
    audio.current?.pause();
    vids.current.forEach((v) => v?.pause());
    setPlaying(false);
  }

  function play() {
    if (!review) return;
    setPlaying(true);
    setMs(0);
    const t0 = clock();
    const evs = review.events;
    evs.filter((e) => e.ms === 0).forEach((e) => {
      const v = vids.current[e.view];
      if (v && e.kind === "seek") v.currentTime = e.v;
    });
    const rate = evs.find((e) => e.kind === "rate");
    if (rate) vids.current.forEach((v) => v && (v.playbackRate = rate.v));
    if (audio.current) {
      audio.current.currentTime = 0;
      void audio.current.play();
      audio.current.onended = stop;
    }
    const tick = window.setInterval(() => setMs(clock() - t0), 50);
    timers.current.push(tick);
    evs
      .filter((e) => e.ms > 0)
      .forEach((e) =>
        timers.current.push(
          window.setTimeout(() => {
            const v = vids.current[e.view];
            if (!v) return;
            if (e.kind === "seek") v.currentTime = e.v;
            if (e.kind === "pause") v.pause();
            if (e.kind === "play") void v.play();
            if (e.kind === "rate") v.playbackRate = e.v;
          }, e.ms),
        ),
      );
    if (!audio.current) {
      const last = evs.reduce((m, e) => Math.max(m, e.ms), 0) + 3000;
      timers.current.push(window.setTimeout(stop, last));
    }
  }

  if (review === undefined) return <p className="text-white/70">Loading your review...</p>;
  if (review === null)
    return (
      <div className="glass rounded-2xl p-6">
        <p className="font-display text-2xl">Review not found</p>
        <p className="mt-2 text-white/75">
          Demo reviews are saved in the browser they were made in. Record one in the coach swing studio, then save it to My Golf.
        </p>
        <Link href="/coach/swing-analysis" className="btn mt-4 inline-block !text-sm">Open the swing studio</Link>
      </div>
    );

  const n = review.media.length;
  return (
    <div>
      <div className={`grid gap-2 ${n === 2 ? "sm:grid-cols-2" : "mx-auto max-w-md"}`}>
        {review.media.map((m, v) => (
          <div key={v} className="relative aspect-[9/16] overflow-hidden rounded-xl bg-black">
            {urls[v] &&
              (m.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urls[v]} alt="" className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <video
                  ref={(el) => {
                    vids.current[v] = el;
                  }}
                  src={urls[v]}
                  playsInline
                  muted
                  controls={!review.audio}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ))}
            <canvas
              ref={(el) => {
                cans.current[v] = el;
              }}
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {review.audio || review.events.length > 0 ? (
          <button type="button" className="btn !px-6 !py-2.5 !text-sm" onClick={playing ? stop : play}>
            {playing ? "Stop" : "Play Matt's review"}
          </button>
        ) : null}
        <Link href="/my-golf" className="text-sm text-white/70 underline-offset-4 hover:underline">Back to My Golf</Link>
      </div>
      {audioUrl && <audio ref={audio} src={audioUrl} className="hidden" />}
    </div>
  );
}
