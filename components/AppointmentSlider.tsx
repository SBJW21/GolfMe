"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import CoachPhoto from "./CoachPhoto";
import { formatAud } from "@/lib/pricing";
import type { Appointment } from "@/lib/myGolf";

/** Swipeable row of appointment cards. Upcoming first, past ones greyed out after them. */
export default function AppointmentSlider({ items }: { items: Appointment[] }) {
  const track = useRef<HTMLDivElement>(null);
  const firstUpcomingId = items.find((x) => !x.past)?.id;

  // Start on the first upcoming lesson so past lessons sit just off-screen to the left.
  useEffect(() => {
    const el = track.current;
    const first = el?.querySelector<HTMLElement>("[data-upcoming]");
    const prev = first?.previousElementSibling as HTMLElement | null;
    if (el && first) {
      // Show about half of the most recent past lesson, then the upcoming ones.
      el.scrollLeft = prev ? prev.offsetLeft + prev.offsetWidth / 2 - 16 : first.offsetLeft - 16;
    }
  }, []);

  function scrollBy(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 340), behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-4 flex gap-3">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => scrollBy(d)}
            aria-label={d < 0 ? "Scroll to earlier cards" : "Scroll to later cards"}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-lime/60 text-2xl text-lime hover:bg-lime hover:text-black"
          >
            {d < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
      <div
        ref={track}
        className="slider-scroll relative -mx-4 flex gap-4 overflow-x-auto px-4 pb-1"
      >
        {items.map((a) => (
          <article
            key={a.id}
            data-upcoming={a.past ? undefined : ""}
            className={`glass relative w-[38%] shrink-0 overflow-hidden rounded-2xl p-3 sm:w-[300px] sm:p-5 ${
              a.past ? "opacity-55 grayscale" : "!border-lime/50"
            }`}
          >
            <span className="absolute inset-x-0 top-0 hidden h-[3px] bg-white/10 sm:block">
              {!a.past && <span className="block h-full w-full bg-lime" />}
            </span>
            <span
              className={`mb-2 block w-fit rounded-full px-2 py-1 text-[0.55rem] font-extrabold uppercase leading-none tracking-[0.1em] sm:absolute sm:right-4 sm:top-4 sm:mb-0 sm:px-2.5 sm:text-[0.65rem] sm:tracking-[0.14em] ${
                a.past ? "bg-white/20 text-white" : "bg-lime text-black"
              }`}
            >
              {a.past ? "Completed" : "Upcoming"}
            </span>
            <p className="font-display text-2xl text-lime sm:text-4xl">{a.dateLabel}</p>
            <p className="mt-1 text-xs font-semibold text-white/85 sm:text-sm">
              {a.weekday}, {a.time}
            </p>
            <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
              <CoachPhoto slug={a.coachSlug} name={a.coachName} photo={a.coachPhoto} className="h-8 w-8 shrink-0 sm:h-12 sm:w-12" />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold sm:text-base">{a.coachName}</p>
                <p className="truncate text-xs text-white/70 sm:text-sm">{a.place}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/80 sm:mt-3 sm:text-sm">{a.focus}</p>
            <p className="mt-1 hidden text-sm text-white/60 sm:block">{formatAud(a.priceCents)} per hour</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold sm:mt-4 sm:gap-2 sm:text-sm">
              {a.past ? (
                a.reportHref ? (
                  <a href={a.reportHref} target="_blank" rel="noreferrer" className="rounded-lg border border-white/40 px-2.5 py-1 sm:px-3 sm:py-1.5">
                    View report
                  </a>
                ) : (
                  <Link href={`/coaches/${a.coachSlug}`} className="rounded-lg border border-white/40 px-2.5 py-1 sm:px-3 sm:py-1.5">
                    Rebook
                  </Link>
                )
              ) : (
                a.id === firstUpcomingId ? (
                  <>
                    <span className="rounded-full bg-lime px-3 py-1 sm:px-4 sm:py-1.5 text-black">Message</span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-white/60">
                      Modify
                    </span>
                  </>
                ) : (
                  <>
                    <span className="rounded-lg border border-white/40 px-2.5 py-1 sm:px-3 sm:py-1.5">Reschedule</span>
                    <span className="rounded-lg border border-white/20 px-2.5 py-1 sm:px-3 sm:py-1.5 text-white/70">Cancel</span>
                  </>
                )
              )}
            </div>
          </article>
        ))}
        {/* Trailing room so the first upcoming lesson can sit at the left edge on wide screens. */}
        <div aria-hidden="true" className="w-[25%] shrink-0" />
      </div>
    </div>
  );
}
