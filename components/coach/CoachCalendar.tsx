"use client";

import { useState } from "react";
import type { HubDay, HubLesson, HubWeek } from "@/lib/coachHub";

type Picked = { d: HubDay; l: HubLesson };

function firstUpcoming(list: HubWeek[]): Picked | null {
  for (const wk of list) for (const d of wk.days) if (!d.isPast && d.lessons[0]) return { d, l: d.lessons[0] };
  for (const wk of list) for (const d of wk.days) if (d.lessons[0]) return { d, l: d.lessons[0] };
  return null;
}

/** Collapsible calendar showing two weeks at a time, stacked. Tap a lesson to see its details. */
export default function CoachCalendar({ weeks }: { weeks: HubWeek[] }) {
  const last = weeks.length - 2;
  const [open, setOpen] = useState(true);
  const [w, setW] = useState(1);
  const shown = [weeks[w], weeks[w + 1]];
  const count = shown.reduce((n, wk) => n + wk.days.reduce((m, d) => m + d.lessons.length, 0), 0);
  const [picked, setPicked] = useState<Picked | null>(() => firstUpcoming([weeks[1], weeks[2]]));

  function go(next: number) {
    if (next < 0 || next > last) return;
    setW(next);
    setPicked(firstUpcoming([weeks[next], weeks[next + 1]]));
  }

  const names = ["Last week", "This week", "Next week", "In two weeks", "In three weeks"];

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-3 text-left"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-lime/60 text-lime transition ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            &#9662;
          </span>
          <span>
            <span className="block text-lg font-bold">
              {count} {count === 1 ? "lesson" : "lessons"} {w === 1 ? "in the next 2 weeks" : "in these 2 weeks"}
            </span>
            <span className="block text-sm text-white/65">
              {shown[0].days[0].label} to {shown[1].days[6].label}
            </span>
          </span>
        </button>
        {open && (
          <div className="flex gap-2">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(w + d)}
                disabled={w + d < 0 || w + d > last}
                aria-label={d < 0 ? "Earlier" : "Later"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 hover:border-lime hover:text-lime disabled:opacity-30"
              >
                {d < 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <>
          {shown.map((wk, wi) => (
            <div key={wk.label} className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                {names[w + wi]} <span className="font-normal normal-case tracking-normal">&middot; {wk.label}</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-7">
                {wk.days.map((d) => (
                  <div
                    key={d.iso}
                    className={`rounded-xl border p-2.5 sm:min-h-[120px] ${
                      d.isToday ? "border-lime/70 bg-lime/10" : "border-white/10"
                    } ${d.isPast ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-baseline gap-2 sm:block">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">{d.weekday}</p>
                      <p className={`font-display text-xl ${d.isToday ? "text-lime" : ""}`}>{d.dateNum}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5 sm:flex-col">
                      {d.lessons.map((l) => {
                        const on = picked?.l.id === l.id;
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setPicked({ d, l })}
                            className={`rounded-lg px-2 py-1 text-left text-xs font-semibold leading-tight ${
                              on ? "bg-lime text-black" : "border border-lime/40 text-white hover:border-lime"
                            }`}
                          >
                            <span className="block">{l.time}</span>
                            <span className="block truncate font-normal">{l.student.split(" ")[0]}</span>
                          </button>
                        );
                      })}
                      {d.lessons.length === 0 && <span className="text-xs text-white/30">Free</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {picked && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-lime/40 bg-black/40 p-4">
              <div>
                <p className="font-bold">
                  {picked.d.weekday} {picked.d.label}, {picked.l.time}
                </p>
                <p className="text-sm text-white/75">
                  {picked.l.student} &middot; {picked.l.focus} &middot; {picked.l.place}
                </p>
              </div>
              <div className="flex gap-2 text-sm font-semibold">
                <span className="rounded-full bg-lime px-4 py-1.5 text-black">Message</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-white/60">Modify</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
