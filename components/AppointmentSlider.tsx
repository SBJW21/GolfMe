"use client";

import Link from "next/link";
import { useRef } from "react";
import CoachPhoto from "./CoachPhoto";
import { formatAud } from "@/lib/pricing";
import type { Appointment } from "@/lib/myGolf";

/** Swipeable row of appointment cards. Upcoming first, past ones greyed out after them. */
export default function AppointmentSlider({ items }: { items: Appointment[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 340), behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-3 flex justify-end gap-2">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => scrollBy(d)}
            aria-label={d < 0 ? "Scroll to earlier cards" : "Scroll to later cards"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-lg hover:border-lime hover:text-lime"
          >
            {d < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
      <div
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin]"
      >
        {items.map((a) => (
          <article
            key={a.id}
            className={`glass relative w-[78%] shrink-0 snap-start rounded-2xl p-5 sm:w-[300px] ${
              a.past ? "opacity-55 grayscale" : "!border-lime/50"
            }`}
          >
            <span className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-white/10">
              {!a.past && <span className="block h-full w-full rounded-t-2xl bg-lime" />}
            </span>
            <span
              className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase leading-none tracking-[0.14em] ${
                a.past ? "bg-white/20 text-white" : "bg-lime text-black"
              }`}
            >
              {a.past ? "Completed" : "Upcoming"}
            </span>
            <p className="font-display text-4xl text-lime">{a.dateLabel}</p>
            <p className="mt-1 text-sm font-semibold text-white/85">
              {a.weekday}, {a.time}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <CoachPhoto slug={a.coachSlug} name={a.coachName} photo={a.coachPhoto} className="h-12 w-12 shrink-0" />
              <div className="min-w-0">
                <p className="truncate font-bold">{a.coachName}</p>
                <p className="truncate text-sm text-white/70">{a.place}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80">{a.focus}</p>
            <p className="mt-1 text-sm text-white/60">{formatAud(a.priceCents)} per hour</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
              {a.past ? (
                a.reportHref ? (
                  <a href={a.reportHref} target="_blank" rel="noreferrer" className="rounded-lg border border-white/40 px-3 py-1.5">
                    View report
                  </a>
                ) : (
                  <Link href={`/coaches/${a.coachSlug}`} className="rounded-lg border border-white/40 px-3 py-1.5">
                    Rebook
                  </Link>
                )
              ) : (
                <>
                  <span className="rounded-lg border border-white/40 px-3 py-1.5">Reschedule</span>
                  <span className="rounded-lg border border-white/20 px-3 py-1.5 text-white/70">Cancel</span>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
