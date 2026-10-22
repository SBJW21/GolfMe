"use client";

import { useEffect, useRef, useState } from "react";
import { hubReports, hubStudents } from "@/lib/coachHub";

const LINES = [
  "So today we worked on the slice.",
  "Path is still out to in, but better than last week.",
  "Strengthened the lead hand a touch in the grip.",
  "Gate drill with two tees, she got the feel for coming from the inside.",
  "Fairways on the range went from three out of ten to six.",
  "Homework is fifteen minutes a day on the gate drill, and film one swing.",
];

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function CoachRecent() {
  const [who, setWho] = useState(hubStudents[0].name);
  const [live, setLive] = useState(false);
  const [secs, setSecs] = useState(0);
  const [lines, setLines] = useState(0);
  const [drafting, setDrafting] = useState(false);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState("");
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const talk = useRef<ReturnType<typeof setInterval> | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      if (tick.current) clearInterval(tick.current);
      if (talk.current) clearInterval(talk.current);
    },
    [],
  );

  function toggle() {
    if (!live) {
      setLive(true);
      setSecs(0);
      setLines(0);
      setReady(false);
      setNote("");
      tick.current = setInterval(() => setSecs((s) => s + 1), 1000);
      talk.current = setInterval(() => setLines((n) => Math.min(n + 1, LINES.length)), 1400);
    } else {
      setLive(false);
      if (tick.current) clearInterval(tick.current);
      if (talk.current) clearInterval(talk.current);
      setDrafting(true);
      setTimeout(() => {
        setDrafting(false);
        setReady(true);
        setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
      }, 900);
    }
  }

  function reset() {
    setReady(false);
    setLines(0);
    setSecs(0);
    setNote("");
  }

  const first = who.split(" ")[0];

  return (
    <div className="grid gap-4">
      {/* Reports waiting */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <p className="font-bold">Reports waiting</p>
        <ul className="mt-2 divide-y divide-white/10">
          {hubReports.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
              <span>
                <span className="font-semibold">{r.student}</span>
                <span className="text-white/60"> &middot; {r.focus} &middot; {r.when}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setWho(r.student);
                  heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="rounded-full bg-lime px-3.5 py-1 font-semibold text-black"
              >
                Dictate
              </button>
            </li>
          ))}
        </ul>
      </div>


      {/* Dictation hero */}
      <div ref={heroRef} className="relative overflow-hidden rounded-3xl border border-lime/60 bg-[radial-gradient(circle_at_20%_0%,#27340f,#0b0d08_70%)] p-5 sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-lime">New for coaches</p>
        <h3 className="font-display mt-2 text-[clamp(1.8rem,6vw,3rem)] leading-[1.02]">
          Dictate your lesson report
        </h3>
        <p className="mt-3 max-w-xl text-white/85">
          Tap the microphone and talk through the lesson as you walk off the range. Golf Me turns
          it into a clear report for your student. No typing, no evenings of admin.
        </p>

        <ol className="mt-4 grid gap-2 text-sm text-white/85 sm:grid-cols-3">
          {["Tap the mic and talk", "Check the draft report", "Send it to your student"].map((t, i) => (
            <li key={t} className="flex items-center gap-2">
              <span className="font-display flex h-7 w-7 items-center justify-center rounded-full bg-lime text-black">
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={toggle}
            aria-label={live ? "Stop dictation" : "Start dictation"}
            className={`relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-lime transition ${
              live ? "bg-lime text-black" : "bg-black/60 text-lime hover:bg-lime hover:text-black"
            }`}
          >
            {live && <span className="absolute -inset-2 animate-ping rounded-full border-2 border-lime/60" />}
            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="currentColor" aria-hidden="true">
              <path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4Zm6-4a1 1 0 1 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.91V19H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.09A6 6 0 0 0 18 11Z" />
            </svg>
          </button>
          <div className="min-w-[160px]">
            <p className="font-display text-4xl">{fmt(secs)}</p>
            <p className="text-sm text-white/75">
              {live ? "Listening. Tap to finish" : drafting ? "Writing your report..." : ready ? "Draft ready below" : "Tap the mic to start"}
            </p>
            {live && (
              <div className="mt-2 flex h-9 items-center gap-1" aria-hidden="true">
                {Array.from({ length: 16 }, (_, i) => (
                  <span key={i} className="wave-bar" style={{ animationDelay: `${(i % 6) * 0.12}s`, height: `${14 + ((i * 7) % 22)}px` }} />
                ))}
              </div>
            )}
          </div>
          <label className="ml-auto text-sm text-white/75">
            Student
            <select
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="mt-1 block rounded-xl border border-white/20 bg-black/70 px-3 py-2.5 text-white"
            >
              {hubStudents.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
        </div>

        {(lines > 0 || live) && (
          <div className="mt-5 rounded-xl border border-dashed border-white/25 bg-black/30 p-4 text-sm text-white/85">
            {lines === 0 ? "..." : LINES.slice(0, lines).join(" ").replace("she got", `${first} got`)}
          </div>
        )}

        {ready && (
          <div ref={reportRef} className="mt-5 rounded-2xl border border-white/15 bg-black/50 p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
              Draft report for {who}. Tap any text to edit
            </p>
            <div className="mt-3 space-y-3 text-sm text-white/90 [&_[contenteditable]]:rounded-md [&_[contenteditable]]:px-1.5 [&_[contenteditable]:focus]:bg-lime/10 [&_[contenteditable]]:outline-none">
              <p contentEditable suppressContentEditableWarning className="font-bold">
                Lesson with Matt Grenot, 60 minutes
              </p>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lime">Summary</p>
                <p contentEditable suppressContentEditableWarning>
                  Good session on the slice. The path is still out to in, but the gate drill gave {first} a clear feel for an in to out approach.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lime">What we worked on</p>
                <ul contentEditable suppressContentEditableWarning className="list-disc pl-5">
                  <li>Grip: strengthened the lead hand slightly</li>
                  <li>Path: gate drill with two tees</li>
                  <li>Tempo: three-count rhythm with the driver</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lime">Numbers</p>
                <p contentEditable suppressContentEditableWarning>
                  Fairways hit on the range: 3 of 10 at the start and 6 of 10 at the end.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lime">Homework</p>
                <ul contentEditable suppressContentEditableWarning className="list-disc pl-5">
                  <li>15 minutes a day of the gate drill, no ball</li>
                  <li>Film one driver swing from behind and upload it</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
              <button type="button" onClick={() => setNote(`Preview only. In the live version this goes to ${who}.`)} className="btn">
                Send to {first}
              </button>
              <button type="button" onClick={reset} className="rounded-xl border border-white/40 px-4 py-2.5">
                Dictate again
              </button>
            </div>
            {note && <p className="mt-3 text-sm text-lime">{note}</p>}
          </div>
        )}
      </div>

    </div>
  );
}
